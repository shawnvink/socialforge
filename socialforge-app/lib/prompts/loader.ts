import fs from "fs";
import path from "path";

const PROMPTS_BASE = process.env.PROMPTS_DIR || path.resolve(process.cwd(), "..");

const PLATFORM_DIRS: Record<string, string> = {
  youtube: "youtube",
  instagram: "instagram",
  linkedin: "linkedin",
  twitter: "twitter",
  tiktok: "tiktok",
  newsletter: "newsletter",
  podcast: "podcast",
  blog: "blog",
  threads: "threads",
  facebook: "facebook",
  "email-copywriting": "email-copywriting",
};

const PROMPT_FILES: Record<string, Record<string, string>> = {
  youtube: {
    analyzer: "P1_youtube_analyzer.md",
    generator: "P2_youtube_generator.md",
    optimizer: "P3_youtube_optimizer.md",
    validator: "P4_youtube_validator.md",
  },
  instagram: {
    analyzer: "P1_instagram_analyzer.md",
    generator: "P2_instagram_generator.md",
    optimizer: "P3_instagram_optimizer.md",
    validator: "P4_instagram_validator.md",
  },
  linkedin: {
    analyzer: "P1_linkedin_analyzer.md",
    generator: "P2_linkedin_generator.md",
    optimizer: "P3_linkedin_optimizer.md",
    validator: "P4_linkedin_validator.md",
  },
  twitter: {
    analyzer: "P1_twitter_analyzer.md",
    generator: "P2_twitter_generator.md",
    optimizer: "P3_twitter_optimizer.md",
    validator: "P4_twitter_validator.md",
  },
  tiktok: {
    analyzer: "P1_tiktok_analyzer.md",
    generator: "P2_tiktok_generator.md",
    optimizer: "P3_tiktok_optimizer.md",
    validator: "P4_tiktok_validator.md",
  },
  newsletter: {
    analyzer: "P1_newsletter_analyzer.md",
    generator: "P2_newsletter_generator.md",
    optimizer: "P3_newsletter_optimizer.md",
    validator: "P4_newsletter_validator.md",
  },
  podcast: {
    analyzer: "P1_podcast_analyzer.md",
    generator: "P2_podcast_generator.md",
    optimizer: "P3_podcast_optimizer.md",
    validator: "P4_podcast_validator.md",
  },
  blog: {
    analyzer: "P1_blog_analyzer.md",
    generator: "P2_blog_generator.md",
    optimizer: "P3_blog_optimizer.md",
    validator: "P4_blog_validator.md",
  },
  threads: {
    analyzer: "P1_threads_analyzer.md",
    generator: "P2_threads_generator.md",
    optimizer: "P3_threads_optimizer.md",
    validator: "P4_threads_validator.md",
  },
  facebook: {
    analyzer: "P1_facebook_analyzer.md",
    generator: "P2_facebook_generator.md",
    optimizer: "P3_facebook_optimizer.md",
    validator: "P4_facebook_validator.md",
  },
  "email-copywriting": {
    analyzer: "P1_email-copywriting_analyzer.md",
    generator: "P2_email-copywriting_generator.md",
    optimizer: "P3_email-copywriting_optimizer.md",
    validator: "P4_email-copywriting_validator.md",
  },
};

export type PromptStep = "analyzer" | "generator" | "optimizer" | "validator";

const CORE_PROMPTS: Record<string, string> = {
  "voice-analyzer": "core/C1_social_voice_analyzer.md",
  "strategy-architect": "core/C2_content_strategy_architect.md",
  "cross-platform-harmonizer": "core/C3_cross_platform_harmonizer.md",
};

export function loadPrompt(platform: string, step: PromptStep): string {
  const dir = PLATFORM_DIRS[platform];
  const file = PROMPT_FILES[platform]?.[step];
  if (!dir || !file) {
    throw new Error(`Unknown platform/step: ${platform}/${step}`);
  }
  const filePath = path.join(PROMPTS_BASE, dir, file);
  return fs.readFileSync(filePath, "utf-8");
}

export function loadCorePrompt(module: string): string {
  const file = CORE_PROMPTS[module];
  if (!file) {
    throw new Error(`Unknown core module: ${module}`);
  }
  const filePath = path.join(PROMPTS_BASE, file);
  return fs.readFileSync(filePath, "utf-8");
}

export function injectVariables(
  prompt: string,
  variables: Record<string, string>
): string {
  let result = prompt;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
