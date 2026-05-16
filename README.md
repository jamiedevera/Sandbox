# ⬛ Sandbox
### Deployment Risk Simulation Engine

> *Drop your system into the Sandbox. Watch it break before it does.*

Sandbox is a retro pixel-inspired AI simulation platform that analyzes uploaded codebases and predicts deployment risks through simulated system behavior. Upload a `.zip` of any project and get a cinematic breakdown of how your system fails under real-world production conditions — before it ever hits production.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![IBM watsonx](https://img.shields.io/badge/IBM_watsonx.ai-1F70C1?style=flat-square&logo=ibm&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [AI Output Format](#ai-output-format)
- [Risk Score Guide](#risk-score-guide)
- [Design Philosophy](#design-philosophy)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

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

Sandbox is not a linter. It is a **deployment simulation engine** — powered by IBM watsonx.ai — that predicts how your software behaves in the real world before you ship it.

---

## Features

- **Drag & Drop ZIP Upload** — drop any codebase archive and Sandbox automatically extracts the file tree, detects the stack, and maps the architecture
- **React Flow System Map** — interactive node graph with animated edges, color-coded by risk level (green / amber / red), and hover tooltips
- **Future Failure Replay** — the signature feature; a cinematic, animated timeline showing exactly how your system breaks under production load, step by step
- **IBM watsonx.ai Integration** — server-side analysis via `/api/analyze`; generates structured risk reports covering security, performance, and architecture
- **Animated Risk Score** — live counter animation from 0 to final score with a color-coded severity bar
- **Damage Meter** — real-time system integrity tracker that degrades as the failure timeline progresses
- **Cost Impact Estimator** — estimated financial cost of each failure scenario based on detected risk patterns
- **Framer Motion Transitions** — smooth animated screen transitions between upload, processing, and dashboard states
- **Demo Mode** — fully functional without any file upload or API key; loads a pre-built e-commerce failure scenario instantly
- **Fully Typed** — TypeScript throughout, from API response to UI components

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| System Graph | React Flow (`@xyflow/react`) |
| Animations | Framer Motion |
| AI Provider | IBM watsonx.ai |
| Fonts | Press Start 2P · Share Tech Mono · Rajdhani |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- An [IBM watsonx.ai](https://www.ibm.com/watsonx) API key and Project ID

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jamiedevera/Sandbox.git
cd Sandbox

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Then open .env.local and fill in your IBM credentials
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

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
# IBM watsonx.ai credentials (required for live ZIP analysis)
IBM_WATSONX_API_KEY=your-ibm-api-key-here
IBM_WATSONX_PROJECT_ID=your-project-id-here
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Optional: override the default model
# IBM_WATSONX_MODEL=ibm/granite-13b-chat-v2
```

> Without these variables, the app automatically falls back to **demo mode** — no configuration required to explore the UI.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # IBM watsonx.ai proxy route — ZIP → risk report
│   ├── globals.css               # Tailwind v4 + pixel aesthetic + keyframe animations
│   ├── layout.tsx                # Root layout with Google Fonts + metadata
│   └── page.tsx                  # Main orchestrator — screen state machine
├── components/
│   ├── TopBar.tsx                # Sticky header: status dot, project name, risk badge
│   ├── UploadScreen.tsx          # Drag-and-drop ZIP upload with scan line animation
│   ├── ProcessingScreen.tsx      # Animated pixel crate + live log feed
│   ├── SystemMap.tsx             # React Flow node graph with animated edges
│   ├── Timeline.tsx              # Failure replay with play/pause/replay + damage meter
│   ├── RiskReport.tsx            # Animated score counter + severity issue cards
│   ├── Dashboard.tsx             # 3-column dashboard layout
│   └── AnalyzingOverlay.tsx      # Full-screen spinner overlay during AI processing
├── lib/
│   ├── demo-data.ts              # Demo project scenario + processing stage configs
│   └── utils.ts                  # Color maps, severity helpers, formatters
└── types/
    └── index.ts                  # Shared TypeScript interfaces and enums
```

---

## AI Output Format

The `/api/analyze` route sends the extracted codebase summary to IBM watsonx.ai and expects the following structured JSON response:

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
    { "time": "T+0s",  "event": "System nominal. 200 concurrent users.", "type": "normal" },
    { "time": "T+12m", "event": "Traffic spike. 3,400% surge detected.",  "type": "warn"   },
    { "time": "T+23m", "event": "Cascading failure. DB connections maxed.", "type": "danger" }
  ]
}
```

---

## Risk Score Guide

| Score | Level | Badge | Meaning |
|---|---|---|---|
| 0 – 39 | LOW | 🟢 | Minor issues; safe to deploy with small fixes |
| 40 – 59 | MEDIUM | 🟡 | Notable risks; review before production |
| 60 – 79 | HIGH | 🟠 | Significant vulnerabilities; do not ship yet |
| 80 – 100 | CRITICAL | 🔴 | Severe failure risk; system will break under load |

---

## Design Philosophy

Sandbox is designed to feel like **dropping a world into a simulation engine**, not uploading code to a static analyzer.

The UI takes inspiration from:

- Pixel art strategy games and sandbox simulation tools
- Retro-futuristic system HUDs and soft industrial game dashboards
- The tactile, worn-in feel of analog instruments rendered digitally

The color palette uses warm sand and brown base tones — evoking a physical sandbox — with muted green (safe), amber (warning), and red (failure) overlaid as system state indicators. Typography combines **Press Start 2P** for headers with **Share Tech Mono** for data readouts and **Rajdhani** for body text.

---

## Roadmap

- [ ] AI Agents Attack Mode — adversarial agents probe your system for vulnerabilities in real time
- [ ] Deployment Weather Forecast — 7-day risk outlook as your system scales
- [ ] GitHub Integration — analyze repositories directly without manual ZIP export
- [ ] Multi-version Diff — compare risk scores between two versions of a project
- [ ] Export Report — download the full risk report as a formatted PDF

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with ⬛ and IBM watsonx.ai · Drop your system. Watch it break. Ship it fixed.</sub>
</p>
