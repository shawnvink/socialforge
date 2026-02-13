# SocialForge Voice Bible Specification
## Two-Layer Voice Analysis System for Social Media Voice Cloning
### Version 1.0 // February 2026

---

## Overview

The SocialForge Voice Bible captures a creator's complete communicative identity across social media platforms. Unlike long-form writing analysis (which works from book-length manuscripts), social media voice analysis must extract signal from compressed, fragmented, platform-constrained content. A single tweet carries less raw data than a single paragraph in a book. The system compensates by analyzing volume (30-50 posts), diversity (multiple content types), and platform-specific behavioral patterns that have no equivalent in traditional writing.

The Voice Bible operates on two layers: Core Voice DNA (the creator's identity that persists across all platforms) and Platform Expression Profiles (how that identity adapts to each platform's constraints, norms, and audience expectations).

---

## Layer 1: Core Voice DNA (12 Dimensions)

These 12 dimensions capture the creator's fundamental communicative identity. They are measured across all available platforms, with scoring anchors recalibrated for social media samples where posts are shorter, more frequent, and more constrained than long-form writing.

### Dimension 1: Sentence Architecture

**What it measures:** How the creator constructs sentences. Average length, variation, fragment usage, front-loading vs. back-loading of key information.

**Social media calibration:** Measured per-post rather than per-paragraph. Short-form platforms (Twitter, TikTok captions) naturally compress sentence length; the score reflects variation within the platform's constraints, not raw length.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Uniform, no variation (SD < 2) | Every post uses identical sentence structure |
| 25 | Low variation (SD 2-4), rare fragments | Predictable rhythm, occasional short sentence |
| 50 | Moderate variation (SD 4-6), some fragments | Mix of long and short, purposeful fragments appear |
| 75 | Strong variation (SD 6-9), purposeful fragments | Dramatic rhythm shifts, fragments as signature |
| 100 | Extreme variation (SD 9+), fragments as primary tool | Sentence length wildly varies, fragments dominate |

**Evidence requirements:** Minimum 3 cited examples showing range. Note: on Twitter/X, a single-sentence tweet IS the architecture; measure across a thread for multi-sentence patterns.

### Dimension 2: Vocabulary Fingerprint

**What it measures:** Word choice patterns, reading level, pet words, jargon density, and platform-specific vocabulary including emoji vocabulary and platform slang.

**Social media calibration:** Adds emoji as vocabulary. Tracks platform slang adoption (e.g., "unhinged," "slay," "it's giving"). Pet words are easier to identify in short-form content because they appear at higher density.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Grade 4, fully casual, all contractions, heavy slang | Highly informal, meme-heavy, abbreviations |
| 25 | Grade 6-7, casual, frequent contractions, some slang | Conversational with slang sprinkled in |
| 50 | Grade 8-10, mixed formality, selective jargon | Professional but accessible, platform-aware |
| 75 | Grade 11-13, formal-leaning, rare contractions | Industry terminology, minimal slang |
| 100 | Grade 14+, fully formal, zero slang or contractions | Academic or highly technical register |

**Additional social media fields:**
- Emoji vocabulary: List of used emojis with frequency
- Platform slang adoption: Which platform-native terms the creator uses
- Hashtag vocabulary: Commonly used hashtags (style, not just topic)
- Abbreviation patterns: "w/" "b/c" "tbh" "imo" or always spelled out

### Dimension 3: Rhetorical Patterns

**What it measures:** How the creator structures arguments. Story-first vs. principle-first, analogy frequency, evidence preferences.

**Social media calibration:** In short-form, rhetorical patterns manifest as post-opening strategy. Does the creator lead with a claim, a question, a story, or data? This dimension captures the persuasion architecture that remains consistent even when compressed to 280 characters.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Pure narrative, no evidence or argument | Posts are all stories, no frameworks or claims |
| 25 | Story-dominant, light evidence | Opens with anecdote, minimal data |
| 50 | Balanced story/principle, mixed evidence | Alternates between narrative and analytical posts |
| 75 | Principle-dominant, frequent evidence | Leads with claims, supports with data/logic |
| 100 | Pure argumentation, rigorous logic | Posts are structured arguments, evidence-heavy |

### Dimension 4: Emotional Register

**What it measures:** The vulnerability-authority spectrum. How much emotional exposure the creator permits. Warmth vs. clinical detachment.

