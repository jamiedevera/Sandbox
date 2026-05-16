# SANDBOX — Deployment Risk Simulation Engine

A Next.js 15 conversion of the sandbox ZIP upload simulator UI.

## Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **React Flow (@xyflow/react)** — interactive system map
- **Framer Motion** — screen transitions and animations
- **Fonts**: Press Start 2P · Share Tech Mono · Rajdhani (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

For real ZIP analysis via Claude, add your Anthropic API key:

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

Without it, the app falls back to demo data automatically.

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # Claude API proxy route
│   ├── globals.css            # Tailwind v4 + pixel aesthetic + animations
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main orchestrator page
├── components/
│   ├── TopBar.tsx             # Sticky header with status + risk badge
│   ├── UploadScreen.tsx       # Drag-and-drop ZIP upload screen
│   ├── ProcessingScreen.tsx   # Animated crate + log feed
│   ├── SystemMap.tsx          # React Flow node graph
│   ├── Timeline.tsx           # Failure replay with playback controls
│   ├── RiskReport.tsx         # Animated score + issue cards
│   ├── Dashboard.tsx          # 3-column dashboard layout
│   └── AnalyzingOverlay.tsx   # Full-screen spinner overlay
├── lib/
│   ├── demo-data.ts           # Demo project data + stage configs
│   └── utils.ts               # Color maps, helpers
└── types/
    └── index.ts               # Shared TypeScript types
```

## Features

- **Drag & drop** ZIP upload with visual feedback
- **Demo mode** — works without any file or API key
- **React Flow** system map with animated edges
- **Framer Motion** transitions between screens
- **Failure timeline** with play/pause/replay controls + damage meter
- **Animated risk score** counter
- **Claude API** integration (server-side via `/api/analyze`)
- Fully typed with TypeScript throughout
