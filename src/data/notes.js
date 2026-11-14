export const notes = [
  {
    slug: 'how-to-keep-request-handling-responsive-while-moving-expensive-work-to-the-right-place',
    title: 'How to keep request handling responsive while moving expensive work to the right place',
    filename: 'how-to-keep-request-handling-responsive-while-moving-expensive-work-to-the-right-place.md',
    category: 'ASYNC & SYSTEMS ARCHITECTURE',
    date: 'Nov 2026',
    readTime: '9 min read',
    excerpt:
      'Architecting asynchronous API boundaries: distinguishing I/O-bound cooperative multitasking from CPU-bound starvation, and isolating heavy workloads into distributed queues and worker pools.'
  },
  {
    slug: 'organise-growing-enterprise-application-without-operational-burden',
    title: 'How to organise a growing enterprise application without turning architecture into an operational burden',
    filename: 'organise-growing-enterprise-application-without-operational-burden.md',
    category: 'ENTERPRISE ARCHITECTURE',
    date: 'Nov 2026',
    readTime: '8 min read',
    excerpt:
      'Comparing traditional monoliths, microservices, and modular monoliths. Managing complexity with bounded modules, clean interfaces, and pragmatic architectural boundaries.'
  },
  {
    slug: 'why-individually-healthy-components-can-still-produce-an-unreliable-application',
    title: 'Why individually healthy components can still produce an unreliable application',
    filename: 'why-individually-healthy-components-can-still-produce-an-unreliable-application.md',
    category: 'DISTRIBUTED RELIABILITY',
    date: 'Nov 2026',
    readTime: '7 min read',
    excerpt:
      'Analyzing compounded latency percentiles (p95/p99), cascading timeouts, retry storms, and why component-level dashboards fail to reflect end-to-end user reliability.'
  }
];

export function getNoteBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase().replace(/^\/notes\//, '').replace(/^#notes\//, '').replace(/^#note-/, '');
  return notes.find((n) => n.slug.toLowerCase() === normalized) || null;
}

