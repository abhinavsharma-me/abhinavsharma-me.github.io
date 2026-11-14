export const careerRoles = [
  {
    key: 'tech-lead',
    role: 'Tech Lead',
    company: 'Qurovo',
    period: 'Aug 2026 – Present',
    isCurrent: true,
    startIndex: 0
  },
  {
    key: 'full-stack',
    role: 'Full Stack Developer',
    company: 'Qurovo',
    period: 'Jun 2026 – Jul 2026',
    isCurrent: false,
    startIndex: 3
  }
];

export const allProjects = [
  {
    id: '01',
    roleKey: 'tech-lead',
    roleTitle: 'Tech Lead',
    company: 'Qurovo',
    website: 'https://www.qurovo.com/qurovo-assist',
    websiteLabel: 'SEE IT IN ACTION',
    title: 'Q Support AI',
    subtitle: 'A multi-agent system for healthcare discovery and patient support.',
    problem: 'Patients often struggle to find the right hospital or doctor for their condition. General AI chatbots produce generic or unreliable answers without real healthcare context.',
    solution: 'Designed and built a multi-agent system that combines LLM reasoning, structured tools, and retrieval to deliver accurate, contextual, and reliable hospital and doctor recommendations.',
    contributions: [
      'Designed the multi-agent architecture and workflows',
      'Built retrieval and tool-based execution for healthcare data',
      'Implemented response validation and safety guardrails',
      'Engineered for production reliability and controlled execution'
    ],
    tabs: {
      ARCHITECTURE: {
        title: 'Multi-Agent Orchestration & Workflow Topology',
        description: 'Decomposed clinical discovery into specialized cooperating agents coordinated via Orchestration: a Symptom Triage Agent, an Entity & Geography Parser, and a Medical Provider Retrieval Agent.',
        highlights: [
          'Hierarchical supervisor architecture with deterministic boundary checks',
          'Context-isolated execution threads preventing cross-conversation pollution',
          'Stateless tool dispatch workers running in parallel for low latency',
          'Graceful fallback cascades for low-confidence model completions'
        ]
      },
      ENGINEERING: {
        title: 'Production Reliability & Guardrail Implementation',
        description: 'Engineered strict schema-bound response generation and deterministic clinical rules preventing hallucinated dosages, treatments, or ungrounded medical claims.',
        highlights: [
          'Enforced structured outputs across all LLM inference endpoints',
          'Built automated evaluation harness.',
          'Implemented dynamic semantic caching.',
          'Containerized microservices orchestrated on Cloud.'
        ]
      },
      IMPACT: {
        title: 'Clinical Accuracy & Production Outcomes',
        description: 'Delivered significant improvements in answer reliability, recommendation relevance, and patient intake satisfaction during production rollout.',
        highlights: [
          '~90% verified reduction in factual and clinical hallucinations',
          '~2s end-to-end response generation across multi-step agent chains'
        ]
      }
    },
    outcome: {
      stat1: '~90%',
      stat1Label: 'REDUCTION IN HALLUCINATIONS',
      stat2: 'PRODUCTION',
      stat2Label: 'SAFETY-FOCUSED WORKFLOWS'
    },
    techStack: ['Python', 'LLMs', 'RAG', 'PostgreSQL', 'and More']
  },
  {
    id: '02',
    roleKey: 'full-stack',
    roleTitle: 'Full Stack Developer',
    company: 'Qurovo',
    website: 'https://qurovo.com',
    websiteLabel: 'QUROVO.COM',
    title: 'Qurovo Redevelopment',
    subtitle: 'Re-engineering the healthcare platform for performance, scalability, and faster product development.',
    problem: 'The existing platform needed improvements in application performance, development architecture, and scalability. As the hospital directory and product functionality expanded, the engineering foundation needed to support growing data volumes, faster feature development, and a better user experience.',
    solution: 'Led the redevelopment of the core platform, taking ownership of frontend and backend architecture, database integration, application performance, and cloud infrastructure considerations. Established a more modular and maintainable development architecture designed to support continued product growth.',
    contributions: [
      'Led end-to-end technical strategy, architecture, and platform redevelopment',
      'Redesigned frontend and backend application architecture',
      'Improved database integration and data-access workflows',
      'Optimized application performance and response times',
      'Strengthened cloud and database infrastructure for growing platform requirements',
      'Improved technical foundations for SEO, indexing, and discoverability',
      'Established reusable application patterns to accelerate feature development'
    ],
    tabs: {
      ARCHITECTURE: {
        title: 'Full-Stack Platform Architecture',
        description: "Re-engineered the platform's application structure, data flows, and backend services to support growing workloads, improve performance, and accelerate feature development.",
        highlights: [
          'Redesigned frontend and backend application structure',
          'Improved database architecture and data-access patterns',
          'Established modular and reusable application components',
          'Strengthened application and infrastructure foundations for scaling',
          'Improved the overall development workflow and maintainability'
        ]
      },
      ENGINEERING: {
        title: 'Performance & Development Optimization',
        description: 'Focused on application performance, engineering efficiency, and a more consistent user experience across the platform.',
        highlights: [
          'Reduced application response times by approximately 80%',
          'Optimized frontend and backend execution paths',
          'Improved database interactions and application data flows',
          'Reduced new feature development time by approximately two-thirds',
          'Improved website performance and technical SEO foundations'
        ]
      },
      IMPACT: {
        title: 'Scalability & Platform Growth',
        description: 'Established an engineering foundation capable of supporting a growing healthcare directory and expanding product functionality.',
        highlights: [
          'Supported platform expansion to more than 10,000 hospitals',
          'Improved response times by approximately 80%',
          'Reduced new feature development time by approximately 70%',
          'Improved technical SEO and search discoverability',
          'Established a more scalable foundation for continued platform growth'
        ]
      }
    },
    outcome: {
      stat1: '80%',
      stat1Label: 'REDUCTION IN RESPONSE TIME',
      stat2: '66%',
      stat2Label: 'LESS FEATURE DEVELOPMENT TIME',
      stat3: '10,000+',
      stat3Label: 'HOSPITALS SUPPORTED'
    },
    techStack: [
      'Next.js',
      'TypeScript',
      'Database Architecture',
      'Cloud Infrastructure',
      'and More'
    ]
  }
];

