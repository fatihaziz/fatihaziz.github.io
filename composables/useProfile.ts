// Single content contract shared by every landing sample.
// Options must differ in STRUCTURE, not in facts, so the comparison is fair.
// Every claim here is NDA-safe: no employer/brand names, no private figures.

export type ProjectTag =
  | 'trading sdk'
  | 'trading service'
  | 'desktop tooling'
  | 'personal ops'
  | 'client product'
  | 'this site';

export interface Project {
  name: string;
  glyph: string;
  desc: string;
  stack: string[];
  tag: ProjectTag;
}

export interface TimelineEntry {
  year: string;
  role: string;
  detail: string;
}

export interface Stat {
  label: string;
  value: string;
  note: string;
}

export interface Proof {
  title: string;
  metric: string;
  metricLabel: string;
  detail: string;
}

export function useProfile() {
  const identity = {
    name: 'Muhammad Fatih Al-Aziz',
    role: 'Fintech Platform Engineer',
    discipline: 'Brokerage CRM, back office, and trading infrastructure',
    location: 'Yogyakarta, Indonesia',
    timezone: 'GMT+7 - remote-first',
    email: 'm.fatihalaziz@gmail.com',
    github: 'https://github.com/fatihaziz',
    linkedin: 'https://www.linkedin.com/in/fatih-aziz',
    summary:
      'I build the systems a broker actually runs on: client area and CRM, back office, trading-platform integration, investment allocation, commission accounting, identity and KYC, payments, and the reconciliation that keeps all of them agreeing with each other.',
    availability: 'Open to senior/staff remote roles and contract work',
  };

  const stats: Stat[] = [
    { label: 'Years shipping', value: '8+', note: 'since 2018' },
    { label: 'Years in fintech', value: '6+', note: 'retail brokerage' },
    { label: 'Live accounts served', value: '50-200', note: 'trade replication' },
    { label: 'Commits authored', value: '9,200+', note: 'Jun 2019 - Jul 2026' },
  ];

  // Ordered outcome -> driver -> detail. These are the load-bearing proofs.
  const proofs: Proof[] = [
    {
      title: 'Multi-brand retail brokerage platform',
      metric: '1',
      metricLabel: 'live platform owned end to end',
      detail:
        'Architecture through production operation: CRM, back office, investment management, payments, KYC, and MetaTrader integration under one system.',
    },
    {
      title: 'Introducing-broker commission engine',
      metric: '3',
      metricLabel: 'generations, 2 language migrations',
      detail:
        'Rebuilt Go to Rust for correctness on deep affiliate trees while preserving deterministic historical recomputation.',
    },
    {
      title: 'Real-time trade replication',
      metric: '50-200',
      metricLabel: 'live accounts',
      detail:
        'Single-writer core with fixed, proportional, multiplier, and reverse sizing; ZeroMQ event streams and Python execution workers.',
    },
    {
      title: 'Investment allocation (PAMM)',
      metric: 'full',
      metricLabel: 'investor lifecycle',
      detail:
        'Allocation, performance-fee accounting, subscriptions, and redemptions on Apollo GraphQL and MikroORM.',
    },
    {
      title: 'Onsite client engagements',
      metric: '3',
      metricLabel: 'countries: MY, TR, UAE',
      detail:
        'Requirements, integration workshops, and escalation handling face to face with brokerage operators.',
    },
  ];

  const principles = [
    { title: 'One writer per balance', detail: 'Concurrent operators and market events cannot interleave into a wrong balance.' },
    { title: 'Recomputable, not patched', detail: 'A disputed period is recalculated and compared, never hand-edited.' },
    { title: 'Reconciliation first-class', detail: 'Platform, ledger, and provider records are compared on a schedule; mismatches become operator work items.' },
    { title: 'Operator safety', detail: 'Destructive back-office actions are permission-gated, previewed, and written to an audit trail.' },
    { title: 'Fail-safe integration', detail: 'When a feed or gateway stops answering the system stops rather than guesses.' },
    { title: 'Tenant segregation', detail: 'Brand boundaries are enforced in the data layer, not in the interface.' },
  ];

  const timeline: TimelineEntry[] = [
    { year: '2018', role: 'Full-Stack Engineer', detail: 'First professional role: copytrade platform, AWS operations, leading a small dev team.' },
    { year: '2020', role: 'Backend Engineer & Product Manager', detail: 'First Go services, the backend monolith, operator dashboards, payments and KYC integrations.' },
    { year: '2021', role: 'Chief of Product Officer', detail: 'Identity, FIX API, payment management; microservices on Docker and Kubernetes.' },
    { year: '2022', role: 'Chief Technology Officer', detail: 'Owned the live multi-brand platform; led the Go to Rust migration on latency-critical paths; onsite client work in Malaysia, Turkiye, and the UAE.' },
    { year: '2026', role: 'Independent Software Engineer', detail: 'Contract fintech delivery plus my own trading stack and developer tooling.' },
  ];

  const projects: Project[] = [
    { name: 'metatrader5-rs', glyph: '\u2B22', tag: 'trading sdk', desc: 'Rust SDK over the MetaTrader 5 Manager API: typed FFI, sandbox, capability gates, fleet client.', stack: ['Rust', 'FFI', 'SQLite'] },
    { name: 'mt5-manager-service', glyph: '\u25E9', tag: 'trading service', desc: 'Authenticated HTTP service over the SDK: OpenAPI 3.1, bounded worker pool, telemetry, operations dashboard.', stack: ['Rust', 'Axum', 'OpenAPI'] },
    { name: 'tradether', glyph: '\u21C4', tag: 'trading service', desc: 'Server-side MT5 copy trader: one manager session, SQLite replication state, sizing and risk controls.', stack: ['Rust', 'gRPC', 'SQLite'] },
    { name: 'Foyer', glyph: '\u25A3', tag: 'desktop tooling', desc: 'Windows-first desktop manager for terminal AI agents: 1-6 live panes over ConPTY, SQLite registry, 260+ tests.', stack: ['Go', 'Wails', 'TypeScript'] },
    { name: 'lifestyle tracker', glyph: '\u2665', tag: 'personal ops', desc: 'Workout and diet service I run my own cutting program on, with a branching exercise graph.', stack: ['Go', 'SQLite', 'Fly.io'] },
    { name: 'cctv panel', glyph: '\u25C9', tag: 'client product', desc: 'Multi-tenant CCTV dashboard aggregating livestreams with owner, admin, and viewer roles.', stack: ['Go', 'Nuxt', 'Docker'] },
  ];

  const stackGroups = [
    { label: 'Languages', items: ['Rust', 'Go', 'TypeScript', 'Python', 'MQL5', 'SQL'] },
    { label: 'Rust', items: ['tokio', 'actix-web', 'axum', 'sqlx', 'async-graphql', 'PyO3', 'ZeroMQ'] },
    { label: 'Go', items: ['Gin', 'gRPC', 'Clean Architecture', 'Ory Kratos', 'Wails'] },
    { label: 'TypeScript', items: ['Apollo GraphQL', 'MikroORM', 'Next.js', 'Vue 3', 'Cypress'] },
    { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite'] },
    { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Helm', 'nginx', 'CI/CD', 'OpenTelemetry'] },
    { label: 'Trading', items: ['MT5 Manager API', 'MT4/MT5 terminals', 'FIX API', 'market data'] },
  ];

  return { identity, stats, proofs, principles, timeline, projects, stackGroups };
}
