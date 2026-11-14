# How to keep request handling responsive while moving expensive work to the right place.

## Introduction

An API endpoint can look simple from the outside: accept a request, process it, and return a response. In an enterprise AI product, however, the work behind that request may involve parsing a large PDF, running OCR, generating embeddings, searching a knowledge base, calling a language model, and coordinating several tools.

Putting all of that work inside the request-handling process can create performance and reliability problems.

The key is to understand which work belongs in the API process, which work should be asynchronous, and which work should run in isolated workers. Distributed-computing ideas such as MapReduce help explain how large workloads can be divided, scheduled, and recovered.

## 1. What Python's event loop does

Python's `asyncio` event loop coordinates asynchronous tasks. It is especially useful for I/O-bound workloads, where a task often has to wait for a network response, database query, or file operation.

A useful mental model is a waiter serving several tables. When one table is waiting for its food, the waiter can take another order. The waiter does not need to stand still until the kitchen finishes.

An asynchronous coroutine behaves similarly. When it reaches an `await` for an operation that yields control, the event loop can schedule other ready tasks.

```python
import asyncio


async def fetch_record(record_id: str) -> dict:
    # Represents an asynchronous I/O operation.
    await asyncio.sleep(0.2)
    return {"id": record_id, "status": "ready"}


async def main() -> None:
    records = await asyncio.gather(
        fetch_record("a"),
        fetch_record("b"),
        fetch_record("c"),
    )
    print(records)


asyncio.run(main())
```

The example simulates I/O with `asyncio.sleep`. In a real application, the awaited operation would be an asynchronous database or network call.

This is cooperative multitasking: tasks yield control at points where they are waiting.

## 2. Event-loop starvation

The event loop cannot schedule other coroutines on its thread while that thread is occupied by long-running synchronous work.

Examples of potentially expensive CPU-bound work include:

- Parsing large or complex PDFs.
- OCR and image processing.
- Extracting complex tables.
- Large transformations or compression tasks.
- CPU-heavy document classification.

If this work runs directly inside an async request handler, other coroutines may be delayed. The symptoms can include slow streaming responses, delayed health checks, timeouts, and rising p95 or p99 latency.

```python
import asyncio
import time


def cpu_heavy_work() -> int:
    # Illustrative blocking work.
    total = 0
    for number in range(10_000_000):
        total += number
    return total


async def unhealthy_handler() -> int:
    # This synchronous function blocks the event-loop thread.
    return cpu_heavy_work()


async def main() -> None:
    started = time.perf_counter()

    await asyncio.gather(
        unhealthy_handler(),
        asyncio.sleep(0.1),
    )

    print(f"Elapsed: {time.perf_counter() - started:.2f}s")


asyncio.run(main())
```

The `sleep` coroutine cannot make normal progress while the event-loop thread is blocked by the synchronous function.

For some workloads, moving a blocking call to a thread can help:

```python
async def handler() -> int:
    return await asyncio.to_thread(cpu_heavy_work)
```

However, threads are not a universal solution for CPU-bound Python code. The Global Interpreter Lock (GIL), native extensions, memory usage, and workload characteristics all matter. A process pool or separate worker service may be more appropriate for CPU-intensive tasks.

The Linux kernel schedules operating-system processes and threads. It does not automatically schedule Python coroutines inside an event-loop thread that is blocked by synchronous code.

## 3. Separate request handling from long-running work

A useful architecture separates interactive request handling from workloads with very different resource needs.

```text
                 ┌─────────────────────┐
Client ─────────▶│ API / Request Layer │
                 └──────────┬──────────┘
                            │
                 validate, authorize,
                    create job
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Durable Job Queue   │
                 └──────────┬──────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌─────────────────┐       ┌──────────────────┐
      │ Agent Workers   │       │ Ingestion Workers│
      │                 │       │                  │
      │ Tool workflows  │       │ PDF / OCR        │
      │ Model calls     │       │ Extraction       │
      │ Coordination    │       │ Chunking         │
      └────────┬────────┘       │ Embeddings       │
               │                └────────┬─────────┘
               └────────────┬────────────┘
                            ▼
                   ┌─────────────────┐
                   │ Result Storage  │
                   └─────────────────┘
```

