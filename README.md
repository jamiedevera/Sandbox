# ⬛ SANDBOX
### Deployment Risk Simulation Engine

> *Drop your system into the Sandbox. Watch it break before it does.*

Sandbox is a retro pixel-inspired AI simulation platform that analyzes uploaded codebases and predicts deployment risks through simulated system behavior. Upload a `.zip` of any project and get a cinematic breakdown of how it fails under real-world production conditions — before it ever hits production.

---

## Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│ ⬛ SANDBOX  ● ACTIVE  // ecommerce-platform-v3   [CRITICAL] │
├──────────────┬──────────────────────────┬───────────────────┤
│ SYSTEM MAP   │  FUTURE FAILURE REPLAY   │  AI RISK REPORT   │
│              │                          │                   │
│  [Frontend]  │  T+0s  🟢 NOMINAL        │  RISK SCORE       │
│  [Auth] ⚠️   │  T+12m 📈 TRAFFIC SPIKE  │      78 / 100     │
│  [Payment]🔴 │  T+21m 🔴 TIMEOUT        │                   │
│  [Database]  │  T+23m 💥 CASCADE FAIL   │  ■ 7 Issues       │
│  [Cache]     │  T+31m 🚨 TOTAL OUTAGE   │  ■ Cost: $11,700  │
└──────────────┴──────────────────────────┴───────────────────┘
```

---

## Features

**Sandbox ZIP Upload** — drag and drop any `.zip` codebase into the sandbox. Sandbox reads the file tree, detects the tech stack, and maps the architecture automatically.

**AI-Powered Risk Analysis** — powered by Claude Sonnet, Sandbox generates a structured risk report covering security vulnerabilities, performance bottlenecks, scaling issues, and architectural flaws — with severity scores and concrete business impact for each.

**Future Failure Replay** — the signature feature. An animated, cinematic timeline showing exactly how your system breaks under production load, step by step. Feels like watching a simulation game collapse, not reading debug logs.

**Interactive System Map** — a live node graph of your modules, color-coded by risk level (green / amber / red), with animated data-flow lines and hover tooltips showing file counts and status.

**Cost Impact Estimator** — calculates the estimated financial cost of each failure scenario based on detected risk patterns.

**Demo Mode** — try Sandbox instantly with a pre-loaded e-commerce platform scenario, no upload needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-20250514`) |
| ZIP Parsing | JSZip |
| Language | TypeScript |
| Fonts | Press Start 2P · Share Tech Mono · Rajdhani |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sandbox.git
cd sandbox

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Run in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## How It Works

```
1. Upload .zip
       │
       ▼
2. Extract & Parse
   • Decompress archive
   • Walk file tree
   • Detect framework (Next.js, Express, FastAPI, etc.)
   • Parse package.json / requirements.txt / go.mod
       │
       ▼
3. Build System Map
   • Map modules and dependencies
   • Detect API routes
   • Identify DB patterns and risky anti-patterns
       │
       ▼
4. Send to Claude
   • Architecture summary payload
   • Prompt: simulate real-world deployment failure
       │
       ▼
5. AI Returns Structured JSON
   • risk_score (0–100)
   • issues[] with type, severity, description, impact
   • simulation[] step-by-step failure events
       │
       ▼
6. Render Dashboard
   • Interactive system map (left)
   • Future Failure Replay timeline (center)
   • Risk report + cost estimate (right)
```

---

## AI Output Format

Sandbox requires Claude to respond in the following strict JSON schema:

```json
{
  "projectName": "my-app",
  "stack": ["Next.js", "PostgreSQL", "Redis"],
  "modules": [
    { "name": "Auth Service", "risk": "danger", "files": 12 }
  ],
  "risk_score": 78,
  "summary": "Executive summary of deployment risks.",
  "issues": [
    {
      "type": "security",
      "severity": "critical",
      "description": "JWT secret stored without rotation strategy.",
      "impact": "Full account takeover possible."
    }
  ],
  "simulation": [
    { "time": "T+0s", "event": "System nominal. 200 concurrent users.", "type": "normal" },
    { "time": "T+12m", "event": "Traffic spike. 3,400% surge.", "type": "warn" },
    { "time": "T+23m", "event": "Cascading failure. DB connections maxed.", "type": "danger" }
  ]
}
```

---

## Project Structure

```
sandbox/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API route: ZIP upload → Claude analysis
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout with fonts & metadata
│   └── page.tsx                  # Main app page
├── components/
│   ├── TopBar.tsx                # Status bar with project name & risk badge
│   ├── UploadScreen.tsx          # Drag-and-drop zone & file input
│   ├── ProcessingScreen.tsx      # Animated unpacking & log feed
│   ├── Dashboard.tsx             # Three-panel dashboard layout
│   ├── SystemMap.tsx             # Interactive module node graph
│   ├── FailureReplay.tsx         # Animated simulation timeline
│   └── RiskReport.tsx            # AI risk score, issues & cost panel
├── lib/
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── demo-data.ts              # Demo scenario (e-commerce platform)
│   ├── zip-parser.ts             # ZIP extraction & stack detection
│   └── ai-prompt.ts              # Claude prompt builder
├── .env.local.example            # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Risk Score Guide

| Score | Level | Meaning |
|---|---|---|
| 0 – 39 | 🟢 LOW | Minor issues, safe to deploy with fixes |
| 40 – 59 | 🟡 MEDIUM | Notable risks, review before production |
| 60 – 79 | 🟠 HIGH | Significant vulnerabilities, do not ship |
| 80 – 100 | 🔴 CRITICAL | Severe failure risk, system will break |

---

## Design Philosophy

Sandbox is designed to feel like **dropping a world into a simulation engine**, not uploading code to a linter.

The UI takes inspiration from:
- Pixel art strategy games
- Sandbox simulation tools (The Sandbox, Dwarf Fortress)
- Retro-futuristic system HUDs
- Soft industrial game dashboards

The color palette uses warm sand and brown base tones with muted green (safe), amber (warning), and red (failure) states — evoking a worn-in, analog feel against the digital darkness.

---

## Roadmap

- [ ] AI Agents Attack Mode — simulated adversarial agents probing your system for vulnerabilities
- [ ] Deployment Weather Forecast — 7-day risk outlook as your system scales
- [ ] Cost Explosion Estimator — detailed cloud cost modeling under failure scenarios
- [ ] GitHub integration — analyze repos directly without manual ZIP export
- [ ] Multi-file comparison — diff risk scores between two versions of a project
- [ ] Export risk report as PDF

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with ⬛ and Claude Sonnet · Drop your system. Watch it break. Ship it fixed.</sub>
</p>
