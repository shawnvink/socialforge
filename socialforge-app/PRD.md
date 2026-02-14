# SocialForge App - Product Requirements Document

## Version 1.0 | February 2026

---

## 1. Product Overview

### What
A local web application (localhost:3000) that automates SocialForge's 11-platform voice cloning system. Eliminates all copy-pasting by orchestrating the P1-P4 workflow programmatically through LLM API calls, storing all profiles and generated content in Convex database.

### Why
SocialForge currently exists as 47 markdown prompt files. Users must manually copy prompts into Claude, paste content samples, copy outputs, and repeat across 4 steps per platform. This is tedious, error-prone, and loses work between sessions. The app automates this entire workflow.

### Who
Creators, marketers, and agencies who use SocialForge to generate voice-matched content across 11 platforms. Primary user: solo creator managing multiple platforms.

---

## 2. Core Architecture

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **UI Components:** Radix UI primitives + custom components
- **Database:** Convex (cloud-hosted, real-time, accessed locally)
- **State Management:** Zustand (client-side)
- **LLM Integration:** Dual provider support (see Section 4)

### Project Structure
```
socialforge-app/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Dashboard / home
│   ├── settings/page.tsx         # API keys + model preferences
│   ├── profiles/page.tsx         # Voice profiles list
│   ├── profiles/[id]/page.tsx    # Profile detail
│   ├── generate/page.tsx         # Content generation workspace
│   ├── content/page.tsx          # Content library + Kanban
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Base UI components
│   ├── layout/                   # Header, sidebar, navigation
│   ├── profiles/                 # Profile-related components
│   ├── generate/                 # Generation workflow components
│   ├── content/                  # Content library components
│   └── settings/                 # Settings components
├── convex/
│   ├── _generated/               # Convex auto-generated
│   ├── schema.ts                 # Database schema
│   ├── profiles.ts               # Profile CRUD + queries
│   ├── content.ts                # Content CRUD + queries
│   ├── settings.ts               # User settings
│   ├── analytics.ts              # Cost + usage tracking
│   └── llm.ts                    # LLM action (calls APIs)
├── lib/
│   ├── llm/
│   │   ├── provider.ts           # Abstract LLM provider interface
│   │   ├── anthropic.ts          # Anthropic SDK implementation
│   │   ├── openrouter.ts         # OpenRouter implementation
│   │   └── models.ts             # Model catalog + pricing
│   ├── prompts/
│   │   └── loader.ts             # Loads .md prompt files
│   ├── utils.ts                  # Shared utilities
│   └── store.ts                  # Zustand store
├── prompts/                      # All 47 .md prompt files (copied from parent)
│   ├── youtube/
│   ├── instagram/
│   ├── linkedin/
│   ├── twitter/
│   ├── tiktok/
│   ├── newsletter/
│   ├── podcast/
│   ├── blog/
│   ├── threads/
│   ├── facebook/
│   └── email-copywriting/
└── .env.local                    # API keys (gitignored)
```

---

## 3. Database Schema (Convex)

### Tables

**profiles**
```
- _id: Id<"profiles">
- creatorName: string
- platform: string (youtube | instagram | linkedin | twitter | tiktok | newsletter | podcast | blog | threads | facebook | email-copywriting)
- voiceBible: string (raw text of voice bible)
- expressionProfile: string (JSON - the P1 output)
- helixScore: number (0-10)
- modelUsed: string (e.g. "claude-sonnet-4-5" or "openai/gpt-4")
- provider: string ("anthropic" | "openrouter")
- createdAt: number
- updatedAt: number
```

**content**
```
- _id: Id<"content">
- profileId: Id<"profiles">
- platform: string
- contentType: string (e.g. "post", "thread", "email_sales", "blog_post")
- generatedContent: string (P2 output)
- optimizedContent: string | null (P3 output)
- validationReport: string | null (P4 output)
- validationScore: number | null (composite score)
- kanbanStatus: string ("draft" | "review" | "approved" | "published")
- modelUsed: string
- provider: string
- promptTokens: number
- completionTokens: number
- cost: number
- createdAt: number
- updatedAt: number
```