**Social media calibration:** Social media often amplifies emotional register. Creators may be more vulnerable on Instagram Stories than on LinkedIn. The core score captures the baseline; platform-specific modulation is tracked in Layer 2.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Fully clinical, zero vulnerability | All posts are informational, no personal revelation |
| 25 | Restrained, rare vulnerability | Occasional personal touch, mostly professional |
| 50 | Moderate warmth, selective vulnerability | Shares personal stories sometimes, controlled openness |
| 75 | Warm, frequent vulnerability | Regularly shares struggles, behind-the-scenes, emotions |
| 100 | Fully vulnerable, raw exposure | Unfiltered sharing, high emotional transparency |

### Dimension 5: Humor Profile

**What it measures:** Type, frequency, placement, and boundaries of humor.

**Social media calibration:** Humor is more visible on social media because post volume creates a larger sample. Track whether humor appears in captions, comments, stories, or only specific content types. Meme usage is a humor indicator with no book-writing equivalent.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Zero humor | No jokes, no memes, no playful language |
| 25 | Rare, dry | Occasional dry wit, self-deprecation once per 20 posts |
| 50 | Moderate, varied | Regular humor, mix of types, roughly 1 in 5 posts |
| 75 | Frequent, signature element | Humor in most posts, recognizable comedic voice |
| 100 | Humor-saturated, comedic identity | Primary identity is comedic; serious posts are the exception |

**Additional fields:**
- Humor types used: Sarcasm, self-deprecation, absurdist, observational, dark, wordplay, meme-based
- Meme usage: Original memes, shared memes, meme formats adapted, none
- Off-limits: Topics humor never touches

### Dimension 6: Confidence Patterns

**What it measures:** Hedging frequency, assertion strength, certainty language.

**Social media calibration:** Short-form content tends to amplify confidence (fewer words to hedge in). The score should reflect the creator's natural tendency, accounting for platform compression effects.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Maximum hedging, zero assertions | "I think maybe..." "This could possibly..." |
| 25 | Frequent hedging, rare claims | "In my experience..." with heavy qualification |
| 50 | Balanced hedging and assertion | Mix of confident claims and measured statements |
| 75 | Rare hedging, strong assertions | Declarative statements, occasional qualification |
| 100 | Zero hedging, absolute declarations | Bold claims, no qualifiers, contrarian confidence |

### Dimension 7: Storytelling DNA

**What it measures:** Story length, scene vs. summary, dialogue comfort. Adapted for micro-stories (1-3 sentences, the most common social media story form).

**Social media calibration:** The 50-anchor is recalibrated to micro-stories. A creator who tells 1-3 sentence stories in posts sits at the social media midpoint, not the book-writing midpoint.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | No stories, pure information | Posts are all tips, data, opinions; no narrative |
| 25 | Brief references to experiences | "I once had a client who..." without scene detail |
| 50 | Micro-stories (1-3 sentences) with scene elements | Short anecdotes with sensory detail or dialogue |
| 75 | Extended social media stories (threads, carousels) | Multi-post narratives, character development |
| 100 | Story-native, cinematic social content | Every post is a narrative, video storytelling dominant |

### Dimension 8: Reader Relationship

**What it measures:** Direct address, formality, the implicit creator-audience dynamic (peer, teacher, mentor, entertainer, authority).

**Social media calibration:** Social media inherently increases direct address ("you" language) compared to book writing. The score calibrates against social media norms, not book norms.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Zero audience acknowledgment | Posts read as broadcast, no community interaction |
| 25 | Rare address, formal authority | Occasional engagement, maintains distance |
| 50 | Moderate "you," teacher stance | Regular direct address, instructional dynamic |
| 75 | Frequent address, mentor/guide | Conversational, interactive, community-oriented |
| 100 | Constant "you/we," peer/friend | Every post feels like a conversation with a friend |

### Dimension 9: Structural Personality

**What it measures:** How the creator uses structure as a communicative tool. Line breaks, lists, formatting, emoji-as-headers, carousel slides, paragraph length.

