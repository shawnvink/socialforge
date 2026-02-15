# SocialForge Instruction Manual

> **Version 3.0** — Complete guide to getting the best output from every feature.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Settings & Configuration](#2-settings--configuration)
3. [P1: Analyze — Voice Profile Extraction](#3-p1-analyze--voice-profile-extraction)
4. [P2: Generate — Content Creation](#4-p2-generate--content-creation)
5. [Web Research & URL Fetching](#5-web-research--url-fetching)
6. [P3: Optimize — Engagement Maximization](#6-p3-optimize--engagement-maximization)
7. [P4: Validate — Authenticity Scoring & Auto-Refinement](#7-p4-validate--authenticity-scoring--auto-refinement)
8. [Deep Analysis Modules (C1–C3)](#8-deep-analysis-modules-c1c3)
9. [Cross-Platform Voice Adaptation](#9-cross-platform-voice-adaptation)
10. [Content Library & Kanban](#10-content-library--kanban)
11. [Voice Profiles Management](#11-voice-profiles-management)
12. [Model Selection Strategy](#12-model-selection-strategy)
13. [Cost Management](#13-cost-management)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Quick Start

### First-Time Setup

1. **Configure API Key** — Go to **Settings**, enter your Anthropic or OpenRouter API key, click **Save Key**, then restart the dev server (`npm run dev`).
2. **Pick a Platform** — Go to **Generate**, select a platform (e.g., LinkedIn, YouTube, Email).
3. **Run P1** — Paste 20–30 content samples from the creator you want to clone.
4. **Run P2–P4** — Enter a topic, generate content, optimize, and validate.

### Minimum Requirements

| What | Minimum | Ideal |
|------|---------|-------|
| Content samples | 10 pieces | 20–30 pieces |
| Sample length | 50+ words each | 200+ words each |
| Sample variety | Same format | Mix of tones, topics |
| API key | 1 provider configured | Anthropic (best quality) |

---

## 2. Settings & Configuration

**Path**: `/settings`

### LLM Provider

Choose between two providers:

| Provider | Best For | Cost |
|----------|----------|------|
| **Anthropic Direct** | Highest quality voice cloning. Claude models are specifically tuned for SocialForge's prompts. | $0.80–$75 per 1M tokens |
| **OpenRouter** | Budget flexibility. Access to GPT-4o, Gemini, Llama, DeepSeek alongside Claude. | $0.14–$25 per 1M tokens |

**How to get keys:**
- **Anthropic**: Go to [console.anthropic.com](https://console.anthropic.com), create an account, generate an API key (starts with `sk-ant-`).
- **OpenRouter**: Go to [openrouter.ai/keys](https://openrouter.ai/keys), create an account, generate an API key (starts with `sk-or-`).

### Google Search API (Optional — for Web Research)

Enables the **Research** button in P2 Generate. Free tier gives 100 searches/day.

**Setup steps:**
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/) → Create a search engine → Set it to search the entire web → Copy the **Search Engine ID** (cx).
2. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Enable "Custom Search API" → Create an API key → Copy the **API Key**.
3. In SocialForge Settings, scroll to **Web Research**, paste both values, click **Save**.
4. Restart the dev server.

### Connection Test

After saving keys, click **Test Connection** at the bottom of Settings. You should see: `"SocialForge connected successfully"`. If not, double-check your key and restart the server.

---

## 3. P1: Analyze — Voice Profile Extraction

**What it does**: Reads 20–30 pieces of a creator's content and produces an **Expression Profile** — a detailed DNA map of their voice, including vocabulary patterns, sentence rhythm, humor style, emotional triggers, storytelling patterns, and rhetorical devices.

**Output**: Expression Profile document + **Helix Score** (0–10 authenticity rating).

### Option A: New Analysis

Use this when you're profiling a creator for the first time.

#### Creator Name

Enter the exact name of the creator whose voice you're cloning.

```
Good:  "Alex Hormozi"
Good:  "Sahil Bloom"
Bad:   "Alex" (too generic)
Bad:   "my writing style" (not a name — use Voice Bible instead)
```

**Why it matters**: The name is included in the prompt so the LLM can reference any public knowledge about this creator's style.

#### Content Samples

This is the **single most important input** in the entire app. Quality here determines everything downstream.

**What to paste:**
- 20–30 real content pieces from the creator
- Separate each piece with `---` on its own line or two blank lines

**Example format:**
```
The thing nobody tells you about hiring is that the best people
aren't looking for jobs. They're being recruited. If your job post
looks like every other company's, you'll get every other company's
candidates.

---

I spent $0 on marketing for 3 years. Instead, I spent $1M on
making the product so good people couldn't stop talking about it.
The best marketing is a product that markets itself.

---

Here's why most people fail at sales: They try to convince.
The best salespeople don't convince — they help people convince
themselves. Ask questions. Listen. Then show them what they
already know they need.
```

**Tips for best results:**

| Do | Don't |
|----|-------|
| Include a variety of topics | Use only one topic |
| Mix short and long pieces | Only use short tweets |
| Include their best-performing content | Use drafts or unfinished pieces |
| Keep original formatting (line breaks, caps, emojis) | Clean up or "fix" their writing |
| Include pieces that show personality (humor, rants, stories) | Only include formal/polished content |
| Use 20–30 samples minimum | Use fewer than 10 |

**File Upload**: Click **Upload Files** to import `.txt`, `.csv`, `.pdf`, `.docx`, or `.md` files. The content is automatically extracted and appended to the samples textarea.

#### Voice Bible (Optional)

If you already have a document describing the creator's voice (from a brand guide, previous analysis, or personal notes), paste it here. This gives the LLM a head start.

**Example Voice Bible:**
```
Tone: Direct, no-nonsense, occasionally profane. Uses short
declarative sentences. Loves numbered lists and contrarian takes.
Signature phrases: "Here's the thing", "Let me be blunt",
"Most people won't tell you this". Never uses corporate jargon.
Humor is dry and self-deprecating. Always includes a specific
dollar amount or metric to back up claims.
```

**When to use it:**
- You've profiled this creator before on a different tool
- You have brand guidelines from the creator
- You want to steer the analysis toward specific voice traits

**When to skip it:**
- First time profiling — let the LLM discover patterns organically
- You're not sure what to write — bad Voice Bible is worse than none

#### Running the Analysis

Click **Analyze Voice Profile**. You'll see:
- A streaming preview of the Expression Profile being generated
- Token count and cost after completion
- The profile is automatically saved to your database

The app auto-advances to P2 when P1 completes.

### Option B: Use Existing Profile

If you've already analyzed a creator, select their profile from the dropdown instead of re-running P1. This:
- Saves time and money (no API call needed)
- Loads the saved Expression Profile
- Jumps directly to P2

**Profile dropdown is split into:**
- **Same Platform** — Profiles created for the same platform you selected
- **Cross-Platform (Will Adapt)** — Profiles from other platforms (see [Cross-Platform](#9-cross-platform-voice-adaptation))

---

## 4. P2: Generate — Content Creation

**What it does**: Uses the Expression Profile from P1 to create original content in the creator's voice for the selected platform.

**Inputs required:**
1. Expression Profile (from P1 — loaded automatically)
2. Topic
3. Content Type
4. Additional Notes (optional)
5. Research Context (optional)

### Topic

What the content should be about. Be specific.

```
Bad:   "marketing"
OK:    "content marketing"
Good:  "Why most content marketing fails and the 3 things that actually work"
Best:  "Why most B2B SaaS companies waste money on content marketing —
        and the 3 counterintuitive strategies that generated $2M in
        pipeline for us last quarter"
```

**Why specificity matters**: A vague topic forces the LLM to make assumptions. A specific topic lets it focus on generating high-quality content that matches what you actually need.

### Content Type

Tells the LLM what format to produce. Use one of these:

| Content Type | Platform | What You Get |
|-------------|----------|-------------|
| `post` | LinkedIn, Facebook, Threads | Single-post format |
| `thread` | Twitter/X, Threads | Multi-tweet thread (numbered) |
| `caption` | Instagram | Photo/reel caption with hashtags |
| `script` | YouTube, TikTok, Podcast | Full script with [VISUAL] cues |
| `blog_post` | Blog | Long-form article with headers |
| `newsletter` | Newsletter | Email newsletter format |
| `email_sales` | Email Copywriting | Sales email with subject line, P.S. |
| `email_nurture` | Email Copywriting | Relationship/value email |
| `email_launch` | Email Copywriting | Product launch sequence email |
| `carousel` | Instagram, LinkedIn | Slide-by-slide carousel outline |
| `story` | Instagram | Story series (swipeable) |

You can also use custom types — the LLM will interpret them contextually.

### Additional Notes (Optional)

Free-form instructions to steer the generation. Examples:

```
Example 1 (Target audience):
"Target audience: SaaS founders doing $1M-$10M ARR who are
struggling with churn. Tone should be empathetic but direct."

Example 2 (Specific CTA):
"End with a CTA to download our free template at example.com/template.
Don't be too salesy — make it feel like a genuine recommendation."

Example 3 (Tone adjustment):
"This is for a more casual audience than usual. Use more humor,
fewer statistics. Think 'talking to a friend at a bar' energy."

Example 4 (Constraints):
"Keep it under 200 words. No emojis. No hashtags. Pure text only."

Example 5 (Structure):
"Start with a controversial hot take. Then back it up with 3
specific examples from real companies. End with a question
to drive comments."
```

### Running Generation

Click **Generate Content**. You'll see:
- Streaming preview as content is generated
- Token count and cost after completion
- Content is saved to your database as a "draft"

The app auto-advances to P3 (Optimize).

---

## 5. Web Research & URL Fetching

**What it does**: Enriches P2 generation with real-time web data so the LLM has factual, current context — not just its training data.

### Research Button (Web Search)

1. Enter your topic in the Topic field
2. Click **Research** (next to the topic input)
3. SocialForge searches Google for your topic
4. 5 results appear as clickable cards showing title + snippet
5. Click any result to fetch its full content
6. Fetched content is added to your **Research Context**

**Example flow:**
```
Topic: "AI agents replacing SaaS in 2026"
→ Click Research
→ Results appear:
   - "The Rise of AI Agents: Why SaaS is Dead — TechCrunch"
   - "How AI Agents Are Reshaping Enterprise Software — a16z"
   - "AI Agent Market Size to Reach $50B by 2028 — Gartner"
→ Click the TechCrunch result → Full article text is fetched
→ Click the a16z result → Full article text is fetched
→ Research Context now contains both articles
→ When you click Generate, the LLM uses this context
```

### Add URL (Manual)

Paste any URL directly:
1. Enter URL in the "Add URL" field (e.g., `https://example.com/article`)
2. Click **Fetch**
3. SocialForge scrapes the page, strips ads/navigation, extracts clean text
4. Content is added to Research Context

**Good URLs to add:**
- Industry reports or studies the content should reference
- Competitor blog posts you want to contrast with
- News articles with fresh data points
- The creator's own published content for consistency

### Saving Research

Click **Save Research** to persist your fetched sources to the database. Benefits:
- Reuse the same research for multiple content pieces
- Load saved research in future sessions
- Research is linked to the current voice profile

### Loading Saved Research

If you've saved research before, a **Saved Research** panel appears showing:
- Query that was searched
- Number of sources
- Date saved
- **Load** button — restores all sources into the current session
- **Delete** button — removes saved research

### How Research Context Affects Generation

The research context is appended to the P2 prompt as:
```
Research Context:
Source: Article Title (https://example.com/article)
[Full extracted text of the article...]

---
Source: Second Article (https://example.com/second)
[Full extracted text...]
```

This means the LLM can:
- Reference specific facts, statistics, and quotes
- Stay current on recent developments
- Ground the content in real sources
- Avoid hallucinating data

**Tip**: Don't overload with too many sources. 2–4 highly relevant sources produce better results than 10 loosely related ones.

---

## 6. P3: Optimize — Engagement Maximization

**What it does**: Takes the raw P2 output and rewrites it for maximum engagement on the target platform — while preserving the creator's voice.

### What Gets Optimized

| Aspect | What Changes |
|--------|-------------|
| **Hook** | Strengthened opening line to stop the scroll |
| **Structure** | Reformatted for platform-specific readability |
| **Rhythm** | Sentence length variation for better flow |
| **CTA** | Clearer, more compelling call-to-action |
| **Formatting** | Line breaks, spacing, emoji usage (platform-appropriate) |
| **Length** | Trimmed or expanded to platform optimal length |

### What Stays the Same

- Core voice DNA (vocabulary, pet phrases, humor style)
- Key message and argument structure
- Creator's values and beliefs
- Storytelling patterns
- Emotional triggers

### Running Optimization

Click **Optimize Content**. The LLM receives:
- The full Expression Profile (voice reference)
- The generated content (to optimize)
- Cross-platform context (if applicable)

**Output is split into two parts:**
1. **Optimized Content** — The final, ready-to-publish version
2. **Optimization Details** — A report explaining what changed and why (collapsible)

### Skip to Validate

If your P2 output is already strong and you don't want optimization, click **Skip to Validate** to go directly to P4.

---

## 7. P4: Validate — Authenticity Scoring & Auto-Refinement

**What it does**: Scores the content's authenticity on a 0–10 scale (the **Validation Score**) by comparing it against the Expression Profile. Provides detailed feedback on what's working and what isn't.

### Validation Score Meanings

| Score | Rating | What It Means |
|-------|--------|---------------|
| 9.0–10.0 | Excellent | Indistinguishable from the creator's real content |
| 8.0–8.9 | Very Good | Minor voice deviations, publish-ready |
| 7.0–7.9 | Good | Noticeable gaps, could use refinement |
| 6.0–6.9 | Fair | Significant voice mismatch, needs work |
| Below 6 | Poor | Doesn't sound like the creator |

### Auto-Refinement Loop

When you click **Run Validation**, SocialForge doesn't just score — it automatically improves:

1. P4 validates and scores the content
2. If score < 9.0, it automatically sends the feedback back to P3
3. P3 re-optimizes using the specific feedback
4. P4 re-validates the improved version
5. Repeats until score >= 9.0 or 5 rounds are reached

**During refinement you'll see:**
- A blue banner: "Refining... Round X/5"
- The current score
- A **Stop Refining** button (red) if you want to stop early

**After refinement you'll see:**
- **Score progression**: e.g., `7.2 → 8.1 → 8.8 → 9.1`
- Color-coded scores (red < 8, yellow 8–8.9, green 9+)
- Number of rounds taken

### When to Stop Refinement Early

- Score is 8.5+ and you're happy with the content
- The score plateaus (same score 2 rounds in a row)
- Cross-platform content (8.0+ is excellent for cross-platform)
- You're on a budget (each round costs tokens)

---

## 8. Deep Analysis Modules (C1–C3)

**Where**: Available in P2 Generate step, under "Deep Analysis (Optional)"

These are optional modules that provide deeper insights. They don't directly affect content generation but give you richer understanding.

### C1: Voice DNA Analyzer

**What it does**: Full forensic voice analysis — goes deeper than P1.

**When to use:**
- You want a comprehensive breakdown of a creator's voice patterns
- You're building a brand guide from the analysis
- You want to understand why the creator's content resonates

**Output includes:**
- Vocabulary frequency analysis
- Sentence structure patterns
- Rhetorical device catalog
- Emotional range mapping
- Audience relationship dynamics

### C2: Content Strategy Architect

**What it does**: Maps the creator's content strategy patterns.

**When to use:**
- Planning a content calendar in the creator's style
- Understanding what topics/formats work best
- Identifying content gaps

**Output includes:**
- Topic cluster analysis
- Content format preferences
- Posting rhythm patterns
- Engagement driver breakdown
- Strategic recommendations

### C3: Cross-Platform Harmonizer

**What it does**: Calibrates voice across different platforms.

**When to use:**
- Before generating cross-platform content
- Understanding how the creator adapts across platforms
- Planning a multi-platform strategy

**Output includes:**
- Platform-specific voice variations
- Adaptation recommendations
- Consistency score across platforms
- Format translation guidelines

### How to Run

1. Click any module button (C1, C2, or C3) in the P2 section
2. Results stream in a collapsible card below
3. Copy the output if needed
4. Each module runs independently — run one or all three

---

## 9. Cross-Platform Voice Adaptation

**What it is**: Using a voice profile built from one platform (e.g., YouTube) to generate content for a different platform (e.g., LinkedIn).

### How It Works

1. In P1, select an **Existing Profile** from a different platform
2. A yellow banner appears: "Voice from YouTube → Generating for LinkedIn"
3. SocialForge automatically:
   - Preserves the creator's core voice DNA
   - Adapts structure, formatting, length, and engagement style
   - Adjusts tone register for the target platform

### What Gets Preserved (Always)

- Vocabulary choices and pet phrases
- Sentence rhythm and cadence
- Humor style and emotional triggers
- Values, beliefs, and worldview
- Storytelling patterns
- Rhetorical devices

### What Gets Adapted (Per Platform)

| Platform | Structure | Length | Engagement |
|----------|-----------|--------|------------|
| YouTube | Script with visual cues | 1500–3000 words | Subscribe + comments |
| Instagram | Caption with hashtags | 50–300 words | Save + share |
| LinkedIn | Hook + insight + CTA | 200–600 words | Comments + reposts |
| Twitter/X | Thread with hooks | 280 chars per tweet | Retweets + replies |
| TikTok | Script with timing | 30–60 sec script | Duets + follows |
| Email | Subject + story + CTA | 300–800 words | Clicks + replies |
| Blog | Headers + depth | 1000–3000 words | Time on page |
| Newsletter | Sections + value | 500–1500 words | Open rate + clicks |
| Podcast | Conversational script | 2000–5000 words | Listens + reviews |
| Threads | Casual thread | 100–500 words | Replies + reposts |
| Facebook | Story + engagement | 200–500 words | Reactions + shares |

### Validation Scoring for Cross-Platform

Cross-platform content is scored more leniently:
- **Voice fidelity** is weighted heavily
- **Platform conformance** is weighted leniently
- A score of **8.0+** is considered excellent for cross-platform
- The validation report notes that slight structural deviations are expected

---

## 10. Content Library & Kanban

**Path**: `/content`

### Views

**List View** (default): Compact cards showing all content with platform, topic, score, status, cost, and date. Click any card to see full details.

**Board View** (Kanban): 4-column drag-like layout:

| Draft | In Review | Approved | Published |
|-------|-----------|----------|-----------|
| Just generated | Ready for review | Passed review | Live on platform |

### Managing Content Status

1. Go to `/content` → click a content piece
2. Use the **status dropdown** in the top-right to change:
   - **Draft** → content just created
   - **In Review** → sent for approval
   - **Approved** → ready to publish
   - **Published** → live on the platform

### Content Detail Page

Each content piece shows:
- **Generated Content** — Raw P2 output
- **Optimized Content** — P3 improved version (if run)
- **Optimization Details** — What changed and why (collapsible)
- **Validation Report** — Full P4 analysis (if run)
- **Quick Copy** — Copies the best version to clipboard

### Filtering

Filter by platform using the button row at the top. Click "All" to see everything.

---

## 11. Voice Profiles Management

**Path**: `/profiles`

### Viewing Profiles

Each profile card shows:
- Creator name and initial avatar
- Platform
- Helix Score (/10)
- Creation date

Click a profile to see:
- Full Expression Profile text (copyable)
- All content generated with this profile
- Export as JSON button

### Profile Export

Click **Export JSON** to download the profile as a `.json` file containing:
- Creator name, platform, Helix Score
- Full Expression Profile text
- Voice Bible (if provided)
- Model and provider used

### Deleting Profiles

Click **Delete** on a profile. Content generated with it will remain in the library but will lose its profile link.

---

## 12. Model Selection Strategy

### Default Recommendations

| Step | Recommended Model | Why |
|------|------------------|-----|
| **P1 Analyze** | Claude Opus 4.5 or 4.6 | Most thorough voice analysis |
| **P2 Generate** | Claude Sonnet 4.5 | Best quality/cost balance |
| **P3 Optimize** | Claude Sonnet 4.5 | Good at nuanced rewriting |
| **P4 Validate** | Claude Haiku 4.5 | Fast, cheap — validation is simpler |

### Per-Step Model Overrides

Click **Advanced** in the config bar to set different models per step. This lets you:
- Use expensive Opus for P1 (where quality matters most)
- Use cheap Haiku for P4 (validation doesn't need the biggest model)
- Save 50–70% on total workflow cost

### Budget Strategy

| Budget | Setup | Approx. Cost per Run |
|--------|-------|---------------------|
| **Premium** | Opus everywhere | $0.50–$2.00 |
| **Balanced** | Opus P1, Sonnet P2/P3, Haiku P4 | $0.15–$0.50 |
| **Budget** | Sonnet everywhere | $0.10–$0.30 |
| **Minimum** | Haiku everywhere | $0.02–$0.08 |
| **Ultra-Budget** | OpenRouter GPT-4o Mini or DeepSeek | $0.005–$0.02 |

### Prompt Caching (Anthropic Only)

Anthropic automatically caches your system prompts:
- First request: 25% more expensive (builds cache)
- Subsequent requests: **90% cheaper** on input tokens
- This means running the same platform's workflow multiple times gets significantly cheaper

---

## 13. Cost Management

### Dashboard

Go to `/` (home) to see:
- **Total Spend** — All-time cost
- **Today / This Week / This Month** — Period breakdown
- **API Calls** — Total count
- **By Action** — How many analyze, generate, optimize, validate calls

### Where Costs Come From

| Step | Typical Token Usage | Cost (Sonnet) |
|------|-------------------|---------------|
| P1 Analyze | 3K–8K input, 2K–5K output | $0.03–$0.10 |
| P2 Generate | 4K–10K input, 1K–4K output | $0.03–$0.09 |
| P3 Optimize | 4K–10K input, 2K–5K output | $0.03–$0.10 |
| P4 Validate | 4K–8K input, 1K–3K output | $0.02–$0.07 |
| Auto-refinement (per round) | P3 + P4 combined | $0.05–$0.17 |

**Web Research**: Free (uses your Google API quota, not LLM tokens). Research context adds input tokens to P2.

### Cost-Saving Tips

1. **Use existing profiles** — Skip P1 entirely ($0.03–$0.10 saved)
2. **Use per-step model overrides** — Haiku for P4 is 4x cheaper than Sonnet
3. **Stop refinement early** — If score is 8.5+, the content is publish-ready
4. **Skip P3** — If P2 output is already good, go straight to P4
5. **Reuse research** — Save research once, load it for multiple content pieces
6. **Prompt caching** — Run multiple pieces for the same platform to benefit from caching

---

## 14. Troubleshooting

### "API key not configured"

1. Go to Settings
2. Enter your API key for your chosen provider
3. Click Save Key
4. **Restart the dev server** (`Ctrl+C` then `npm run dev`)
5. Refresh the browser

### "Google Search API not configured"

1. Go to Settings → scroll to "Web Research (Google Search)"
2. You need both: a Google API Key AND a Search Engine ID
3. Get the API key at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Get the CX at [Programmable Search Engine](https://programmablesearchengine.google.com/)
5. Paste both, click Save, restart the server

### "Stream ended without metadata"

This usually means the LLM response was cut off. Try:
- Reducing the content sample size
- Using a model with higher max tokens
- Checking your API quota/balance

### Validation score won't improve beyond 8.5

This is normal for:
- **Cross-platform content** — 8.0+ is excellent when adapting voice across platforms
- **Complex content types** — Scripts and long-form are harder to perfect
- **Very distinctive voices** — Some creator styles are harder to clone precisely

Try:
- Adding more/better content samples to P1
- Adding a Voice Bible with specific phrases and patterns
- Using Opus model for P1 analysis

### Content generation seems generic

The #1 cause is **poor content samples**. Fix by:
- Using 25+ samples instead of 10
- Including the creator's most distinctive, personality-rich content
- Adding a Voice Bible that highlights unique phrases and patterns
- Using the Research feature to ground content in real facts
- Being more specific in the Topic field

### Cost is higher than expected

Check:
- How many auto-refinement rounds are running (visible in P4)
- Whether you're using Opus everywhere (switch to Sonnet/Haiku for P3/P4)
- Whether research context is very large (trim to 2–4 sources)
- Enable prompt caching by using Anthropic Direct

---

## Best Practices Summary

1. **Invest in P1** — Better samples = better everything downstream. Spend time here.
2. **Be specific in P2** — Detailed topics and notes produce dramatically better content.
3. **Use Research for factual content** — Web research prevents hallucination and adds credibility.
4. **Save your research** — Build a research library for each topic area.
5. **Let auto-refinement work** — The P3↔P4 loop usually reaches 9.0 in 2–3 rounds.
6. **Use per-step models** — Opus for P1, Sonnet for P2/P3, Haiku for P4.
7. **Reuse profiles** — Analyze once, generate unlimited content.
8. **Try cross-platform** — A strong YouTube profile can produce great LinkedIn posts.
9. **Track your costs** — Check the dashboard regularly to optimize spend.
10. **Use the kanban** — Move content through Draft → Review → Approved → Published.
