/**
 * Cross-Platform Voice Adaptation
 *
 * When a profile from one platform is used to generate content for another,
 * this module injects bridging context into user prompts so the LLM preserves
 * the creator's voice DNA while adapting to the target platform's conventions.
 */

type PlatformCharacteristics = {
  name: string;
  structure: string;
  formatting: string;
  length: string;
  engagement: string;
  tone: string;
};

const PLATFORM_MAP: Record<string, PlatformCharacteristics> = {
  youtube: {
    name: "YouTube",
    structure: "Hook (first 30s), story arc with retention loops, strong CTA at end and mid-roll points",
    formatting: "Spoken word scripts with [B-ROLL], [CUT TO], visual cues; chapters/timestamps for descriptions",
    length: "Scripts: 1500-3000 words (10-20 min). Descriptions: 200-500 words. Titles: 60 chars max",
    engagement: "Subscribe + bell CTA, comment questions, community tab teasers, end screen suggestions",
    tone: "Conversational and energetic, personality-driven, ranges from educational to entertainment",
  },
  instagram: {
    name: "Instagram",
    structure: "Visual-first hook, carousel slide progression or single-image caption, CTA in final slide/line",
    formatting: "Short paragraphs, line breaks for readability, emojis as section markers, hashtags at end",
    length: "Captions: 150-300 words optimal. Carousel: 7-10 slides. Reels scripts: 30-90 seconds",
    engagement: "Save/share CTAs, 'Double tap if...', story polls, question stickers, DM triggers",
    tone: "Aspirational yet relatable, visual storytelling emphasis, personal and authentic",
  },
  linkedin: {
    name: "LinkedIn",
    structure: "Strong opening hook (first 2 lines before 'see more'), narrative body, insight/lesson, soft CTA",
    formatting: "Single-sentence paragraphs, generous line breaks, no hashtag walls, occasional bold via unicode",
    length: "Posts: 150-300 words (1300 char sweet spot). Articles: 800-2000 words",
    engagement: "Agree/disagree polls, 'Comment [word] for...', tag relevant people, reshare prompts",
    tone: "Professional but human, thought leadership, vulnerable storytelling, industry-savvy",
  },
  twitter: {
    name: "Twitter/X",
    structure: "Punchy hook tweet, thread with numbered insights, final tweet summarizes + CTA",
    formatting: "280 char constraint per tweet, line breaks for emphasis, minimal emojis, no hashtag spam",
    length: "Single tweets: 200-280 chars. Threads: 5-15 tweets. Quote tweets: concise hot takes",
    engagement: "Retweet/like asks, controversial takes for quote tweets, 'Reply with...', bookmark bait",
    tone: "Sharp, witty, opinionated, conversational, hot-take energy, internet-native voice",
  },
  tiktok: {
    name: "TikTok",
    structure: "Pattern-interrupt hook (first 1-3s), fast-paced body, loop-worthy ending or cliffhanger",
    formatting: "Spoken word with on-screen text overlays, captions for accessibility, trending sounds",
    length: "Scripts: 30-180 seconds optimal. Captions: 50-150 words with hashtags",
    engagement: "Stitch/duet invitations, 'Follow for part 2', comment section engagement, series hooks",
    tone: "Raw, unfiltered, trend-aware, gen-Z/millennial energy, entertainment-first",
  },
  newsletter: {
    name: "Newsletter",
    structure: "Subject line hook, personal opener, 2-3 main sections with headers, single primary CTA",
    formatting: "Headers, bullet points, bold key phrases, blockquotes, clean HTML email formatting",
    length: "500-1500 words. Subject lines: 40-60 chars. Preview text: 80-100 chars",
    engagement: "Reply-to questions, forward-to-friend asks, survey links, exclusive offers for subscribers",
    tone: "Intimate and direct, like writing to a friend, exclusive insider feel, consistent cadence",
  },
  podcast: {
    name: "Podcast",
    structure: "Cold open teaser, intro/theme, segmented discussion, key takeaways, outro with CTA",
    formatting: "Conversational scripts with speaker labels, [PAUSE] markers, show notes with timestamps",
    length: "Scripts: 3000-8000 words (20-60 min). Show notes: 300-500 words. Episode titles: 60 chars",
    engagement: "Review/rating asks, listener questions, social media discussion threads, guest referrals",
    tone: "Conversational and long-form, interview or monologue styles, deep-dive intellectual energy",
  },
  blog: {
    name: "Blog",
    structure: "SEO-optimized headline, hook intro, scannable H2/H3 sections, conclusion with CTA",
    formatting: "Headers hierarchy, bullet/numbered lists, bold key points, images, internal/external links",
    length: "1000-3000 words for SEO. Meta descriptions: 155 chars. Headlines: 60 chars",
    engagement: "Email signup CTAs, related post suggestions, comment sections, social share buttons",
    tone: "Authoritative yet accessible, educational, SEO-conscious but human-first, evergreen focus",
  },
  threads: {
    name: "Threads",
    structure: "Conversational opener, stream-of-consciousness flow, casual engagement closer",
    formatting: "Short paragraphs, casual punctuation, minimal formatting, conversation-native",
    length: "Posts: 100-300 words. Replies: concise and punchy",
    engagement: "Reply chain conversations, reposts, casual community engagement, cross-posting from IG",
    tone: "Casual, community-oriented, Instagram-adjacent but text-first, authentic and unpolished",
  },
  facebook: {
    name: "Facebook",
    structure: "Relatable hook, story or insight body, question or discussion prompt at end",
    formatting: "Medium paragraphs, emojis as accents, link previews, photo/video attachments",
    length: "Posts: 100-400 words. Group posts can be longer. Ads: concise with clear CTA",
    engagement: "Share prompts, tag-a-friend, group discussions, reaction-worthy emotional hooks, live events",
    tone: "Community-driven, relatable, slightly more personal/family-oriented, group discussion energy",
  },
  "email-copywriting": {
    name: "Email Copywriting",
    structure: "Curiosity-driven subject line, pattern-interrupt opener, story/proof body, single clear CTA, P.S. line",
    formatting: "Short lines (40-60 chars wide), one idea per paragraph, bold/italic for emphasis, minimal images",
    length: "Sales emails: 300-800 words. Sequences: 5-12 emails. Subject lines: 30-50 chars",
    engagement: "Click-through CTAs, reply triggers, urgency/scarcity, open loop cliffhangers between emails",
    tone: "Direct response, persuasion-focused, conversational urgency, one-to-one intimate feel",
  },
};