**Social media calibration:** Social media introduces formatting elements that don't exist in books: emoji as section markers, line breaks for emphasis (the "LinkedIn line break" style), carousel slide structure, and thread numbering.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Dense blocks, no formatting | Wall-of-text posts, no line breaks or structure |
| 25 | Minimal formatting, occasional breaks | Some paragraph breaks, rare lists |
| 50 | Moderate structure, some visual elements | Regular line breaks, occasional emoji markers |
| 75 | Heavy formatting, visual structure dominant | Frequent lists, emoji headers, structured templates |
| 100 | Ultra-structured, format as content | Every post follows a visual template, heavy formatting |

### Dimension 10: Contrarian Disposition

**What it measures:** How frequently and strongly the creator challenges conventional wisdom or popular opinion.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Never challenges | Shares consensus views, avoids controversy |
| 25 | Mild, rare, qualified | Occasional "unpopular opinion" with heavy caveats |
| 50 | Periodic, moderate, fair | Regular contrarian takes, acknowledges other side |
| 75 | Frequent, strong, direct | Known for hot takes, challenges industry norms |
| 100 | Combative, constant, provocative | Primary identity is contrarian, seeks conflict |

### Dimension 11: Punctuation Personality

**What it measures:** Punctuation patterns including social-media-specific uses: ALL CAPS for emphasis, excessive periods (the "And I mean... really"), emoji-as-punctuation, and intentional lack of punctuation.

**Social media calibration:** Adds tracking for ALL CAPS frequency, ellipsis chains, emoji-as-punctuation (using a clapping emoji between words), strategic lack of capitalization, and intentional run-on style.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Periods and commas only | Standard punctuation, no stylistic variation |
| 25 | Minimal variety, occasional exclamation | Mostly standard with light emphasis markers |
| 50 | Moderate variety, some stylistic use | Mix of standard and expressive punctuation |
| 75 | Frequent stylistic punctuation | ALL CAPS, ellipsis, emoji-as-punctuation regular |
| 100 | Punctuation as primary expressive tool | Heavily stylized, punctuation defines the voice |

**Additional social media fields:**
- ALL CAPS frequency: Per 10 posts
- Ellipsis usage: Trailing "..." frequency and purpose
- Emoji-as-punctuation: Specific emojis used as sentence-enders
- Intentional lowercase: Whether the creator deliberately avoids capitalization
- Exclamation density: Per post average

### Dimension 12: Intellectual Personality

**What it measures:** Abstract vs. concrete thinking, theoretical vs. practical orientation, complexity preference.

| Score | Anchor | Social Media Indicators |
|-------|--------|------------------------|
| 0 | Fully concrete, purely practical | All tips, how-tos, action items |
| 25 | Mostly concrete, practice-focused | Occasional why, mostly what and how |
| 50 | Mixed abstract/concrete, balanced | Alternates between theory posts and practical posts |
| 75 | Abstract-leaning, theoretical | Thinks publicly, explores ideas, frameworks-heavy |
| 100 | Fully abstract, maximum complexity | Philosophical, conceptual, academic-style posts |

---

## Layer 2: Platform Expression Profile (6 Dimensions)

These 6 dimensions capture how a creator's core voice adapts to a specific platform. Each platform the creator is active on gets its own Platform Expression Profile. The same creator will have different scores on different platforms; that variance is the signal, not noise.

### Dimension P1: Format Signature

**What it captures:** Preferred content formats, average length, reusable structure templates.

**Measured values:**
- Primary format(s): e.g., carousels on Instagram, threads on Twitter, long-form on LinkedIn
- Average post length: Word count or duration (for video)
- Structure templates: Recurring structural patterns (e.g., "Hook > 3 points > CTA" or "Story > lesson > question")
- Format distribution: Percentage breakdown of content types used
- Length range: Shortest and longest posts (mean +/- 1.5 SD defines the natural range)

### Dimension P2: Hook Architecture

**What it captures:** First-line patterns, thumbnail/title patterns, attention-capture strategies.

**Measured values:**
- Hook types used: Bold claim, question, statistic, story opening, controversy, "you" address, list promise
- Hook type distribution: Which types appear most frequently
- First-line word count: Average and range
- Pattern interrupts: Unconventional openings that break scrolling patterns
- Thumbnail/title patterns (YouTube, Blog): Visual and textual hook strategies
- Effective hooks: Identify the top 5 highest-engagement hooks and their structural patterns

### Dimension P3: Engagement Choreography

**What it captures:** CTA style, question types, response patterns, community management approach.

