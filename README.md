# SocialForge — AI Social Media Voice Cloning System
## February 2026

---

## What This Is

SocialForge is a complete system for creating AI-powered social media content that's indistinguishable from a creator's real posts. It analyzes any creator's existing content and generates new content that passes the Byline Test: 7 out of 10 followers cannot tell the difference.

This is the social media counterpart to GhostForge (which does the same for book-length manuscripts).

### Two Components in This Repository:

**1. Prompt Library (v2.0)** — 47 Professional Prompts
- 3 core prompts + 44 platform-specific prompts (4 per platform × 11 platforms)
- Standalone system prompts for any LLM (Claude, GPT-4, etc.)
- Self-contained with full SAP (Social Authenticity Protocol) enforcement
- **NEW:** Genesis Neuro-Linguistic Headline Architecture integrated across all platforms
- Each prompt is a complete .md file - copy and use directly

**2. Dashboard (v2.0)** — Production-Ready HTML Tool
- Single-file HTML application (`dashboard-final.html`)
- Automated P1→P2→P3→P4 workflow
- Real voice analysis (20+ metrics, zero fake data)
- World-class prompt generation for LLM use
- Kanban board + export system
- **[See DASHBOARD_README.md for full documentation](DASHBOARD_README.md)**

---

## Quick Start

**Option A: Use the Dashboard (Recommended)**
1. Open `dashboard-final.html` in your browser
2. Follow the P1→P2→P3→P4 workflow
3. Get production-ready content with validation

**Option B: Use Prompts Directly**
1. Navigate to platform folder (e.g., `instagram/`)
2. Copy prompt file (e.g., `P2_instagram_generator.md`)
3. Paste into Claude or GPT-4
4. Follow prompt instructions

---

## Architecture

### 47 Total Prompts: 3 Core + 44 Platform-Specific

**Core Prompts** (shared across all platforms):

| # | Prompt | File | Purpose |
|---|--------|------|---------|
| C1 | Social Voice Analyzer | `core/C1_social_voice_analyzer.md` | Analyze 30-50 posts → Core Voice DNA Profile (12 dimensions) + Platform Expression Profiles (6 dimensions per platform) |
| C2 | Content Strategy Architect | `core/C2_content_strategy_architect.md` | Map topic clusters, content pillars, posting patterns, audience engagement patterns |
| C3 | Cross-Platform Voice Harmonizer | `core/C3_cross_platform_harmonizer.md` | Compare platform profiles, identify fixed core vs. legitimate platform deltas, produce calibration rules |

**Per-Platform Prompts** (4 per platform, 11 platforms):

| # | Prompt | Purpose |
|---|--------|---------|
| P1 | Platform Analyzer | Deep analysis of 20-50 posts on a specific platform → Platform Expression Profile (6 dimensions) |
| P2 | Content Generator | Main engine: Voice Bible + Platform Profile + topic → indistinguishable content |
| P3 | Content Optimizer | Algorithm alignment, hashtag/keyword optimization, engagement potential scoring |
| P4 | Authenticity Validator | The "indistinguishable" test: scores voice fidelity, flags AI tells, enforces SAP |

---

## Supported Platforms (11)

| # | Platform | Folder | Content Formats |
|---|----------|--------|-----------------|
| 1 | YouTube | `youtube/` | Long-form scripts, Shorts scripts, titles, descriptions, community posts, thumbnail concepts |
| 2 | Instagram | `instagram/` | Feed captions, carousels (slide-by-slide), Reels scripts, Stories sequences |
| 3 | LinkedIn | `linkedin/` | Text posts, articles, newsletters, strategic comments, profile copy |
| 4 | Twitter/X | `twitter/` | Single tweets, threads, quote tweets, replies |
| 5 | TikTok | `tiktok/` | Short-form video scripts with hooks/timing, captions, series planning |
| 6 | Newsletter | `newsletter/` | Full issues, subject lines, welcome sequences, CTAs (educational/content-focused) |
| 7 | **Email Copywriting** | `email-copywriting/` | **Sales emails, cold outreach, welcome sequences, cart abandonment, product launches (conversion-focused)** |
| 8 | Podcast | `podcast/` | Episode scripts (solo + interview), show notes, guest questions |
| 9 | Blog/SEO | `blog/` | Full articles, meta descriptions, headlines, content briefs |
| 10 | Threads | `threads/` | Posts, conversation chains |
| 11 | Facebook | `facebook/` | Personal posts, page posts, group content, event descriptions |

---

## How to Use

### Step 1: Analyze the Creator's Voice

