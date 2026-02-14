export interface ModelInfo {
  id: string;
  name: string;
  provider: "anthropic" | "openrouter";
  inputCostPer1M: number;
  outputCostPer1M: number;
  maxTokens: number;
  description: string;
}

export const ANTHROPIC_MODELS: ModelInfo[] = [
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "anthropic",
    inputCostPer1M: 15.0,
    outputCostPer1M: 75.0,
    maxTokens: 32768,
    description: "Most capable. Best for complex analysis (P1).",
  },
  {
    id: "claude-opus-4-5-20250918",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    inputCostPer1M: 5.0,
    outputCostPer1M: 25.0,
    maxTokens: 32768,
    description: "Most intelligent. Best for deep voice analysis (P1) and complex generation.",
  },
  {
    id: "claude-sonnet-4-5-20250929",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    maxTokens: 16384,
    description: "Best balance of quality and cost. Great for generation (P2) and optimization (P3).",
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    inputCostPer1M: 0.8,
    outputCostPer1M: 4.0,
    maxTokens: 8192,
    description: "Fast and cheap. Good for validation (P4) and quick tasks.",
  },
];

export const OPENROUTER_MODELS: ModelInfo[] = [
  {
    id: "anthropic/claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "openrouter",
    inputCostPer1M: 5.0,
    outputCostPer1M: 25.0,
    maxTokens: 32768,
    description: "Most intelligent Anthropic model via OpenRouter.",
  },
  {
    id: "anthropic/claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "openrouter",
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    maxTokens: 16384,
    description: "Anthropic's best balance model via OpenRouter.",
  },
  {
    id: "anthropic/claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "openrouter",
    inputCostPer1M: 0.8,
    outputCostPer1M: 4.0,
    maxTokens: 8192,
    description: "Fast Claude model via OpenRouter.",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openrouter",
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    maxTokens: 16384,
    description: "OpenAI's flagship model.",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openrouter",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    maxTokens: 16384,
    description: "Ultra-cheap OpenAI model.",
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "openrouter",
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    maxTokens: 8192,
    description: "Google's fast model. Very cheap.",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "openrouter",
    inputCostPer1M: 0.4,
    outputCostPer1M: 0.4,
    maxTokens: 8192,
    description: "Meta's open-source model.",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "openrouter",
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    maxTokens: 8192,
    description: "Ultra-cheap reasoning model.",
  },
];

export function getModelsForProvider(provider: "anthropic" | "openrouter"): ModelInfo[] {
  return provider === "anthropic" ? ANTHROPIC_MODELS : OPENROUTER_MODELS;
}

export function getModelById(id: string): ModelInfo | undefined {
  return [...ANTHROPIC_MODELS, ...OPENROUTER_MODELS].find((m) => m.id === id);
}

export function calculateCost(
  model: ModelInfo,
  promptTokens: number,
  completionTokens: number
): number {
  return (
    (promptTokens / 1_000_000) * model.inputCostPer1M +
    (completionTokens / 1_000_000) * model.outputCostPer1M
  );
}

/**
 * Cache-aware cost calculation for Anthropic prompt caching.
 * - Cache reads cost 90% less than standard input tokens
 * - Cache creation costs 25% more than standard input tokens
 * - Non-cached input tokens are charged at the standard rate
 */
export function calculateCostWithCache(
  model: ModelInfo,
  promptTokens: number,
  completionTokens: number,
  cacheReadTokens: number,
  cacheCreationTokens: number
): number {
  const nonCachedInput = promptTokens - cacheReadTokens - cacheCreationTokens;
  return (
    (nonCachedInput / 1_000_000) * model.inputCostPer1M +
    (cacheReadTokens / 1_000_000) * model.inputCostPer1M * 0.1 +
    (cacheCreationTokens / 1_000_000) * model.inputCostPer1M * 1.25 +
    (completionTokens / 1_000_000) * model.outputCostPer1M
  );
}

export const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: "Youtube" },
  { id: "instagram", name: "Instagram", icon: "Instagram" },
  { id: "linkedin", name: "LinkedIn", icon: "Linkedin" },
  { id: "twitter", name: "Twitter/X", icon: "Twitter" },
  { id: "tiktok", name: "TikTok", icon: "Music2" },
  { id: "newsletter", name: "Newsletter", icon: "Mail" },
  { id: "podcast", name: "Podcast", icon: "Mic" },
  { id: "blog", name: "Blog", icon: "FileText" },
  { id: "threads", name: "Threads", icon: "AtSign" },
  { id: "facebook", name: "Facebook", icon: "Facebook" },
  { id: "email-copywriting", name: "Email Copywriting", icon: "Send" },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];