**settings**
```
- _id: Id<"settings">
- anthropicApiKey: string | null (encrypted or stored in .env)
- openrouterApiKey: string | null
- activeProvider: string ("anthropic" | "openrouter")
- defaultModel: string
- defaultPlatform: string | null
- createdAt: number
- updatedAt: number
```

**usage**
```
- _id: Id<"usage">
- contentId: Id<"content"> | null
- profileId: Id<"profiles"> | null
- action: string ("analyze" | "generate" | "optimize" | "validate")
- model: string
- provider: string
- promptTokens: number
- completionTokens: number
- cost: number
- createdAt: number
```

---

## 4. Dual LLM Provider System

### Provider Abstraction

The app supports two LLM providers. The user picks one in Settings and can switch anytime.

**Option 1: Anthropic API**
- Direct Anthropic SDK (`@anthropic-ai/sdk`)
- Models: Claude Opus 4.6, Sonnet 4.5, Haiku 4.5
- Prompt caching support for cost reduction
- Best for: Users who only want Claude models

**Option 2: OpenRouter**
- OpenAI-compatible SDK (`openai` package with custom baseURL)
- Models: 100+ models (Claude, GPT-4, Gemini, Llama, Mistral, etc.)
- Model selection UI with pricing display
- Best for: Users who want model flexibility or cost optimization

### Provider Interface
```typescript
interface LLMProvider {
  generate(params: {
    model: string;
    systemPrompt: string;
    userPrompt: string;
    maxTokens?: number;
  }): Promise<{
    content: string;
    promptTokens: number;
    completionTokens: number;
    cost: number;
  }>;
}
```

### API Keys
- Stored in `.env.local` (never committed)
- Settings page provides input fields
- Keys saved to `.env.local` via API route
- Convex actions read from environment

---

## 5. Supported Platforms (11)

| # | Platform | Prompt Files | Content Types |
|---|----------|-------------|---------------|
| 1 | YouTube | P1-P4 | Titles, descriptions, scripts |
| 2 | Instagram | P1-P4 | Captions, carousel copy, reels scripts |
| 3 | LinkedIn | P1-P4 | Posts, articles, comments |
| 4 | Twitter/X | P1-P4 | Tweets, threads |
| 5 | TikTok | P1-P4 | Captions, scripts, hooks |
| 6 | Newsletter | P1-P4 | Educational newsletters (1000-2000 words) |
| 7 | Podcast | P1-P4 | Show notes, episode descriptions |
| 8 | Blog | P1-P4 | Blog posts, SEO-optimized articles |
| 9 | Threads | P1-P4 | Thread posts |
| 10 | Facebook | P1-P4 | Posts, ad copy |
| 11 | Email Copywriting | P1-P4 | Sales emails (200-400 words) |

---

## 6. Core Workflows

### Workflow 1: Voice Analysis (P1)

**User Flow:**
1. User selects platform from dropdown
2. User pastes 20-30 content samples into text area
3. User optionally uploads Voice Bible text
4. User clicks "Analyze Voice"
5. App loads P1 prompt for selected platform
6. App injects content samples into prompt
7. App sends to LLM (Anthropic or OpenRouter based on settings)
8. App receives Expression Profile response
9. App parses and stores profile in Convex
10. App displays profile summary with Helix Score

**Technical Flow:**
```
User Input -> Load P1 prompt -> Inject samples -> LLM API call ->
Parse response -> Store in Convex -> Display profile
```

### Workflow 2: Content Generation (P2)

**User Flow:**
1. User selects platform
2. User selects existing voice profile (or creates new via P1)
3. User fills content brief (topic, type, tone, etc.)
4. Platform-specific options appear (email type, blog length, etc.)
5. User clicks "Generate"
6. App loads P2 prompt, injects Voice Bible + Expression Profile + brief
7. LLM generates content
8. App stores content in Convex with "draft" Kanban status
9. App displays generated content with copy/edit options

