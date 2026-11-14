# How to organise a growing enterprise application without turning architecture into an operational burden.

## Introduction

When a software product starts growing, it is tempting to assume that its architecture must grow more distributed too. A monolith feels like a starting point; microservices can look like the inevitable destination.

That assumption is too simplistic.

Architecture is not a competition to see how many services a team can deploy. It is the discipline of managing complexity: keeping responsibilities understandable, controlling dependencies, and allowing the product to change without making every change risky.

For an enterprise AI platform, these decisions matter early. Such a platform may need to manage tenants and permissions, ingest documents, retrieve knowledge, route requests to language models, execute long-running workflows, record audit events, enforce budgets, and integrate with external systems. These capabilities are related, but they should not all be tangled together.

This article compares four common architectural styles and explains why a modular monolith is often a sensible starting point for a growing product.

## 1. The four architectural styles

### Traditional monolith

A traditional monolith packages most application capabilities into one deployable application. Its modules may be organised into folders, but internal boundaries are often informal. Any part of the codebase may end up reaching into another part's data or implementation.

**Advantages**

- Straightforward deployment and local development.
- In-process calls are fast and relatively simple.
- Transactions across related functionality can be easier to manage.
- Fewer infrastructure components to operate.

**Trade-offs**

- Unclear boundaries allow coupling to spread.
- A change in one area can have unexpected effects elsewhere.
- Large teams can struggle to work independently.
- Scaling one expensive capability may require scaling the entire application.

A monolith is not inherently a bad architecture. The danger is allowing its internal structure to become difficult to reason about.

### Modular monolith

A modular monolith keeps a single deployable application while enforcing clear boundaries between business capabilities.

Each module owns its behaviour and internal implementation. Other modules interact with it through explicit public interfaces rather than reaching into private repositories, models, or database access code.

For example, an enterprise AI platform might be divided into:

| Module | Responsibility |
|---|---|
| `tenant_iam` | Tenants, identity, roles, and permissions |
| `rag_knowledge` | Documents, embeddings, and retrieval |
| `llm_router` | Provider selection and model communication |
| `orchestrator` | Workflow execution and coordination |
| `audit_finops` | Audit records, usage, and financial controls |

The modules can remain in one codebase and process while still having meaningful architectural boundaries.

This approach provides much of the simplicity of a monolith without treating the entire codebase as one undifferentiated unit.

### Service-oriented architecture (SOA)

SOA organises a system around larger enterprise services. It is commonly useful when connecting systems that already have their own responsibilities and lifecycles, such as ERP, CRM, finance, and legacy platforms.

An Enterprise Service Bus (ESB) may coordinate communication and transformation between systems. That can simplify integration, but a heavily centralised integration layer can also become a bottleneck or a critical dependency.

SOA is not simply another name for microservices. Its services are often broader and more enterprise-integration oriented.

### Microservices

A microservices architecture divides an application into independently deployable services. Services communicate across process or network boundaries, often through HTTP, gRPC, or messaging.

This can be valuable when:

- A capability needs to scale independently.
- A team needs genuine deployment autonomy.
- A component requires a different runtime or specialised infrastructure.
- Failure isolation is important enough to justify a separate process boundary.

The cost is real. Network calls introduce latency, serialization, timeouts, partial failures, version compatibility, distributed tracing, and more complicated deployment and operations.

A system with many small services can become harder to understand than the monolith it replaced.

## 2. Comparing the options

| Dimension | Traditional monolith | Modular monolith | SOA | Microservices |
|---|---|---|---|---|
| Deployment | One application | One application | Multiple enterprise services | Multiple independent services |
| Internal boundaries | Often informal | Explicit module contracts | Service contracts | Service contracts |
| Communication | Mostly in-process | Mostly in-process | Usually network or messaging | Network or messaging |
| Operational overhead | Low initially | Low to moderate | Moderate to high | High |
| Independent scaling | Limited | Limited by process, unless workloads are separated | Possible per service | Core design capability |
| Best fit | Small or simple products | Products needing structure without distributed overhead | Enterprise integration | Autonomous teams and independently operated capabilities |

No row in this table determines the right answer on its own. The right choice depends on the product's constraints, team structure, workload profile, and operational maturity.

## 3. The design work that matters: boundaries

A useful boundary is more than a folder name. It represents ownership over a business capability, its rules, and the data it is responsible for.

Domain-Driven Design describes a bounded context as a boundary within which a particular model and vocabulary are meaningful. In an AI platform, identity, retrieval, model routing, and workflow orchestration have different rules. Treating them as separate contexts helps prevent one module from becoming the owner of everything.

A module should expose a small public surface:

```text
rag_knowledge/
├── contracts.py       # Public interfaces and data-transfer objects
├── service.py         # Public application behaviour
└── internal/
    ├── repositories.py
    ├── models.py
    └── adapters.py
```

The exact folder structure is less important than the rule: consumers use the public contract, not private implementation details.

### A contract example