export function getPlatformName(platformId: string): string {
  return PLATFORM_MAP[platformId]?.name ?? platformId;
}

export function isCrossPlatform(sourcePlatform: string, targetPlatform: string): boolean {
  return sourcePlatform !== targetPlatform;
}

/**
 * Build the cross-platform bridging context block to prepend to user prompts.
 * Returns empty string if same platform (no adaptation needed).
 */
export function buildBridgingContext(
  sourcePlatform: string,
  targetPlatform: string,
  step: "generate" | "optimize" | "validate"
): string {
  if (!isCrossPlatform(sourcePlatform, targetPlatform)) return "";

  const source = PLATFORM_MAP[sourcePlatform];
  const target = PLATFORM_MAP[targetPlatform];
  if (!source || !target) return "";

  let block = `=== CROSS-PLATFORM VOICE ADAPTATION NOTICE ===
Profile built from [${source.name}]. Generating for [${target.name}].

PRESERVE (non-negotiable): Core voice DNA — vocabulary choices, sentence rhythm, humor style, values/beliefs, pet phrases, rhetorical devices, emotional triggers, storytelling patterns.

ADAPT to ${target.name} conventions:
  - Structure: ${target.structure}
  - Formatting: ${target.formatting}
  - Length: ${target.length}
  - Engagement: ${target.engagement}
  - Tone register: ${target.tone}

CRITICAL RULE: When voice DNA conflicts with platform norms, voice ALWAYS wins. The creator's authentic voice is more important than perfect platform optimization.
=== END ADAPTATION NOTICE ===

`;

  if (step === "validate") {
    block += `=== CROSS-PLATFORM VALIDATION GUIDANCE ===
This content was adapted from a ${source.name} voice profile to ${target.name} format.
- Prioritize VOICE FIDELITY over platform pattern conformance
- Be flexible on structural deviations that preserve voice authenticity
- Do NOT flag adaptations from the source platform style as violations
- Score voice accuracy heavily; score platform conformance leniently
- A score of 8+ is excellent for cross-platform adapted content
=== END VALIDATION GUIDANCE ===

`;
  }

  return block;
}
