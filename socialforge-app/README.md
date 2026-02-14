# SocialForge App

Full-stack Next.js application for cloning any creator's voice across 11 platforms. Analyze voice DNA, generate content, optimize for engagement, and validate authenticity — all powered by Claude AI with an automatic refinement loop.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | 5.9.3 |
| React | React | 19.2.4 |
| Database | Convex | 1.31.7 |
| AI SDK | @anthropic-ai/sdk | 0.30.0 |
| Styling | Tailwind CSS | 4.1.18 |
| UI | Radix UI + Lucide Icons | — |
| Runtime | Node.js | 24.x (LTS) |
| Package Manager | npm | 11.x |

## Features

- **11 Platforms**: YouTube, Instagram, LinkedIn, Twitter/X, TikTok, Newsletter, Podcast, Blog, Threads, Facebook, Email Copywriting
- **4-Step Pipeline**: P1 Analyze → P2 Generate → P3 Optimize → P4 Validate
- **Cross-Platform Voice Adaptation**: Use any profile on any platform — voice DNA is preserved, platform patterns are adapted automatically
- **Auto-Refinement Loop**: Automatically re-optimizes and re-validates until score reaches 9+/10 (up to 5 rounds)
- **Prompt Caching**: Anthropic prompt caching enabled — 90% savings on repeated system prompts
- **Content Library**: Kanban board (Draft → Review → Approved → Published) with copy/export
- **Cost Tracking**: Per-call token counts, costs, and cache hit reporting on the dashboard
- **Multi-Provider**: Anthropic (direct) or OpenRouter (100+ models)

## Prerequisites