**Measured values:**
- CTA frequency: Percentage of posts with explicit calls to action
- CTA types: Save, share, comment, follow, link click, DM, bookmark
- CTA placement: End of post, mid-post, embedded in narrative, or standalone
- Question style: Open-ended, either/or, rhetorical, poll-based
- Reply patterns: How the creator responds to comments (length, tone, frequency)
- Community signals: Inside jokes, recurring references, audience nicknames

### Dimension P4: Visual-Text Ratio

**What it captures:** Emoji density and placement, formatting-as-communication (line breaks, caps, bold), visual element reliance.

**Measured values:**
- Emoji density: Per post average, per sentence average
- Emoji placement: Opening, closing, inline, as bullet markers, as section breaks
- Emoji vocabulary size: Number of distinct emojis used
- Line break frequency: Average line breaks per post
- ALL CAPS usage: Frequency and purpose (emphasis, humor, frustration)
- Bold/italic usage: On platforms that support it
- Image/video dependency: How much meaning is carried by visual vs. text

### Dimension P5: Temporal Patterns

**What it captures:** Posting frequency, timing, content mix rotation, series/themes.

**Measured values:**
- Posting frequency: Posts per day/week
- Posting times: When the creator typically posts
- Content rotation: How content types cycle (e.g., Monday motivation, Wednesday tip, Friday story)
- Series identification: Recurring series or themes
- Seasonal patterns: Content that varies by time of year, events, or cultural moments
- Gap patterns: Typical gaps between posts, longest observed gap

### Dimension P6: Platform Vernacular

**What it captures:** Hashtag strategy, @mentions, trending engagement, platform feature usage.

**Measured values:**
- Hashtag count: Average per post, range
- Hashtag style: Branded, community, trending, niche, ironic
- Hashtag placement: Inline, end of post, first comment (Instagram)
- @mention patterns: Frequency, who they mention (peers, brands, followers)
- Platform feature adoption: Stories, Reels, Spaces, Lives, Polls, Duets, Stitches
- Trending engagement: Does the creator participate in trends? How quickly? How faithfully vs. adapted?
- Cross-platform references: Does the creator reference other platforms?

---

## Voice Bible Output Format

### Core Voice DNA Profile (~1,500 tokens)

```
SOCIAL VOICE DNA: [Creator Name]
Generated: [Date] | Platforms Analyzed: [list]
Posts Analyzed: [N] across [N] platforms, [total word count] words
Overall Confidence: [score]/100

SENTENCE ARCHITECTURE: [Score]/100. [2-sentence description].
  Target SD: [value]. Fragment frequency: [per 10 posts].

VOCABULARY: [Score]/100. Reading level: [grade equivalent].
  Pet words: [list]. Emoji vocabulary: [top 10 with frequency].
  Platform slang: [adopted terms]. Banned words: [never-used terms].

RHETORICAL: [Score]/100. [Story-first/Principle-first/Balanced].
  Opening preference: [type]. Evidence style: [type].

EMOTIONAL: [Score]/100. Vulnerability: [high/medium/low].
  Warmth: [high/medium/low]. Authority source: [description].

HUMOR: [Score]/100. Type: [primary]. Frequency: [per 10 posts].
  Meme usage: [description]. Off-limits: [topics].

CONFIDENCE: [Score]/100. Hedging frequency: [description].
  Assertion style: [description]. Bold claims: [frequency].

STORYTELLING: [Score]/100. Story type: [micro/medium/extended].
  Detail density: [high/medium/low]. Dialogue: [uses/avoids].

READER RELATIONSHIP: [Score]/100. Address: [direct/indirect/none].
  Stance: [peer/mentor/teacher/authority/entertainer].
  "You" frequency: [per 10 posts].

STRUCTURAL: [Score]/100. Format preference: [description].
  Line breaks: [heavy/moderate/minimal]. Lists: [frequency].

CONTRARIAN: [Score]/100. Frequency: [per 10 posts].
  Strength: [fierce/moderate/mild]. Targets: [what they challenge].

PUNCTUATION: [Score]/100. ALL CAPS: [frequency].
  Emoji-as-punctuation: [description]. Exclamation density: [per post].

INTELLECTUAL: [Score]/100. Abstract/Concrete: [lean].
  Theory/Practice: [lean]. Complexity: [high/medium/low].

DO:
1. [Specific, testable instruction]
2. [Specific, testable instruction]
3. [Specific, testable instruction]
4. [Specific, testable instruction]
5. [Specific, testable instruction]

NEVER:
1. [Specific, testable prohibition]
2. [Specific, testable prohibition]
3. [Specific, testable prohibition]
4. [Specific, testable prohibition]
5. [Specific, testable prohibition]

VOICE ANCHORS (from actual posts):
1. "[Representative post excerpt]"
2. "[Representative post excerpt]"
3. "[Representative post excerpt]"
```