### Workflow 3: Optimization (P3)

**User Flow:**
1. User selects generated content from library
2. User picks optimization focus (engagement, conversion, reach)
3. App loads P3 prompt with content + profile
4. LLM returns optimized version + A/B variants
5. App stores optimized version alongside original

### Workflow 4: Validation (P4)

**User Flow:**
1. User selects content (generated or optimized)
2. App loads P4 prompt with content + profile
3. LLM returns validation report with scores
4. App displays pass/fail for each test
5. If fail: highlights issues, suggests fixes
6. App stores validation score on content record

### Workflow 5: Full Pipeline (P1 -> P4 Automated)

**User Flow:**
1. User selects "Full Pipeline" mode
2. Completes P1 inputs (samples) + P2 inputs (brief)
3. App runs P1 -> P2 -> P3 -> P4 sequentially
4. Each step's output feeds into the next
5. Final result: validated, optimized content ready to publish
6. All intermediate outputs stored in Convex

---

## 7. Pages & UI

### Page 1: Dashboard (/)
- Overview stats: profiles created, content generated, total cost
- Quick actions: "New Profile", "Generate Content", "View Library"
- Recent activity feed
- Platform breakdown chart

### Page 2: Settings (/settings)
- API provider toggle (Anthropic / OpenRouter)
- API key input fields (masked)
- Default model selection
  - Anthropic: dropdown with Opus/Sonnet/Haiku
  - OpenRouter: searchable dropdown with 100+ models, showing pricing
- Default platform selection
- Cost tracking preferences
- "Test Connection" button

### Page 3: Voice Profiles (/profiles)
- List of all created profiles
- Filter by platform
- Each card shows: creator name, platform, Helix Score, date
- Click to view full Expression Profile
- Delete / re-analyze options

### Page 4: Profile Detail (/profiles/[id])
- Full Expression Profile display (formatted JSON)
- Helix Score visualization
- Associated content list
- "Generate Content" button (goes to P2 with this profile)
- Re-analyze option
- Export profile as JSON

### Page 5: Generate (/generate)
- Platform selector
- Profile selector (existing profiles for chosen platform)
- Content brief form (dynamic based on platform)
- Model override (optional - uses default from settings)
- Pipeline selector: P2 only | P2+P3 | P2+P3+P4
- Generate button
- Real-time streaming output display
- Save to library button

### Page 6: Content Library (/content)
- Two views: List view and Kanban view
- Kanban columns: Draft | Review | Approved | Published
- Filter by platform, profile, date, score
- Click to view full content
- Inline actions: optimize (P3), validate (P4), copy, delete
- Drag-and-drop between Kanban columns
- Export options (copy, download)

---

## 8. Key Technical Details

### Prompt Loading
- All 47 .md prompt files copied into `prompts/` directory
- `lib/prompts/loader.ts` reads files at build time or runtime
- Prompts are injected with dynamic content (samples, profiles, briefs)
- Template variables in prompts: `{{VOICE_BIBLE}}`, `{{EXPRESSION_PROFILE}}`, `{{CONTENT_SAMPLES}}`, `{{CONTENT_BRIEF}}`

### LLM Call Flow (Convex Action)
```
Client -> Convex Mutation (save request) -> Convex Action (LLM call) ->
Convex Mutation (save response) -> Client (real-time update)
```

Convex Actions run server-side, keeping API keys secure. Real-time subscriptions update the UI automatically when responses arrive.

### Streaming
- Anthropic SDK supports streaming natively
- OpenRouter supports streaming via OpenAI SDK
- Stream responses displayed in UI character-by-character
- Full response saved to Convex when stream completes

### Cost Tracking
- Every LLM call logs tokens + cost to `usage` table
- Cost calculated using model-specific pricing from `lib/llm/models.ts`
- Dashboard shows running totals: daily, weekly, monthly, all-time
- Per-content cost shown on each content card

### Error Handling
- API key validation on settings save
- Graceful handling of rate limits (retry with backoff)
- Token limit warnings before sending large prompts
- Network error recovery with saved state

