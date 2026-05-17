# 🏖️ SANDBOX
### Deployment Risk Simulation Engine v2.4

> *Drop your system into the Sandbox. Watch it break before it does.*

Sandbox is a **retro pixel beach-inspired AI simulation platform** that analyzes uploaded codebases and predicts deployment risks through simulated system behavior. Upload a `.zip` of any project and get a cinematic breakdown of how your system fails under real-world production conditions — before it ever hits production.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![IBM watsonx](https://img.shields.io/badge/IBM_watsonx.ai-1F70C1?style=flat-square&logo=ibm&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

---

## 🤖 Built with IBM Bob

> **This entire project was developed in partnership with IBM Bob as an AI development assistant.**

SANDBOX demonstrates how IBM Bob accelerates software development by turning ideas into production-ready applications in record time. What would typically take 40-50 hours was completed in just **12 hours** with Bob's assistance—a **70% reduction in development time**.

### 🎯 Bob's Impact

| Metric | Value |
|--------|-------|
| **Development Time** | 12 hours (vs 40-50 hours without Bob) |
| **Components Generated** | 8 production-ready React components |
| **Lines of Code** | 2,500+ lines with TypeScript |
| **Complex Problems Solved** | 15+ architectural and technical challenges |
| **Time Saved** | 70-75% faster development |

### 💡 How Bob Was Used

1. **System Architecture** - Bob designed the 3-column dashboard layout and state management strategy
2. **Component Generation** - Bob created all 8 major React components with animations and TypeScript
3. **API Integration** - Bob implemented IBM WatsonX AI integration for code analysis
4. **Problem Solving** - Bob resolved React hydration errors, viewport optimization, and animation logic
5. **Styling & Design** - Bob created the cohesive retro pixel beach aesthetic
6. **Documentation** - Bob wrote comprehensive README and inline documentation

### 📊 Evidence of Bob's Contributions

- **[Complete Development Documentation →](./BOB_DEVELOPMENT.md)** - Detailed breakdown of Bob's contributions
- **[Session Logs →](./bob_sessions/)** - 15MB+ of conversation logs showing every interaction
- **[Code Attribution →](./BOB_DEVELOPMENT.md#evidence-of-bobs-contributions)** - Specific components and features Bob built

### 🚀 Key Achievements with Bob

- ✅ **First-time-right code** - Production-ready components that worked on first run
- ✅ **Instant expertise** - Access to Next.js 15, React Flow, Framer Motion best practices
- ✅ **Complex animations** - Physics-based particle effects and smooth transitions
- ✅ **Type safety** - Comprehensive TypeScript types throughout
- ✅ **Professional polish** - Cohesive design system and user experience

**This project proves that IBM Bob empowers developers at any skill level to deliver high-quality software with greater efficiency and confidence.**

---

## 🌊 Table of Contents

- [Built with IBM Bob](#-built-with-ibm-bob)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [AI Output Format](#-ai-output-format)
- [Risk Score Guide](#-risk-score-guide)
- [Design Philosophy](#-design-philosophy)
- [Interactive Features](#-interactive-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [AI Output Format](#-ai-output-format)
- [Risk Score Guide](#-risk-score-guide)
- [Design Philosophy](#-design-philosophy)
- [Interactive Features](#-interactive-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏖️ Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏖️ SANDBOX  ● ACTIVE  💍 // ecommerce-platform-v3      [CRITICAL] │
├──────────────┬──────────────────────────────┬─────────────────────┤
│ SYSTEM MAP   │  FUTURE FAILURE REPLAY       │  AI RISK REPORT     │
│              │                              │                     │
│  [Frontend]  │  T+0s  🟢 NOMINAL            │  RISK SCORE         │
│  [Auth] ⚠️   │  T+12m 📈 TRAFFIC SPIKE      │      78 / 100       │
│  [Payment]🔴 │  T+21m 🔴 TIMEOUT            │                     │
│  [Database]  │  T+23m 💥 CASCADE FAIL       │  ■ 7 Issues         │
│  [Cache]     │  T+31m 🚨 TOTAL OUTAGE       │  ■ Cost: $11,700    │
│              │                              │  ✓ Recommendations  │
└──────────────┴──────────────────────────────┴─────────────────────┘
```

Sandbox is not a linter. It is a **deployment simulation engine** — powered by **IBM WatsonX AI** — that predicts how your software behaves in the real world before you ship it.

Built with a **retro pixel beach aesthetic**, Sandbox transforms code analysis into an immersive, interactive experience where you can literally see your system break in slow motion.

---

## ✨ Features

### 🎯 Core Analysis
- **Drag & Drop ZIP Upload** — Drop any codebase archive with particle burst effects
- **IBM WatsonX AI Integration** — Server-side analysis via `/api/analyze` using IBM's Granite models
- **Intelligent Code Scanning** — Automatically extracts file tree, detects stack, and maps architecture
- **Risk Score Calculation** — 0-100 score with animated counter and color-coded severity bar
- **Actionable Insights** — Each issue includes specific, technical recommendations

### 🎨 Interactive Dashboard
- **React Flow System Map** — Interactive node graph with animated edges, color-coded by risk level
- **Hover Tooltips** — Detailed information on module hover with smooth animations
- **Click to Select** — Select modules to highlight and view detailed information
- **Expandable Issues** — Click any issue to reveal comprehensive recommendations
- **Interactive Stack Tags** — Hover effects with scale and glow animations

### 🎬 Cinematic Experience
- **Future Failure Replay** — Step-by-step animated timeline showing exactly how your system breaks
- **Damage Meter** — Real-time system integrity tracker that degrades as failures progress
- **Playback Controls** — Play, pause, replay with smooth transitions
- **Auto-scrolling Logs** — Processing logs automatically scroll to show latest entries
- **Particle Effects** — Colorful particle burst when dropping ZIP files

### 🎮 User Experience
- **Demo Mode** — Fully functional without API keys; loads pre-built e-commerce scenario
- **Smooth Animations** — Framer Motion throughout with spring physics
- **Beach Theme** — Consistent retro pixel aesthetic with warm sand tones
- **Responsive Design** — Viewport-optimized layout that fits perfectly on any screen
- **No Hydration Errors** — Client-side mounting strategy prevents React hydration issues

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes |
| **UI Library** | React 19 | Component architecture |
| **Language** | TypeScript | Type safety throughout |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **System Graph** | React Flow (`@xyflow/react`) | Interactive node visualization |
| **Animations** | Framer Motion | Smooth, physics-based animations |
| **AI Provider** | IBM WatsonX AI | Code analysis and risk prediction |
| **File Processing** | AdmZip | ZIP file extraction and analysis |
| **Fonts** | Press Start 2P · VT323 · Rajdhani | Retro pixel aesthetic |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **IBM WatsonX AI** API key and Project ID ([Get started here](https://www.ibm.com/watsonx))

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

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
# IBM WatsonX AI credentials (required for live ZIP analysis)
WATSONX_API_KEY=your-ibm-api-key-here
WATSONX_PROJECT_ID=your-project-id-here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Optional: override the default model
# WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

> **Note:** Without these variables, the app automatically falls back to **demo mode** — no configuration required to explore the UI and features.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # IBM WatsonX AI proxy — ZIP → risk report
│   ├── globals.css               # Tailwind v4 + beach theme + animations
│   ├── layout.tsx                # Root layout with fonts + hydration fix
│   └── page.tsx                  # Main orchestrator with state machine
├── components/
│   ├── TopBar.tsx                # Sticky header with status and project name
│   ├── UploadScreen.tsx          # Drag-and-drop with particle effects
│   ├── ProcessingScreen.tsx      # Animated castle + auto-scrolling logs
│   ├── SystemMap.tsx             # React Flow interactive node graph
│   ├── Timeline.tsx              # Failure replay with playback controls
│   ├── RiskReport.tsx            # Animated score + expandable issues
│   ├── Dashboard.tsx             # 3-column responsive layout
│   └── AnalyzingOverlay.tsx      # Full-screen loading overlay
├── lib/
│   ├── demo-data.ts              # Demo scenario + processing stages
│   └── utils.ts                  # Color maps, formatters, helpers
└── types/
    └── index.ts                  # TypeScript interfaces and types
```

---

## 🤖 AI Output Format

The `/api/analyze` route sends the extracted codebase summary to IBM WatsonX AI and expects the following structured JSON response:

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

## 📊 Risk Score Guide

| Score | Level | Badge | Meaning |
|---|---|---|---|
| **0 – 39** | LOW | 🟢 | Minor issues; safe to deploy with small fixes |
| **40 – 59** | MEDIUM | 🟡 | Notable risks; review before production |
| **60 – 79** | HIGH | 🟠 | Significant vulnerabilities; do not ship yet |
| **80 – 100** | CRITICAL | 🔴 | Severe failure risk; system will break under load |

---

## 🎨 Design Philosophy

Sandbox is designed to feel like **dropping a world into a simulation engine**, not uploading code to a static analyzer.

### Visual Inspiration
- **Pixel art strategy games** and sandbox simulation tools
- **Retro-futuristic system HUDs** and soft industrial dashboards
- **Beach/sandbox aesthetic** with warm sand and brown tones
- **Tactile, worn-in feel** of analog instruments rendered digitally

### Color Palette
- **Base:** Warm sand (#f5e6a3) and brown (#6b4226) tones
- **Status:** Green (safe), Amber (warning), Red (failure)
- **Accents:** Cyan (#3db9f5) for highlights

### Typography
- **Headers:** Press Start 2P (retro pixel font)
- **Data:** VT323 (monospace terminal font)
- **Body:** Rajdhani (clean, modern sans-serif)

---

## 🎮 Interactive Features

### Particle Effects
- **30 colorful particles** burst when dropping ZIP files
- Physics-based animation with realistic velocity
- Colors match the beach theme (gold, cyan, green)

### Module Interactions
- **Hover:** Smooth slide animation, scale up, glowing effects
- **Click:** Select/deselect with highlighted background
- **Tooltips:** Show risk level and file count on hover

### Expandable Issues
- **Click to expand:** Reveal detailed recommendations
- **Smooth animations:** Height transitions with ease-out
- **Visual indicators:** "▼ Click for recommendations"

### Stack Tags
- **Hover effects:** Scale up 105% and lift 2px
- **Enhanced glow:** Brighter border and text shadow
- **Tap feedback:** Scale down on click

---

## 🗺️ Roadmap

- [ ] **AI Agents Attack Mode** — Adversarial agents probe your system for vulnerabilities
- [ ] **Deployment Weather Forecast** — 7-day risk outlook as your system scales
- [ ] **GitHub Integration** — Analyze repositories directly without manual ZIP export
- [ ] **Multi-version Diff** — Compare risk scores between two versions
- [ ] **Export Report** — Download full risk report as formatted PDF
- [ ] **Real-time Monitoring** — Connect to live systems for continuous analysis
- [ ] **Team Collaboration** — Share reports and collaborate on fixes

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Test interactive features thoroughly
- Maintain the beach theme aesthetic
- Keep animations smooth and performant

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **IBM Bob** for being an exceptional AI development partner that made this project possible
- **IBM WatsonX AI** for powering the code analysis engine
- **Framer Motion** for smooth, physics-based animations
- **React Flow** for the interactive system map
- **Next.js** team for the amazing framework
- **Beach vibes** for the aesthetic inspiration 🏖️

---

<p align="center">
  <strong>🤖 Developed in Partnership with IBM Bob</strong><br>
  <sub>This project demonstrates how IBM Bob accelerates software development</sub><br>
  <sub>9 complete Bob sessions • 12 hours with Bob vs 40-50 hours without • 70% faster development</sub><br><br>
  <sub>Drop your system. Watch it break. Ship it fixed.</sub><br><br>
  <sub>📚 <a href="./BOB_DEVELOPMENT.md">View Complete Bob Development Documentation</a></sub><br>
  <sub>💬 <a href="./bob_sessions/">View 9 Bob Session Logs (15MB+)</a></sub>

  <sub>Built by:
- Jamie De Vera (Contributor)
- Vea Vannez Victoria (Contributor)
- Nikka Nate (Contributer)
- Margaret Tomimbang (Contributor)
- Nowee Carig (Contributor)
- Jeremy Fabian (Contributer)</a></sub><br>
</p>

---

## 🎯 Quick Start Guide

### For First-Time Users

1. **Try Demo Mode First**
   ```bash
   npm run dev
   # Click "RUN DEMO" to see a pre-built scenario
   ```

2. **Upload Your Own Project**
   - Export your project as a ZIP file
   - Drag and drop onto the upload zone
   - Watch the particle effects! 🎆
   - See your system analyzed in real-time

3. **Explore the Dashboard**
   - **Left:** System map and modules (click to select)
   - **Center:** Failure timeline (play/pause/replay)
   - **Right:** Risk report (click issues for recommendations)

### For Developers

1. **Set up IBM WatsonX AI**
   - Get API key from [IBM Cloud](https://cloud.ibm.com)
   - Add credentials to `.env.local`
   - Restart dev server

2. **Customize the Theme**
   - Edit `src/app/globals.css` for colors
   - Modify components for layout changes
   - All animations use Framer Motion

3. **Extend the Analysis**
   - Add new risk detection in `src/app/api/analyze/route.ts`
   - Create custom simulation scenarios in `src/lib/demo-data.ts`
   - Build new interactive features in components

---

**Made with Bob using IBM WatsonX AI**
