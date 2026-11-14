# Why individually healthy components can still produce an unreliable application.

## Introduction

A service can have excellent uptime, a fast average response time, and a healthy dashboard—and the overall product can still feel unreliable.

This happens because users experience complete request paths, not isolated components. A request may pass through authentication, retrieval, model routing, orchestration, storage, and audit infrastructure. Every dependency adds another opportunity for delay or failure.

Reliability therefore has to be designed across the whole system. It is not a property that can be achieved by making each service look healthy in isolation.

This becomes especially important in enterprise AI systems, where a single user request may trigger several network calls, long-running jobs, model-provider requests, and financially consequential actions.

## 1. Average latency hides the slow requests

Average response time is useful, but it does not describe the experience of the slowest requests.

Percentiles provide a clearer picture:

| Metric | Meaning |
|---|---|
| p50 | Half of requests complete within this time |
| p95 | 95% of requests complete within this time |
| p98 | 98% of requests complete within this time |
| p99 | 99% of requests complete within this time |

Suppose a service reports a p99 latency of five seconds. That means 99% of requests complete within five seconds, while the slowest 1% take longer.

For an interactive product, that slow tail matters. Users may experience a request as stalled even when the average is low.

## 2. Serial dependencies compound risk

Imagine a request that must pass through several services in sequence. If every dependency has a chance of becoming slow, adding dependencies increases the chance that at least one part of the path will be slow.

Under a simplified model where each service independently has a probability `p` of experiencing a particular stall, the probability of at least one stall across `N` services is:

\[
P(\text{at least one stall}) = 1 - (1-p)^N
\]

For a 1% stall probability per service:

| Chained services | Probability of at least one stall |
|---:|---:|
| 1 | 1.00% |
| 10 | 9.56% |
| 30 | 26.03% |

This model assumes independent events and is intended to illustrate the effect of dependency count. Real systems may have correlated failures, shared infrastructure, and different latency distributions.

Availability compounds in a similar way when every service in a serial path must be available.

\[
A_{\text{total}} = A_1 \times A_2 \times \cdots \times A_k
\]

If eight services each have 99.9% availability:

\[
0.999^8 \approx 0.992028
\]

That is approximately 99.20% end-to-end availability under the independence and serial-dependency assumptions.

For a 30-day month of 720 hours:

\[
\text{Expected downtime} = (1-A_{\text{total}})\times720
\]

At approximately 99.20% availability, that corresponds to roughly 5.74 hours of expected downtime.

The lesson is not that services should never be separated. It is that every dependency should earn its place by providing a meaningful benefit.

## 3. The ambiguous outcome: a timeout is not proof of failure

Distributed systems have a failure mode that is easy to underestimate: the caller may not know what happened.

Consider this sequence:

1. An API sends a request to create a workflow.
2. The workflow service receives and processes the request.
3. The service commits the new workflow.
4. Its response is lost due to a network interruption.
5. The API reaches its timeout.

The workflow exists, but the caller does not know that.

A timeout means the caller stopped waiting. It does not necessarily mean the remote operation stopped.

This is why retries must be designed around the type of operation.

### Idempotency

An operation is idempotent when repeating the same logical request has the same intended effect as performing it once.

For a create operation, an idempotency key can associate retries with the original request:

```python
async def create_workflow(request, idempotency_key, store):
    existing = await store.get_by_key(idempotency_key)

    if existing is not None:
        return existing

    # In production, key reservation and creation must be atomic
    # or protected by a uniqueness constraint.
    workflow = await persist_workflow(request)
    await store.save(idempotency_key, workflow.id)

    return workflow
```

This is illustrative pseudocode. A production implementation must make key reservation and resource creation atomic, typically through a transaction or a unique database constraint. Otherwise, two concurrent retries can still race.

## 4. Deadlines, timeouts, and retries

Timeouts limit how long one operation waits. Deadlines describe the total time budget for a larger operation.

For example, a workflow may have a 20-second overall deadline. If authentication consumes two seconds and retrieval consumes eight, the model call should not receive a fresh 20 seconds. It should receive only the remaining budget, less any time reserved for finalisation.

A useful rule is to propagate the deadline through the call chain.

Retries should be selective. They can help with transient failures, but they can also amplify an outage when every caller retries at once.

Exponential backoff increases the delay between attempts:

\[
t_n = \min(t_{\max}, t_0 \times 2^n)
\]

With an initial delay of one second, the sequence is approximately 1, 2, 4, and 8 seconds, up to the configured maximum.

Jitter adds randomness to those delays so that many clients do not retry simultaneously.

```python
import random

def retry_delay(attempt: int, base: float = 1.0,
                maximum: float = 20.0) -> float:
    exponential = min(maximum, base * (2 ** attempt))
    return random.uniform(0, exponential)
```

A retry policy should also define:

- Which errors are retryable.
- The maximum number of attempts.
- The total deadline.
- Whether the operation is safe to repeat.
- The cost of another attempt.
- What happens when all attempts fail.

Retries are not a substitute for capacity management or failure isolation.

## 5. Circuit breakers and graceful degradation

