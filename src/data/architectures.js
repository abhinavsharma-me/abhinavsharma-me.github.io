export const architectureCards = [
  {
    id: 'useworldview',
    number: '01 /',
    badge: 'Production',
    badgeType: 'production',
    title: 'UseWorldview',
    subtitle: 'AI-powered synthetic user research platform orchestrating autonomous personas through real websites.',
    tags: ['Next.js', 'FastAPI', 'Playwright', 'Supabase'],
    visitUrl: 'https://github.com/useworldview/useworldview',
    visitLabel: 'github.com/useworldview/useworldview',
    previewChart: `flowchart TD
  Researcher["Researcher"] --> WebApp["Next.js Workspace"]
  WebApp --> API["FastAPI Orchestrator"]
  API --> Worker["Playwright Worker"]
  Worker --> Target["Target Website"]
  Worker --> Supabase["Supabase"]`
  },
  {
    id: 'creatorsarthi',
    number: '02 /',
    badge: 'Production',
    badgeType: 'production',
    title: 'CreatorSarthi',
    subtitle: 'Platform architecture connecting creators, Meta Instagram APIs, and Supabase data services.',
    tags: ['Next.js', 'Meta Graph API', 'Supabase', 'Postgres'],
    visitUrl: 'https://creatorsarthi.com',
    visitLabel: 'creatorsarthi.com',
    previewChart: `flowchart TD
  Actors["Creator + Visitor"] --> NextApp["Next.js Core Application"]
  Meta["Meta · Instagram"] <--> NextApp
  NextApp --> Supabase["Supabase"]`
  },
  {
    id: 'crewbench',
    number: '03 /',
    badge: 'Open Source · GitHub',
    badgeType: 'opensource',
    title: 'CrewBench',
    subtitle: 'GitHub-hosted open-source project for working with AI coding agents and inspecting workspace activity.',
    tags: ['TypeScript', 'Electron', 'File System', 'Observability'],
    visitUrl: 'https://github.com/CrewBench/CrewBench',
    visitLabel: 'github.com/CrewBench/CrewBench',
    previewChart: `flowchart LR
  Dev["Developer"] -->|Interact via| UI["Application UI"]
  UI -->|Modify or Create| FS["Local File System"]
  FS -->|Captured By| Timeline["File Timeline"]
  UI -->|Actions Recorded In| ActionLog["Action Log"]
  Timeline -->|Observable In| UI
  ActionLog -->|Observable In| UI`
  },
  {
    id: 'scan',
    number: '04 /',
    badge: 'Executable System · Bash CLI',
    badgeType: 'production',
    title: 'SCAN',
    subtitle: 'Command-line security auditing and automated remediation system built with Bash.',
    tags: ['Bash', 'CLI', 'Security', 'Automation', 'Shell'],
    visitUrl: 'https://github.com/abhinavsharma-me/openclaw-security-scan',
    visitLabel: 'github.com/abhinavsharma-me/openclaw-security-scan',
    previewChart: `flowchart TD
  CLI["Operator CLI"] --> ModeRouter["Mode Router"]
  ModeRouter --> Discovery["Discovery & Analyzer"]
  ModeRouter --> Remediation["Remediation Engine"]
  Discovery --> Scanner["Security Checks"]
  Remediation --> Backup["Backup & Fixes"]
  Scanner --> Report["Score & Report"]`
  }
];