---

## 9. Model Catalog

### Anthropic Models
| Model | ID | Input $/1M | Output $/1M | Best For |
|-------|-----|-----------|------------|----------|
| Opus 4.6 | claude-opus-4-6 | $15.00 | $75.00 | Complex analysis (P1) |
| Sonnet 4.5 | claude-sonnet-4-5-20250929 | $3.00 | $15.00 | Generation (P2), Optimization (P3) |
| Haiku 4.5 | claude-haiku-4-5-20251001 | $0.80 | $4.00 | Validation (P4), quick tasks |

### OpenRouter Popular Models
| Model | ID | Input $/1M | Output $/1M |
|-------|-----|-----------|------------|
| Claude Sonnet 4.5 | anthropic/claude-sonnet-4-5 | $3.00 | $15.00 |
| Claude Haiku 4.5 | anthropic/claude-haiku-4-5 | $0.80 | $4.00 |
| GPT-4o | openai/gpt-4o | $2.50 | $10.00 |
| GPT-4o Mini | openai/gpt-4o-mini | $0.15 | $0.60 |
| Gemini 2.0 Flash | google/gemini-2.0-flash | $0.10 | $0.40 |
| Llama 3.3 70B | meta-llama/llama-3.3-70b | $0.40 | $0.40 |
| DeepSeek V3 | deepseek/deepseek-chat | $0.14 | $0.28 |

Pricing fetched from OpenRouter API at runtime for accuracy.

---

## 10. Build Phases

### Phase 1: Foundation
- [x] Initialize Next.js + TypeScript + TailwindCSS
- [ ] Install all dependencies
- [ ] Setup Convex (schema, initial functions)
- [ ] Create base UI components (button, input, select, card, dialog, tabs)
- [ ] Create layout (sidebar navigation, header)
- [ ] Create settings page with API key management
- [ ] Implement LLM provider abstraction (Anthropic + OpenRouter)
- [ ] Test LLM connectivity with both providers

### Phase 2: Voice Analysis
- [ ] Copy all 47 prompt files into app
- [ ] Build prompt loader utility
- [ ] Build P1 Analyzer page
- [ ] Implement profile storage in Convex
- [ ] Build profiles list page
- [ ] Build profile detail page

### Phase 3: Content Generation
- [ ] Build P2 Generator page with dynamic forms per platform
- [ ] Implement streaming output display
- [ ] Build content storage in Convex
- [ ] Build content library (list + Kanban views)

### Phase 4: Optimization & Validation
- [ ] Build P3 Optimizer integration
- [ ] Build P4 Validator integration
- [ ] Full pipeline mode (P1 -> P4)
- [ ] Validation score display and pass/fail UI

### Phase 5: Polish
- [ ] Cost tracking dashboard
- [ ] Export functionality (JSON, clipboard)
- [ ] Error handling and edge cases
- [ ] Mobile-responsive layout
- [ ] Performance optimization

---

## 11. Environment Variables

```env
# .env.local

# Option 1: Anthropic (direct)
ANTHROPIC_API_KEY=sk-ant-...

# Option 2: OpenRouter
OPENROUTER_API_KEY=sk-or-...

# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
```

---

## 12. Non-Goals (v1)

- No user authentication (local app, single user)
- No team collaboration features
- No direct social media posting/scheduling
- No payment processing
- No mobile app (responsive web only)
- No custom prompt editing in UI (edit .md files directly)
- No image generation

---

## 13. Success Criteria

1. Zero copy-pasting: User never leaves the app during P1-P4 workflow
2. Profile persistence: Expression Profiles saved in Convex, reusable across sessions
3. Dual provider: Both Anthropic and OpenRouter work seamlessly
4. Model flexibility: User can pick any model for any step
5. Cost visibility: Every LLM call tracked with token count and cost
6. Content library: All generated content searchable, filterable, exportable
7. Sub-3-second UI: No page takes more than 3 seconds to load
8. All 11 platforms: Every platform's P1-P4 workflow functional