A circuit breaker temporarily stops requests to a dependency that is repeatedly failing. This prevents an unhealthy dependency from consuming resources through endless calls.

A simplified circuit breaker has three states:

| State | Behaviour |
|---|---|
| Closed | Requests flow normally; failures are observed |
| Open | Requests are rejected or routed to an approved fallback |
| Half-open | A limited number of test requests determine whether recovery has occurred |

Graceful degradation means keeping essential functionality available when a non-essential capability fails.

For example, an AI platform might still allow a user to view previously saved documents if a model provider is unavailable. It should not, however, bypass tenant authorization or mandatory audit controls to keep a request moving.

Fallbacks must respect tenant policy, data residency, privacy requirements, and model approval rules. An unapproved provider is not a safe fallback simply because it is reachable.

## 6. Reliability engineering and the AWS Reliability Pillar

The AWS Well-Architected Reliability Pillar groups reliability practices into four broad areas:

| Area | What it addresses |
|---|---|
| Foundations | Infrastructure, networking, quotas, capacity, and service limits |
| Workload architecture | Dependencies, communication, queues, fault isolation, and recovery |
| Change management | Controlled deployments, automation, monitoring, and rollback |
| Failure management | Detection, containment, recovery, and disaster preparation |

This framing is useful because reliability is not only about handling a server crash. It includes the way a system is provisioned, changed, observed, and recovered.

### Recovery objectives

Two important disaster-recovery measurements are RTO and RPO.

- **RTO (Recovery Time Objective):** the target time within which a service should be restored.
- **RPO (Recovery Point Objective):** the maximum acceptable amount of data loss measured in time.

For example:

| Objective | Target | Interpretation |
|---|---:|---|
| RTO | 1 hour | Restore the service within one hour |
| RPO | 15 minutes | Limit data loss to the equivalent of the most recent 15 minutes of changes |

These are business requirements, not merely infrastructure settings. They should be chosen based on the impact of downtime and data loss.

A backup is not a complete recovery strategy until restoration has been tested.

## 7. AI workflows need financial deadlines too

An AI workflow has more than a time budget. It also has a cost budget.

An execution context might carry:

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ExecutionContext:
    tenant_id: str
    principal_id: str
    trace_id: str
    workflow_id: str
    deadline: datetime
    maximum_budget: float
    reserved_budget: float
    spent_budget: float
```

The basic calculation is:

\[
\text{Remaining budget} =
\text{Maximum budget} - \text{Spent budget}
\]

But checking the budget only after a model call is too late: the cost has already been incurred.

A safer approach is:

1. Estimate the expected cost before the call.
2. Reserve that amount against the workflow or tenant budget.
3. Reject or constrain the call if the reservation would exceed policy.
4. Execute the request.
5. Reconcile the reservation against actual provider usage.
6. Release unused reserved budget.

Concurrent calls need special care. If two workers independently read the same remaining balance, both may spend it. Budget reservation therefore needs atomic coordination, such as a transactional ledger or another concurrency-safe mechanism.

## 8. Audit integrity is more than logging

Operational logs help diagnose incidents. Audit records establish what happened during important business or security actions. These records have different requirements.

A hash chain links each audit record to the previous one:

\[
H_n = \operatorname{SHA256}(record_n \parallel H_{n-1})
\]

If an earlier record is changed, subsequent hashes no longer match during verification.

This can make certain forms of tampering detectable, but a hash chain alone does not guarantee tamper-proof storage. A complete design also needs durable storage, access controls, integrity verification, retention policies, and backups.

For a mandatory compliance event, the system may need to fail closed if the required audit record cannot be durably committed. Best-effort diagnostic logging can have a different policy.

## 9. A practical failure-handling checklist

| Failure scenario | Useful mechanism |
|---|---|
| Dependency responds too slowly | Timeout and propagated deadline |
| Temporary network or provider failure | Classified retry with backoff and jitter |
| Repeated dependency failure | Circuit breaker |
| Caller cannot tell whether a mutation completed | Idempotency key and operation-status lookup |
| Job repeatedly fails | Dead-letter queue and operator workflow |
| Optional capability is unavailable | Safe graceful degradation |
| Workflow may exceed tenant spend limit | Pre-call budget reservation and reconciliation |
| Critical audit write fails | Explicit fail-closed policy where required |
| Region or infrastructure becomes unavailable | Tested disaster-recovery plan |

No mechanism should be added without defining its failure behaviour. A retry policy, for example, can itself become a source of overload if it is not bounded.

## Conclusion

Reliability is an end-to-end property. Good component-level uptime is useful, but it does not guarantee a good user experience when dependencies are chained together.

The most important design habits are to measure tail latency, understand dependency paths, propagate deadlines, make retries safe, isolate failures, reserve financial budgets before spending, and test recovery rather than assuming it will work.

In distributed systems, uncertainty is unavoidable. The engineering goal is to make that uncertainty explicit and give the system a safe, observable response when things go wrong.

## Further reading

- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [MIT 6.5840 — Introduction to Distributed Systems](https://pdos.csail.mit.edu/6.824/schedule.html)