### Platform Expression Profile (~500 tokens per platform)

```
PLATFORM PROFILE: [Creator Name] on [Platform]
Generated: [Date] | Posts Analyzed: [N]

FORMAT SIGNATURE: [Primary formats]. Avg length: [value].
  Templates: [recurring structures]. Range: [min]-[max] words.

HOOK ARCHITECTURE: [Primary hook type]. Distribution: [breakdown].
  First-line avg: [words]. Top hooks: [list top 3 patterns].

ENGAGEMENT CHOREOGRAPHY: CTA frequency: [%]. Style: [description].
  Question type: [preferred]. Reply pattern: [description].

VISUAL-TEXT RATIO: Emoji density: [per post]. Placement: [pattern].
  Line breaks: [per post avg]. ALL CAPS: [frequency].

TEMPORAL PATTERNS: Frequency: [posts/week]. Timing: [when].
  Content rotation: [pattern]. Series: [if any].

PLATFORM VERNACULAR: Hashtags: [avg count], [style].
  Features used: [list]. Trending engagement: [description].
```

---

## Cross-Platform Calibration Rules

When a creator's voice differs between platforms, the system must distinguish between **legitimate platform adaptation** (the creator correctly adjusting for the medium) and **voice inconsistency** (the creator losing their identity).

**Fixed Core (must remain consistent):**
- Dimensions 3 (Rhetorical), 5 (Humor type, not frequency), 10 (Contrarian), 12 (Intellectual)
- DO and NEVER rules
- Pet words and vocabulary fingerprint
- Core emotional register baseline

**Legitimate Platform Deltas (expected to vary):**
- Dimension 1 (Sentence Architecture): Shorter on Twitter, longer on LinkedIn
- Dimension 2 (Vocabulary): More casual on TikTok, more formal on LinkedIn
- Dimension 4 (Emotional Register): More vulnerable on Instagram Stories, more guarded on LinkedIn
- Dimension 8 (Reader Relationship): More peer-like on Twitter, more teacher-like on YouTube
- Dimension 9 (Structural Personality): Platform-dictated formatting differences
- Dimension 11 (Punctuation): Platform norms influence expression

**Drift Threshold:**
- Fixed Core dimensions: Flag if variance exceeds 10 points between platforms
- Legitimate Delta dimensions: Flag only if variance exceeds 25 points (beyond platform norms)
- Any dimension: Auto-investigate if variance exceeds 30 points

---

## Minimum Sample Requirements

| Scenario | Minimum Posts | Confidence Cap | Notes |
|----------|--------------|---------------|-------|
| Full profile (single platform) | 30-50 posts | None | Optimal |
| Moderate profile (single platform) | 15-29 posts | 70 | Flag as "MODERATE CONFIDENCE" |
| Preliminary profile (single platform) | 8-14 posts | 50 | Flag as "PRELIMINARY" |
| Insufficient | Fewer than 8 posts | N/A | Cannot profile; request more samples |
| Cross-platform profile | 15+ per platform, 3+ platforms | None | Optimal for cross-platform analysis |

**Sample diversity requirements:**
- Must include at least 3 different content types per platform (e.g., not all carousels)
- Must span at least 30 days of posting history
- Must include both high-engagement and typical-engagement posts
- If available, include replies/comments to capture conversational voice

---

## Voice Evolution Tracking

Social media voice evolves faster than book-writing voice. A creator's LinkedIn tone may shift meaningfully in 6 months. The system supports recalibration:

1. Flag any dimension where new samples shift the score by more than 8 points
2. Distinguish evolution (genuine voice change) from context (different topic/mood)
3. Weight recent posts more heavily: last 30 days = 0.5, 30-90 days = 0.3, 90+ days = 0.2
4. Maintain version history of Voice Bibles for longitudinal analysis

---

**END OF VOICE BIBLE SPECIFICATION v1.0**