1. Collect 30-50 posts from the creator across their active platforms
2. Run **C1 (Social Voice Analyzer)** with the posts as input
3. Output: a Core Voice DNA Profile (12 dimensions) and a compressed Voice Bible

**For deeper platform-specific analysis:**
4. Run the relevant **P1 (Platform Analyzer)** for each platform the creator uses
5. Output: Platform Expression Profiles with 6 additional dimensions per platform

**For multi-platform creators:**
6. Run **C3 (Cross-Platform Harmonizer)** to identify what stays constant vs. what adapts
7. Output: Calibration rules for maintaining voice consistency across platforms

### Step 2: Understand Their Strategy (Optional)

8. Run **C2 (Content Strategy Architect)** with posts + engagement metrics
9. Output: Content strategy profile with topic clusters, pillars, and patterns

### Step 3: Generate Content

10. Run the relevant **P2 (Content Generator)** with:
    - The Voice Bible (from C1)
    - The Platform Expression Profile (from P1)
    - A topic or content brief
11. Output: Platform-native content indistinguishable from the creator

### Step 4: Optimize (Optional)

12. Run the relevant **P3 (Content Optimizer)** on the generated content
13. Output: Optimized content with algorithm alignment and engagement recommendations

### Step 5: Validate

14. Run the relevant **P4 (Authenticity Validator)** on the content
15. Output: Authenticity scores across 5 tests, AI tell flags, fix recommendations
16. Target: composite score of 8.5+ on the 1-10 scale

---

## Voice Analysis System (Two-Layer Model)

### Layer 1: Core Voice DNA (12 Dimensions)

The creator's fundamental communicative identity, measured across all platforms:

| # | Dimension | What It Captures |
|---|-----------|-----------------|
| 1 | Sentence Architecture | Length variation, fragments, front/back loading (measured per-post) |
| 2 | Vocabulary Fingerprint | Reading level, pet words, emoji vocabulary, platform slang |
| 3 | Rhetorical Patterns | Story-first vs. principle-first, analogy frequency, evidence style |
| 4 | Emotional Register | Vulnerability-authority spectrum, warmth-clinical balance |
| 5 | Humor Profile | Type, frequency, placement, meme usage, off-limits topics |
| 6 | Confidence Patterns | Hedging frequency, assertion strength, bold claims |
| 7 | Storytelling DNA | Micro-stories (1-3 sentences), medium stories, extended narratives |
| 8 | Reader Relationship | Direct address, formality, peer/teacher/mentor/entertainer stance |
| 9 | Structural Personality | Line breaks, emoji-as-headers, lists, formatting patterns |
| 10 | Contrarian Disposition | Challenge frequency, strength, targets |
| 11 | Punctuation Personality | ALL CAPS, excessive periods, emoji-as-punctuation, stylistic choices |
| 12 | Intellectual Personality | Abstract vs. concrete, theoretical vs. practical |

Each dimension is scored 0-100 with calibrated anchors specific to social media content.

### Layer 2: Platform Expression Profile (6 Dimensions)

How the creator's voice adapts to each specific platform:

| # | Dimension | What It Captures |
|---|-----------|-----------------|
| P1 | Format Signature | Preferred formats, average length, reusable structure templates |
| P2 | Hook Architecture | First-line patterns, thumbnail/title patterns, pattern interrupts |
| P3 | Engagement Choreography | CTA style, question types, response patterns, community management |
| P4 | Visual-Text Ratio | Emoji density + placement, formatting-as-communication |
| P5 | Temporal Patterns | Posting frequency, timing, content mix rotation, series/themes |
| P6 | Platform Vernacular | Hashtag strategy, @mentions, trending engagement, feature usage |

Full specification: `VOICE_BIBLE_SPECIFICATION.md`

---

## Social Authenticity Protocol (SAP)

SAP is the anti-detection standard that ensures generated content is indistinguishable from human-created content. It evolved from GhostForge's Human Authenticity Protocol (HAP) with social-media-specific additions.

### Three Levels of Control

**Level 1: Vocabulary Control**
- 55 banned words (zero tolerance)
- 40 banned phrases (zero tolerance)
- Emoji vocabulary matching (only use emojis the creator actually uses)

**Level 2: Structural Variation**
- Post length within creator's range (mean +/- 1.5 SD)
- No two consecutive posts with same hook type
- Sentence rhythm matching
- Structure template rotation

**Level 3: Behavioral Authenticity**
- Natural variance: 1 in 5 posts must be "lower effort" (matching real human behavior)
- Deliberate imperfection injection
- Content mix matching
- Negative space enforcement (respect what the creator NEVER does)

### The 5 Indistinguishability Tests

Every piece of generated content must pass all 5 (score 8+ each):

