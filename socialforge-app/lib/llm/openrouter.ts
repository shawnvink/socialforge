import OpenAI from "openai";
import type { LLMProvider, LLMRequest, LLMResponse } from "./provider";
import { getModelById, calculateCost } from "./models";

export class OpenRouterProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SocialForge",
      },
    });
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: request.model,
      max_tokens: request.maxTokens || 8192,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content || "";
    const promptTokens = response.usage?.prompt_tokens || 0;
    const completionTokens = response.usage?.completion_tokens || 0;

    const modelInfo = getModelById(request.model);
    const cost = modelInfo
      ? calculateCost(modelInfo, promptTokens, completionTokens)
      : 0;

    return {
      content,
      promptTokens,
      completionTokens,
      cost,
      model: request.model,
    };
  }

  async *generateStream(request: LLMRequest): AsyncGenerator<string, LLMResponse> {
    const stream = await this.client.chat.completions.create({
      model: request.model,
      max_tokens: request.maxTokens || 8192,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
      stream: true,
    });

    let content = "";
    let promptTokens = 0;
    let completionTokens = 0;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        content += delta;
        yield delta;
      }
      if (chunk.usage) {
        promptTokens = chunk.usage.prompt_tokens || 0;
        completionTokens = chunk.usage.completion_tokens || 0;
      }
    }

    const modelInfo = getModelById(request.model);
    const cost = modelInfo
      ? calculateCost(modelInfo, promptTokens, completionTokens)
      : 0;

    return {
      content,
      promptTokens,
      completionTokens,
      cost,
      model: request.model,
    };
  }
}