A retrieval module might expose an interface like this:

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class SearchRequest:
    tenant_id: str
    query: str
    limit: int = 5


@dataclass(frozen=True)
class SearchResult:
    document_id: str
    excerpt: str
    score: float


class KnowledgeSearch(Protocol):
    async def search(
        self,
        request: SearchRequest,
    ) -> list[SearchResult]:
        ...
```

The orchestrator depends on `KnowledgeSearch`, not on the retrieval module's database repository or vector-store SDK. The implementation can change without forcing every consumer to change with it.

This is information hiding in practice.

## 4. Keep dependencies directed

Dependencies should form a directed acyclic graph (DAG), not a web of circular imports and mutual ownership.

For example:

```text
                  ┌────────────────┐
                  │  Orchestrator  │
                  └───────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
   ┌────────────┐  ┌────────────┐   ┌────────────┐
   │ Tenant IAM │  │ RAG /      │   │ LLM Router │
   │            │  │ Knowledge  │   │            │
   └────────────┘  └────────────┘   └────────────┘
                          │
                          ▼
                  ┌────────────┐
                  │ Audit &    │
                  │ FinOps     │
                  └────────────┘
```

This is an illustrative dependency direction, not a universal module map. The important property is that dependencies are deliberate and cycles are avoided.

Circular dependencies make testing harder, blur ownership, and make future extraction more difficult.

## 5. Isolate vendor SDKs behind adapters

Provider-specific SDKs should not leak throughout the application.

If every module imports a different model provider's SDK, switching providers becomes a cross-cutting rewrite. Provider-specific retries, timeouts, response formats, and error handling also become inconsistent.

Instead, keep provider integrations inside the model-routing boundary and expose an application-level contract:

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class GenerationRequest:
    model: str
    prompt: str
    max_output_tokens: int


@dataclass(frozen=True)
class GenerationResult:
    text: str
    input_tokens: int
    output_tokens: int


class ModelProvider(Protocol):
    async def generate(
        self,
        request: GenerationRequest,
    ) -> GenerationResult:
        ...
```

Concrete adapters can implement this contract for different providers. The rest of the application can work with a stable interface while the routing module handles provider-specific details.

The abstraction should represent capabilities the product actually needs. An abstraction that attempts to hide every provider difference can become awkward, so provider-specific features should be modelled explicitly when they matter.

## 6. In-process calls are not network calls

A function call inside one process has very different failure characteristics from an HTTP request to another service.

An in-process call generally avoids network serialization, connection setup, and remote failure modes. A network call may encounter:

- Serialization and deserialization overhead.
- Variable network latency.
- Connection resets or DNS failures.
- Timeouts and ambiguous outcomes.
- Partial failure, where one side completes an operation but the other side does not receive the response.
- Contract and version compatibility issues.

Consider a workflow-creation request. Service A sends a request to Service B. B creates the workflow, but the response is lost. A times out.

From A's perspective, the result is unknown. The timeout does not prove that B failed.

Blindly retrying could create a duplicate workflow. This is why distributed mutations need idempotency.

```http
POST /workflows
Idempotency-Key: 6f9b2f5a-...
Content-Type: application/json
```

The receiving system stores the outcome associated with the key. Repeating the same logical request can then return the original result instead of creating a second resource.

## 7. A practical evolution path

A useful progression is:

1. Start with clear module boundaries.
2. Enforce public contracts and dependency direction.
3. Separate workloads that have different resource requirements.
4. Measure scaling, latency, reliability, and team ownership.
5. Extract a network service only when the evidence supports the additional complexity.

A modular monolith can run separate worker processes or containers while sharing one codebase. This provides runtime isolation for heavy workloads without requiring every business module to become a network service.

### When might extraction make sense?

| Signal | Why it may justify extraction |
|---|---|
| One subsystem needs independent scaling | The rest of the application should not scale with it |
| A component needs GPUs or a specialised runtime | It has materially different infrastructure requirements |
| A team needs independent releases | The service boundary supports genuine ownership |
| A component needs stronger failure isolation | A separate process boundary limits blast radius |
| Operational measurements show a bottleneck | The change addresses a demonstrated problem |

A large codebase by itself is not sufficient evidence. Nor are example thresholds such as a certain number of engineers or vectors universal rules. They are prompts to investigate, not automatic triggers.

## Conclusion

The most useful architectural decision is rarely the one with the most moving parts. It is the one that gives the product enough structure to evolve while keeping its operational and cognitive costs manageable.

For many early-to-growth enterprise platforms, a modular monolith is a strong starting point: explicit business boundaries, public contracts, directed dependencies, and isolated worker processes where necessary.

The guiding principle is simple:

> First isolate code boundaries. Then isolate runtime workloads. Introduce network services when measurable needs justify them.

Architecture should respond to evidence from the system and the organisation, not to the assumption that every successful product must become a microservices platform.

## Further reading

- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [MIT 6.5840 — Introduction to Distributed Systems](https://pdos.csail.mit.edu/6.824/schedule.html)