| Test | Question | Pass Threshold |
|------|----------|---------------|
| Byline Test | Would 7/10 followers identify this as the creator's work? | 8/10 |
| Negative Space Test | Does it respect what the creator NEVER does? | 8/10 |
| Frequency Test | Do distinctive patterns appear at observed rates (not exactly)? | 8/10 |
| Topic Boundary Test | Does it stay within established territory? | 8/10 |
| Register Consistency Test | Does it match the creator's register for THIS platform? | 8/10 |

**Target composite score: 8.5+**

Full specification: `SAP_SPECIFICATION.md`

---

## 🧠 Genesis Neuro-Linguistic Headline Architecture (NEW in v2.0)

**The science of creating headlines that hijack brain chemistry while maintaining voice authenticity.**

Integrated across **all 11 platforms**, Genesis is a neurochemically-optimized headline framework that triggers specific brain chemicals in sequence to maximize engagement while sounding exactly like the creator.

### The Neurochemical Trigger Stack

Every optimized headline/title/subject line triggers four brain chemicals in this exact order:

1. **Dopamine** (Reward Anticipation) → "I might get something valuable"
2. **Norepinephrine** (Attention/Arousal) → "This could be important"
3. **Cortisol** (Stress/Urgency) → "I need to act on this NOW"
4. **Oxytocin** (Trust/Connection) → "This person gets me"

**Example:** "The $3 Fix That Saved My Business (Before Friday's Deadline)"
- Dopamine: "$3 Fix" = low-cost solution
- Norepinephrine: "Saved My Business" = high stakes
- Cortisol: "Before Friday's Deadline" = urgency
- Oxytocin: "My Business" = personal, relatable

### 8 Core Techniques

| Technique | Description | Example |
|-----------|-------------|---------|
| **Identity Hijacking** | Hyper-specific identity markers (not generic) | "The founder drowning in meetings" vs. "entrepreneurs" |
| **Credibility Osmosis** | Borrow authority from bigger entities | "The Apple Strategy Startups Are Using" |
| **Quantum Entanglement** | [Familiar A] + [Unexpected] + [Valuable B] + [Constraint] | "The Janitor's Secret That Built a $10M Company" |
| **Temporal Displacement** | Manipulate time perception | "The 1987 Strategy Crushing It in 2026" |
| **Memetic Stickiness** | Cognitively sticky patterns | "The Missing Piece Every Successful Founder Has" |
| **Pattern Breaks** | Unexpected reversals | "Dear Struggling Founders: Stop Trying to Grow" |
| **Metacognitive Amplifiers** | Make reader aware of thinking | "The Thought That Separates $10M Founders from Broke Ones" |
| **Identity Transformation** | Focus on becoming (not having) | "How to Become the Creator Everyone Wants to Follow" |

### Power Word Categories

Genesis tracks five categories of neurologically-optimized words:

- **Scarcity Inducers:** Last, Final, Deadline, Closing, Ending, Gone
- **Curiosity Amplifiers:** Secret, Hidden, Buried, Exposed, Revealed, Underground
- **Authority Borrowers:** Insider, Executive, Expert, Professional, Elite, Master
- **Tribal Identifiers:** Smart, Savvy, Successful, Elite, Advanced, Winning
- **Exclusivity Markers:** Private, Exclusive, Members-Only, Inner Circle, VIP

### Platform-Specific Adaptations

Genesis techniques are adapted to each platform's context:

- **YouTube:** 50-60 char titles optimized for CTR + thumbnail coordination
- **Email Copywriting:** Subject lines for open rates (sales-focused, 25-30 chars)
- **Newsletter:** Subject lines for intimacy (educational-focused, curiosity-driven)
- **Blog:** Headlines balancing SEO + click-through (~60 chars for SERP)
- **LinkedIn:** Professional tone, authority-building openers
- **Twitter:** 280 char compression, instant impact hooks
- **TikTok:** 1-3 second pattern interrupts, scroll-stopping hooks
- **Instagram:** Visual-first hooks coordinated with imagery
- **Podcast:** Audio app display (~60 chars), searchable titles
- **Threads:** Conversational engagement starters (500 char limit)
- **Facebook:** Personal, community-building openers

### Voice-First Genesis: The Critical Safeguard

**Genesis techniques are ONLY activated when appropriate for the creator's voice.**

Every platform's P1 Analyzer assigns a **Genesis Usage Score (0-10)**:
- **0-4:** Creator uses simple/casual headlines → Genesis disabled
- **5-7:** Creator uses moderate optimization → Genesis techniques adapted
- **8-10:** Creator is a headline master → Full Genesis activation

