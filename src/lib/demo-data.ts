import type { ProjectData } from '@/types'

export const DEMO_DATA: ProjectData = {
  projectName: 'ecommerce-platform-v3',
  stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe API', 'AWS S3'],
  modules: [
    { name: 'Frontend (Next.js)', risk: 'warn', files: 47, x: 20, y: 20 },
    { name: 'Auth Service', risk: 'danger', files: 12, x: 140, y: 20 },
    { name: 'Payment API', risk: 'danger', files: 8, x: 20, y: 100 },
    { name: 'Database Layer', risk: 'warn', files: 23, x: 140, y: 100 },
    { name: 'Cache (Redis)', risk: 'ok', files: 5, x: 80, y: 60 },
    { name: 'S3 Storage', risk: 'ok', files: 3, x: 20, y: 185 },
  ],
  aiResult: {
    risk_score: 78,
    summary:
      'Critical security vulnerabilities in auth layer combined with N+1 query patterns and missing circuit breakers will cause cascading failure under Black Friday load. Estimated 23-minute window to total outage.',
    issues: [
      {
        type: 'security',
        severity: 'critical',
        description:
          'JWT secret stored in .env without rotation strategy. Session tokens never invalidated on logout.',
        impact: 'Full account takeover possible; zero-day exploit window.',
      },
      {
        type: 'performance',
        severity: 'critical',
        description:
          'N+1 query pattern in product catalog. Each page load fires 47+ unindexed DB queries.',
        impact: 'Database will collapse at ~800 concurrent users.',
      },
      {
        type: 'architecture',
        severity: 'high',
        description:
          'No circuit breaker between Payment API and Stripe. Single point of failure with no retry strategy.',
        impact: 'Any Stripe degradation causes 100% checkout failure.',
      },
      {
        type: 'performance',
        severity: 'high',
        description:
          'Redis cache has no TTL strategy. Cache will grow unbounded and exhaust memory within 72 hours of production deployment.',
        impact: '$2,400/mo in unexpected Redis scaling costs.',
      },
      {
        type: 'architecture',
        severity: 'medium',
        description:
          'No rate limiting on auth endpoints. Brute-force attacks fully unmitigated.',
        impact: 'Account enumeration and credential stuffing attack surface.',
      },
      {
        type: 'performance',
        severity: 'medium',
        description:
          'Static assets not CDN-distributed. All image requests hitting origin server.',
        impact: '3.2s average LCP on mobile. 40% bounce rate increase.',
      },
      {
        type: 'architecture',
        severity: 'low',
        description:
          'Logging lacks structured format. No correlation IDs between services.',
        impact: 'Incident response time increased by 4–6 hours.',
      },
    ],
    simulation: [
      {
        time: 'T+0s',
        event: '🟢 SYSTEM NOMINAL — All services healthy. 200 concurrent users.',
        type: 'normal',
      },
      {
        time: 'T+12m',
        event: '📈 TRAFFIC SPIKE — Black Friday promotion triggers 3,400% user surge.',
        type: 'normal',
      },
      {
        time: 'T+14m',
        event: '⚠️ DB DEGRADATION — N+1 queries create query queue. P95 latency: 2.4s.',
        type: 'warn',
      },
      {
        time: 'T+17m',
        event: '⚠️ CACHE THRASH — Redis memory spikes. TTL-less keys filling capacity.',
        type: 'warn',
      },
      {
        time: 'T+19m',
        event: '🔴 AUTH OVERLOAD — Login endpoint rate-limit absent. Bot traffic joins spike.',
        type: 'danger',
      },
      {
        time: 'T+21m',
        event: '🔴 PAYMENT TIMEOUT — Stripe latency triggers 30s request loops. Thread pool exhausted.',
        type: 'danger',
      },
      {
        time: 'T+23m',
        event: '💥 CASCADE FAILURE — DB connections maxed. New requests rejected. Checkout: 0% success.',
        type: 'danger',
      },
      {
        time: 'T+25m',
        event: '💥 REDIS OOM — Cache server out of memory. Auth sessions lost. All users logged out.',
        type: 'danger',
      },
      {
        time: 'T+31m',
        event: '🚨 TOTAL OUTAGE — Frontend returns 503. Revenue loss: $4,800/minute.',
        type: 'danger',
      },
      {
        time: 'T+2h',
        event: '🔴 SECURITY BREACH — Unmitigated auth during outage recovery. 847 accounts compromised.',
        type: 'danger',
      },
    ],
  },
}

export const PROCESSING_STAGES_DEMO = [
  {
    msg: '📦 LOADING DEMO SYSTEM...',
    logs: [
      { text: 'Loading ecommerce-platform-v3.zip', type: 'info' as const },
      { text: '137 files detected', type: 'ok' as const },
      { text: 'Reading package.json', type: 'ok' as const },
    ],
  },
  {
    msg: '🔍 SCANNING DEMO CODEBASE...',
    logs: [
      { text: 'Framework: Next.js 14 detected', type: 'ok' as const },
      { text: 'Node.js backend: Express 4.18', type: 'ok' as const },
      { text: 'Risky pattern: N+1 queries', type: 'warn' as const },
    ],
  },
  {
    msg: '🗺️ BUILDING SYSTEM MAP...',
    logs: [
      { text: '47 frontend modules mapped', type: 'ok' as const },
      { text: '12 API endpoints detected', type: 'ok' as const },
      { text: 'Auth service: JWT, no refresh', type: 'warn' as const },
    ],
  },
  {
    msg: '🤖 RUNNING AI SIMULATION...',
    logs: [
      { text: 'Payload ready, calling IBM WatsonX AI...', type: 'info' as const },
      { text: 'Simulation running...', type: 'warn' as const },
      { text: 'Risk report generated', type: 'ok' as const },
    ],
  },
]

export const PROCESSING_STAGES_UPLOAD = [
  {
    msg: '📦 EXTRACTING ARCHIVE...',
    logs: [
      { text: 'Decompressing archive...', type: 'info' as const },
      { text: 'Reading file tree...', type: 'ok' as const },
    ],
  },
  {
    msg: '🔍 SCANNING CODEBASE...',
    logs: [
      { text: 'Scanning file types...', type: 'info' as const },
      { text: 'Detecting framework...', type: 'info' as const },
      { text: 'Parsing package.json / requirements.txt...', type: 'ok' as const },
    ],
  },
  {
    msg: '🗺️ BUILDING SYSTEM MAP...',
    logs: [
      { text: 'Mapping module dependencies...', type: 'info' as const },
      { text: 'Detecting API routes...', type: 'ok' as const },
      { text: 'Analyzing DB patterns...', type: 'warn' as const },
    ],
  },
  {
    msg: '🤖 AI SIMULATION ENGINE...',
    logs: [
      { text: 'Preparing architecture summary...', type: 'info' as const },
      { text: 'Sending to IBM WatsonX AI...', type: 'info' as const },
      { text: 'Awaiting risk report...', type: 'warn' as const },
    ],
  },
]
