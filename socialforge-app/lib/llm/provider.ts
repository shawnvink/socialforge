export interface LLMRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  model: string;
  cacheRead?: number;
  cacheCreation?: number;
}

export interface LLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
  generateStream(request: LLMRequest): AsyncGenerator<string, LLMResponse>;
}