**Golden Rule:** Voice authenticity ALWAYS takes priority over optimization. If a Genesis technique breaks voice, it's rejected.

### What Makes This Different

Most headline frameworks are one-size-fits-all. Genesis is:
1. **Voice-Adaptive:** Techniques scale to creator's natural style
2. **Neurochemically-Grounded:** Based on dopamine/norepinephrine/cortisol/oxytocin triggers
3. **Platform-Contextualized:** Different tactics for YouTube vs. Email vs. LinkedIn
4. **SAP-Compliant:** All techniques avoid AI detection and banned vocabulary

**Result:** Headlines that convert like world-class copywriting while sounding exactly like the creator wrote them.

---

## Prompt Architecture (10-Section Standard)

Every prompt in this library follows a standardized 10-section structure:

| # | Section | Purpose |
|---|---------|---------|
| 1 | System Identity & Activation | Role definition, domain boundaries, activation conditions |
| 2 | Mission & Success Criteria | Measurable success criteria with thresholds |
| 3 | Input Specification | Required inputs with validation rules and fallback defaults |
| 4 | Chain-of-Thought Reasoning Protocol | THINK > ANALYZE > PLAN > EXECUTE > VERIFY cycle |
| 5 | Few-Shot Examples | 2-3 concrete examples (gold standard + common mistake) |
| 6 | Operational Process | Numbered steps with decision points |
| 7 | Social Authenticity Protocol (SAP) | Banned words/phrases, structural rules, authenticity enforcement |
| 8 | Quality Gates & Self-Evaluation | Quantified 1-10 rubric, auto-fail conditions, checklists |
| 9 | Structured Output Format | Exact output schemas with field types and validation |
| 10 | Error Recovery & Edge Cases | Top failure modes, graceful degradation, edge case handling |

This is adapted from GhostForge's 12-section architecture. Sections 11 (Cross-Module Integration) and 12 (Voice Bible Compliance) were merged into Sections 7 and 10 since SocialForge is a prompt library, not a software pipeline.

---

## Directory Structure

```
socialforge/
├── README.md                           ← You are here
├── VOICE_BIBLE_SPECIFICATION.md        ← 12+6 dimension voice system spec
├── SAP_SPECIFICATION.md                ← Social Authenticity Protocol spec
├── core/
│   ├── C1_social_voice_analyzer.md     ← Keystone: voice forensics
│   ├── C2_content_strategy_architect.md
│   └── C3_cross_platform_harmonizer.md
├── youtube/
│   ├── P1_youtube_analyzer.md
│   ├── P2_youtube_generator.md
│   ├── P3_youtube_optimizer.md
│   └── P4_youtube_validator.md
├── instagram/
│   ├── P1_instagram_analyzer.md
│   ├── P2_instagram_generator.md
│   ├── P3_instagram_optimizer.md
│   └── P4_instagram_validator.md
├── linkedin/
│   ├── P1_linkedin_analyzer.md
│   ├── P2_linkedin_generator.md
│   ├── P3_linkedin_optimizer.md
│   └── P4_linkedin_validator.md
├── twitter/
│   ├── P1_twitter_analyzer.md
│   ├── P2_twitter_generator.md
│   ├── P3_twitter_optimizer.md
│   └── P4_twitter_validator.md
├── tiktok/
│   ├── P1_tiktok_analyzer.md
│   ├── P2_tiktok_generator.md
│   ├── P3_tiktok_optimizer.md
│   └── P4_tiktok_validator.md
├── newsletter/
│   ├── P1_newsletter_analyzer.md
│   ├── P2_newsletter_generator.md
│   ├── P3_newsletter_optimizer.md
│   └── P4_newsletter_validator.md
├── podcast/
│   ├── P1_podcast_analyzer.md
│   ├── P2_podcast_generator.md
│   ├── P3_podcast_optimizer.md
│   └── P4_podcast_validator.md
├── blog/
│   ├── P1_blog_analyzer.md
│   ├── P2_blog_generator.md
│   ├── P3_blog_optimizer.md
│   └── P4_blog_validator.md
├── threads/
│   ├── P1_threads_analyzer.md
│   ├── P2_threads_generator.md
│   ├── P3_threads_optimizer.md
│   └── P4_threads_validator.md
└── facebook/
    ├── P1_facebook_analyzer.md
    ├── P2_facebook_generator.md
    ├── P3_facebook_optimizer.md
    └── P4_facebook_validator.md
```

**46 files total:** 43 prompts + README + 2 specification documents

---

## Workflow Patterns

### Single Platform (fastest)