The API layer should generally handle:

- Authentication and authorization.
- Input validation.
- Tenant and policy checks.
- Creating a durable job record.
- Enqueuing the work.
- Returning a job identifier.

A long-running request can return HTTP `202 Accepted` to indicate that the request has been accepted for processing, rather than claiming the work has already completed.

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "job_id": "job_01J...",
  "status": "queued"
}
```

The client can then poll a status endpoint, receive a notification, or subscribe to an approved event stream.

A queue should be durable when losing the job would be unacceptable. The job record should also have a clear state model, such as `queued`, `running`, `succeeded`, `failed`, and `cancelled`.

## 4. Separate workloads by resource profile

Different kinds of work need different resources.

| Workload | Typical characteristics | Possible execution environment |
|---|---|---|
| API requests | Short-lived, latency-sensitive, mostly I/O | Async API process |
| Agent workflows | Long-running, network-heavy, stateful coordination | Agent worker pool |
| PDF and OCR processing | CPU- and memory-intensive | Ingestion worker pool |
| Embedding generation | Network or accelerator dependent | Dedicated embedding workers where justified |

These worker pools can use the same codebase and even the same container image with different entrypoints and resource limits.

That is an important distinction: runtime isolation does not automatically require a microservices architecture. A modular monolith can have separate worker processes that execute different parts of the application.

## 5. Queue processing needs explicit failure semantics

A queue does not make a job execute exactly once by magic.

A worker may complete a task but crash before acknowledging the message. The queue may deliver it again. A visibility timeout may expire while a slow task is still running. Two workers may accidentally compete for the same logical operation if the system is not configured correctly.

A robust job-processing design should consider:

- **Idempotency:** repeated delivery must not create unintended duplicate effects.
- **Leases or visibility timeouts:** a worker temporarily owns a job while processing it.
- **Heartbeats:** long-running workers can signal that they are still active.
- **Bounded retries:** failed jobs should not retry forever.
- **Dead-letter queues:** exhausted jobs should be retained for investigation or controlled replay.
- **Cancellation:** workers should respond to cancellation where safe.
- **Observability:** job state, attempts, duration, and failure reason should be recorded.

A simplified job state machine might look like this:

```text
queued ──claim──▶ running ──success──▶ succeeded
                    │
                    ├──retryable error──▶ queued
                    │
                    ├──permanent error──▶ failed
                    │
                    └──retry limit reached──▶ dead-letter
