
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
    subtitle: 'Multi-agent healthcare assistant for hospital discovery and patient support.',
    problem: 'Patients struggle to identify suitable hospitals and doctors for their medical needs. General-purpose AI systems lack access to structured healthcare data and often return inaccurate or irrelevant recommendations.',
    solution: 'Designed the multi-agent architecture connecting LLMs, retrieval pipelines, structured healthcare data, and backend tools to generate contextual hospital and doctor recommendations.',
    contributions: [
      'Designed the multi-agent architecture and agent responsibilities',
      'Defined orchestration and execution workflows',
      'Implemented retrieval pipelines and structured tool integration',
      'Added response validation and medical safety checks',
      'Handled production reliability and error recovery'
    ],
    tabs: {
      ARCHITECTURE: {
        title: 'Multi-Agent Architecture',
        description: 'Designed an orchestrated system with specialized agents for symptom analysis, entity extraction, and healthcare provider retrieval.',
        highlights: [
          'Implemented supervisor-based agent orchestration',
          'Defined agent responsibilities and execution boundaries',
          'Added conversation-level state management',
          'Implemented parallel tool execution',
          'Added fallback handling for failed or low-confidence responses'
        ]
      },
      ENGINEERING: {
        title: 'Reliability & Execution',
        description: 'Implemented validation and execution controls across the agent workflows to improve response consistency and prevent unsupported medical information.',
        highlights: [
          'Enforced structured outputs for LLM responses',
          'Implemented response validation and medical guardrails',
          'Added semantic caching for repeated queries',
          'Implemented error handling across agent execution',
          'Containerized backend services for deployment'
        ]
      },
      IMPACT: {
        title: 'Production Outcomes',
        description: 'Focused on improving response accuracy, retrieval relevance, and execution latency.',
        highlights: [
          '~90% reduction in factual and clinical hallucinations',
          '~2s end-to-end response generation time'
        ]
      }
    },
    outcome: {
      stat1: '~90%',
      stat1Label: 'REDUCTION IN HALLUCINATIONS',
      stat2: '~2s',
      stat2Label: 'END-TO-END RESPONSE TIME'
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
    title: 'Qurovo',
    subtitle: 'Full-stack redevelopment of a healthcare platform.',
    problem: 'The existing platform required improvements in performance, maintainability, and scalability. Growing hospital data and product requirements made the existing application architecture increasingly difficult to extend.',
    solution: 'Led the redevelopment of the platform across frontend, backend, database integration, and infrastructure. Reworked application architecture and data-access patterns to support new features and growing platform requirements.',
    contributions: [
      'Owned frontend and backend redevelopment',
      'Redesigned application architecture and data flows',
      'Improved database queries and data-access patterns',
      'Optimized application response times',
      'Improved cloud infrastructure and deployment workflows',
      'Implemented technical SEO and indexing improvements',
      'Established reusable components and development patterns'
    ],
    tabs: {
      ARCHITECTURE: {
        title: 'Application Architecture',
        description: 'Reworked the application structure and backend integration to improve maintainability and support continued product development.',
        highlights: [
          'Redesigned frontend and backend architecture',
          'Improved database integration and data-access patterns',
          'Introduced reusable application components',
          'Improved application structure and maintainability',
          'Updated deployment and infrastructure workflows'
        ]
      },
      ENGINEERING: {
        title: 'Performance & Development',
        description: 'Worked on application performance, database efficiency, and development workflows.',
        highlights: [
          'Reduced application response times by approximately 80%',
          'Optimized frontend and backend execution paths',
          'Improved database queries and data flows',
          'Reduced feature development time by approximately 66%',
          'Improved technical SEO and indexing'
        ]
      },
      IMPACT: {
        title: 'Platform Growth',
        description: 'Improved the engineering foundation to support the expansion of the healthcare directory and additional product features.',
        highlights: [
          'Supported a directory of 10,000+ hospitals',
          'Reduced application response times by approximately 80%',
          'Reduced feature development time by approximately 66%',
          'Improved search engine discoverability',
          'Established reusable patterns for future development'
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