```
Creator posts (20-50) → C1 Voice Analyzer → P1 Platform Analyzer
                                                      ↓
Topic + Voice Bible + Platform Profile → P2 Generator → P3 Optimizer → P4 Validator
```

### Multi-Platform (comprehensive)

```
Creator posts (30-50 across platforms) → C1 Voice Analyzer
                                              ↓
                                    C3 Cross-Platform Harmonizer
                                              ↓
                              Calibration Rules per platform
                                              ↓
                    ┌──────────┬──────────┬──────────┐
                    ↓          ↓          ↓          ↓
              P2 LinkedIn  P2 Twitter  P2 Instagram  ...
                    ↓          ↓          ↓          ↓
              P3 Optimize  P3 Optimize P3 Optimize   ...
                    ↓          ↓          ↓          ↓
              P4 Validate  P4 Validate P4 Validate   ...
```

### Content Strategy (with strategy layer)

```
Posts + Engagement Data → C1 Voice Analyzer + C2 Strategy Architect
                                    ↓                    ↓
                              Voice Bible        Strategy Profile
                                    ↓                    ↓
                          P1 Platform Analyzers ←── Strategy informs
                                    ↓                topic selection
                          P2 Content Generators
```

---

## Verification Protocol

**How to test each prompt:**

1. Feed it 20-50 real posts from a recognizable creator on that platform
2. Run the Voice Analyzer → verify the profile captures what makes that creator distinctive
3. Generate 5 pieces of content → compare side-by-side with the creator's actual posts
4. Run the Authenticity Validator → should score 8.5+ composite on all 5 tests
5. Have someone familiar with the creator try to distinguish generated from real (the Byline Test)

**Success metric:** Generated content passes the Byline Test (7/10 followers cannot distinguish it from real) across all 10 platforms.

---

## Relationship to GhostForge

SocialForge inherits foundational architecture from GhostForge's prompt library (v2.0):

| Inherited | Adapted |
|-----------|---------|
| 12-dimension Voice Bible system | Scoring anchors recalibrated for social media samples |
| Human Authenticity Protocol (HAP) | Evolved into Social Authenticity Protocol (SAP) with 10 additional banned words, 11 additional banned phrases, and behavioral authenticity rules |
| Chain-of-Thought reasoning patterns | Same THINK > ANALYZE > PLAN > EXECUTE > VERIFY cycle |
| Few-shot example approach | Platform-native examples instead of book-length examples |
| 12-section prompt architecture | Condensed to 10-section (merged cross-module integration and voice compliance) |
| Quality gate system | Adapted with 5 Indistinguishability Tests replacing manuscript-level quality cascade |

**SocialForge is a separate product.** It shares DNA with GhostForge but operates independently. No GhostForge modules are required as prerequisites.

---

## Statistics

| Metric | Value |
|--------|-------|
| Total prompt files | 43 |
| Specification documents | 2 |
| Platforms covered | 10 |
| Core prompts | 3 |
| Platform-specific prompts | 40 (4 per platform) |
| Voice dimensions (core) | 12 |
| Platform expression dimensions | 6 |
| Indistinguishability tests | 5 |
| Banned vocabulary words | 55 |
| Banned phrases | 40 |

---

## Usage Notes

### Each prompt is self-contained
Copy the entire file and use it as a system prompt. Everything needed is included within the prompt itself.

### Prompts work independently or as a system
You can use a single P2 generator with just a Voice Bible, or run the full analysis pipeline for maximum fidelity.

### The Voice Bible is the critical artifact
C1 (Social Voice Analyzer) produces the Voice Bible. Every other prompt in the system consumes it. Invest time in getting the Voice Bible right; everything downstream depends on its accuracy.

### Quality scales with input quality
More posts (closer to 50) produce better Voice Bibles. Posts spanning diverse content types produce more complete profiles. Posts with engagement data enable the strategy prompts to identify what works.

### Platform-specific prompts are platform-native
Each platform's prompts are written by specialists who understand that platform's culture, algorithm, norms, and audience expectations. A LinkedIn prompt and a TikTok prompt solve the same problem (voice cloning) in fundamentally different ways.

---

## Repository Contents

**Prompt Library (v1.0)**
- System: SocialForge AI Social Media Voice Cloning Prompt Library
- Architecture: 10-Section Universal Prompt Standard
- Created: February 10, 2026
- Files: 43 prompts (.md files) + 2 specifications

**Dashboard (v2.0)**
- System: SocialForge Production Dashboard
- Type: Single-file HTML application (zero dependencies)
- Released: February 13, 2026
- Status: Production-ready, zero fake data
- Documentation: See [DASHBOARD_README.md](DASHBOARD_README.md)

**Last Updated:** February 13, 2026