```

The exact transitions depend on the queue and business requirements. The important part is to define them rather than relying on the queue's defaults.

## 6. MapReduce: divide a large computation into smaller tasks

MapReduce is a programming model for processing large datasets across multiple machines. It divides a computation into smaller pieces, groups intermediate results, and combines them.

The high-level stages are:

```text
Input → Map → Shuffle → Reduce → Output
```

Consider a word-count job with three documents:

```text
Document 1: apple banana
Document 2: banana
Document 3: apple orange
```

### Map

Each mapper emits key-value pairs:

```text
Document 1 → (apple, 1), (banana, 1)
Document 2 → (banana, 1)
Document 3 → (apple, 1), (orange, 1)
```

### Shuffle

The framework groups values by key:

```text
apple  → [1, 1]
banana → [1, 1]
orange → [1]
```

### Reduce

The reducer combines the values:

```text
apple  → 2
banana → 2
orange → 1
```

The application logic focuses on mapping and reducing. The framework handles much of the coordination: task distribution, scheduling, shuffling, failure detection, and reassignment.

This is a powerful idea for workloads that can be divided into independent or mostly independent units.

## 7. Data locality and the cost of moving data

Distributed computation is not only about adding more machines. It is also about deciding where computation should happen.

The Google File System (GFS) design discussed in the distributed-systems material divided files into chunks and replicated those chunks across machines. The lecture material described 64 MB chunks and replication across two or three servers.

A MapReduce coordinator could try to schedule a map task on a machine that already stores the input chunk. This is called **data locality**.

The principle is:

> Move computation closer to the data whenever practical.

Transferring large inputs over the network can be expensive. If a worker can process a local copy, the system may reduce network traffic and improve throughput.

The exact chunk sizes and replication policies are implementation details of the system being studied, not universal defaults for modern storage systems.

## 8. Shuffle, partitioning, and scheduling

After mapping, intermediate records need to be grouped by key. A partition function determines which reducer receives a key:

\[
partition = hash(key) \bmod R
\]

Here, `R` is the number of reduce partitions. Every occurrence of the same key must be assigned to the same partition so that its values can be combined correctly.

Shuffle can be expensive because it moves intermediate data between machines.

Scheduling also matters. If every worker receives a fixed batch of tasks, a slow worker can delay the completion of the whole job. Dynamic scheduling improves utilisation by assigning another task to a worker as soon as it finishes its current one.

### Stragglers and speculative execution

A straggler is a worker whose task takes significantly longer than comparable tasks.

Some systems use speculative execution: if a task appears unusually slow, the coordinator launches another copy elsewhere. The first successful completion can be accepted.

This can reduce the impact of stragglers, but it means a task may execute more than once. Side effects therefore need careful handling.

### Atomic output publication

A worker should not expose a partially written output as if it were complete. One approach is to write to a temporary location and then atomically publish the completed result, for example through an atomic rename where the storage system supports the required semantics.

The broader principle is to make completion visible as one controlled state transition.

## 9. Applying these ideas to AI document processing

An enterprise AI platform may need to process thousands of documents. The work can be divided into stages:

1. Register the document and validate its tenant ownership.
2. Create a durable processing job.
3. Extract text or run OCR.
4. Identify and extract relevant structures.
5. Split content into chunks.
6. Generate embeddings.
7. Store the chunks and metadata.
8. Update the document's processing state.
9. Record the required audit events.

Some stages can be parallelised across documents. Others have ordering or dependency requirements. For example, embedding generation cannot begin until the text chunks exist.

A simplified job payload might look like:

```json
{
  "job_id": "job_01J...",
  "tenant_id": "tenant_123",
  "document_id": "doc_456",
  "operation": "ingest_document",
  "attempt": 1,
  "trace_id": "trace_789"
}
```

A production job envelope would also need schema versioning, timestamps, idempotency information, and any policy context required by the worker. Sensitive document contents should not be placed in queue messages unless the queue and its access controls are designed for that data.

For AI workloads, deterministic execution cannot always be assumed. Language-model outputs may vary, and provider calls may be repeated after uncertain outcomes. Persisting intermediate results, versioning prompts and models, validating outputs, and designing explicit retry rules are therefore important.

## 10. Common mistakes to avoid

| Mistake | Why it causes trouble | Better approach |
|---|---|---|
| Running OCR in the API event loop | Blocks unrelated requests | Move it to an ingestion worker |
| Treating async as automatic parallel CPU execution | Async mainly helps with cooperative I/O concurrency | Use processes or separate workers for CPU-heavy work |
| Assuming queue delivery is exactly once | Jobs may be redelivered | Make handlers idempotent |
| Retrying every failure indefinitely | Can create overload and duplicate effects | Classify errors and bound retries |
| Using one worker pool for every task | Resource contention between unlike workloads | Separate pools by resource profile |
| Publishing partial outputs | Readers may observe incomplete data | Publish only after successful completion |
| Ignoring stragglers | A few slow tasks can delay the whole batch | Use dynamic scheduling and measure task duration |
| Scaling workers without checking storage | The database may become the bottleneck | Measure the complete pipeline |

## Conclusion

Responsive APIs and large-scale processing have different needs. The API should protect the user-facing request path, while durable queues and worker pools handle work that is expensive, long-running, or resource-intensive.

Python's event loop is effective when coroutines yield during I/O. It is not a place to run arbitrary CPU-heavy work. MapReduce shows how large computations can be divided, scheduled, moved closer to data, and recovered when workers fail.

Together, these ideas lead to a practical design principle:

> Keep request handling responsive, isolate workloads by resource profile, and make every background task safe to retry and observable.

## Further reading

- [MIT 6.5840 — Introduction to Distributed Systems](https://pdos.csail.mit.edu/6.824/schedule.html)
- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Python `asyncio` documentation](https://docs.python.org/3/library/asyncio.html)