- **Node.js 20+** (tested on v24.5.0)
- **npm 10+** (tested on v11.5.2)
- **Convex account** (free at https://convex.dev)
- **API Key** — at least one of:
  - Anthropic API key (https://console.anthropic.com)
  - OpenRouter API key (https://openrouter.ai)

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/shawnvink/socialforge.git
cd socialforge/socialforge-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Required: at least one AI provider
ANTHROPIC_API_KEY=sk-ant-...

# Optional: for multi-model access
OPENROUTER_API_KEY=sk-or-...
```

### 3. Set up Convex (database)

```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex (first time only)
- Create a new project or connect to an existing one
- Auto-populate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Start watching for schema changes

**Leave this terminal running** — it syncs your database schema in real-time.

### 4. Start the dev server

Open a **second terminal**:

```bash
npm run dev
```

The app is now running at **http://localhost:3000**.

---

## Starting and Stopping the Server

### Starting (2 terminals required)

**Terminal 1 — Convex (database sync):**
```bash
cd socialforge/socialforge-app
npx convex dev
```

**Terminal 2 — Next.js (web server):**
```bash
cd socialforge/socialforge-app
npm run dev
```

App runs at: `http://localhost:3000`

### Stopping

**Stop the Next.js server:**
Press `Ctrl+C` in Terminal 2.

**Stop Convex sync:**
Press `Ctrl+C` in Terminal 1.

**Kill a stuck server (if port 3000 is in use):**
```bash
lsof -ti:3000 | xargs kill -9
```

### Running on a different port

```bash
npm run dev -- --port 3001
```

### Production build

```bash
npm run build
npm run start
```

---

## Updating the Software

### Update all npm dependencies

```bash
# See what's outdated
npm outdated

# Update all packages to latest compatible versions
npm update

# Update to latest major versions (may include breaking changes)
npx npm-check-updates -u
npm install
```

### Update specific packages

```bash
# Update Next.js
npm install next@latest

# Update Anthropic SDK
npm install @anthropic-ai/sdk@latest

# Update Convex
npm install convex@latest

# Update React
npm install react@latest react-dom@latest

# Update Tailwind CSS
npm install tailwindcss@latest @tailwindcss/postcss@latest

# Update all Radix UI packages
npm install @radix-ui/react-accordion@latest @radix-ui/react-alert-dialog@latest @radix-ui/react-dialog@latest @radix-ui/react-dropdown-menu@latest @radix-ui/react-label@latest @radix-ui/react-select@latest @radix-ui/react-slot@latest @radix-ui/react-tabs@latest @radix-ui/react-toast@latest

# Update TypeScript
npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest
```

### Update Node.js itself

```bash
# Using nvm (recommended)
nvm install --lts
nvm use --lts

# Or using Homebrew (macOS)
brew upgrade node
```

### After any update

```bash
# Verify everything still compiles
npm run build

# Test locally
npm run dev
```

### Deploy Convex schema changes

```bash
# Development (auto-syncs when running `npx convex dev`)
npx convex dev

# Production deployment
npx convex deploy
```

---

## Project Structure

```
socialforge-app/
├── app/                      # Next.js app router pages
│   ├── page.tsx              # Dashboard (stats, platforms, usage)
│   ├── generate/page.tsx     # P1→P4 pipeline UI
│   ├── content/              # Content library (list + kanban)
│   ├── profiles/             # Saved voice profiles
│   ├── settings/             # API key configuration
│   └── api/
│       ├── llm/route.ts      # LLM proxy (Anthropic + OpenRouter)
│       ├── prompts/route.ts  # Prompt loader API
│       └── settings/route.ts # Settings API
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema (profiles, content, usage)
│   ├── profiles.ts           # Profile CRUD operations
│   ├── content.ts            # Content CRUD operations
│   └── analytics.ts          # Usage tracking + stats
├── lib/
│   ├── llm/
│   │   ├── anthropic.ts      # Anthropic provider (with prompt caching)
│   │   ├── openrouter.ts     # OpenRouter provider
│   │   ├── provider.ts       # Provider interface
│   │   └── models.ts         # Model definitions + pricing
│   └── prompts/
│       ├── loader.ts         # Prompt file loader
│       └── crossPlatformAdapter.ts  # Cross-platform voice bridging
├── components/               # Shared UI components
└── prompts/                  # (Empty — prompts live in parent dir)
```

Prompt templates are in the parent `socialforge/` directory:
```
socialforge/
├── youtube/P1_youtube_analyzer.md ... P4_youtube_validator.md
├── instagram/P1_instagram_analyzer.md ...
├── linkedin/ ...
├── twitter/ ...
├── tiktok/ ...
├── newsletter/ ...
├── podcast/ ...
├── blog/ ...
├── threads/ ...
├── facebook/ ...
├── email-copywriting/ ...
└── core/
    ├── C1_social_voice_analyzer.md
    ├── C2_content_strategy_architect.md
    └── C3_cross_platform_harmonizer.md
```

---

## Available Models

### Anthropic (Direct)

| Model | Input/1M | Output/1M | Best For |
|-------|----------|-----------|----------|
| Claude Opus 4.6 | $15.00 | $75.00 | Most capable overall |
| Claude Opus 4.5 | $5.00 | $25.00 | Deep voice analysis (P1), complex generation |
| Claude Sonnet 4.5 | $3.00 | $15.00 | Best balance — generation (P2) + optimization (P3) |
| Claude Haiku 4.5 | $0.80 | $4.00 | Fast validation (P4), quick tasks |

### OpenRouter

Claude Opus 4.5, Sonnet 4.5, Haiku 4.5, GPT-4o, GPT-4o Mini, Gemini 2.0 Flash, Llama 3.3 70B, DeepSeek V3

---

## Cross-Platform Voice Adaptation

When you select a profile built on one platform (e.g., Email Copywriting) to generate content for a different platform (e.g., TikTok), the system automatically:

1. Preserves the creator's core voice DNA (vocabulary, rhythm, humor, values, rhetorical devices)
2. Adapts platform patterns (structure, formatting, length, engagement, tone) to the target
3. Injects bridging context into P2/P3/P4 prompts
4. Adjusts P4 validation to prioritize voice fidelity over platform conformance

An amber banner appears in the UI whenever cross-platform adaptation is active.

---

## Prompt Caching

Anthropic prompt caching is enabled by default. System prompts (~40K chars each) are cached for 5 minutes:

- **First call**: Normal input price + 25% cache write fee
- **Subsequent calls within 5 min**: 90% savings on system prompt tokens
- **Biggest savings**: During the refinement loop (P3→P4 runs multiple rounds with same system prompt)

Cache hits are displayed in the cost indicator: "Cache hit: X tokens cached"

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | One of these | Anthropic API key |
| `OPENROUTER_API_KEY` | required | OpenRouter API key |
| `CONVEX_DEPLOYMENT` | Yes | Auto-set by `npx convex dev` |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Auto-set by `npx convex dev` |

---

## Troubleshooting

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Convex not connecting:**
```bash
npx convex dev --once  # Re-sync schema
npx convex dev         # Restart watcher
```

**Build fails after updating packages:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**"ANTHROPIC_API_KEY not configured":**
Ensure `.env.local` exists with your key. Restart the dev server after editing env files.
