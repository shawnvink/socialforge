import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider, LLMRequest, LLMResponse } from "./provider";
import { getModelById, calculateCostWithCache } from "./models";

// The SDK types may lag behind the API — cache_control is supported at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SystemWithCache = any;

function systemWithCache(text: string): SystemWithCache {
  return [{ type: "text", text, cache_control: { type: "ephemeral" } }];
}

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens || 8192,
      system: systemWithCache(request.systemPrompt),
      messages: [{ role: "user", content: request.userPrompt }],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";
    const promptTokens = response.usage.input_tokens;
    const completionTokens = response.usage.output_tokens;
    const cacheRead = (response.usage as unknown as Record<string, number>).cache_read_input_tokens ?? 0;
    const cacheCreation = (response.usage as unknown as Record<string, number>).cache_creation_input_tokens ?? 0;

    const modelInfo = getModelById(request.model);
    const cost = modelInfo
      ? calculateCostWithCache(modelInfo, promptTokens, completionTokens, cacheRead, cacheCreation)
      : 0;

    return {
      content,
      promptTokens,
      completionTokens,
      cost,
      model: request.model,
      cacheRead,
      cacheCreation,
    };
  }

  async *generateStream(request: LLMRequest): AsyncGenerator<string, LLMResponse> {
    const stream = this.client.messages.stream({
      model: request.model,
      max_tokens: request.maxTokens || 8192,
      system: systemWithCache(request.systemPrompt),
      messages: [{ role: "user", content: request.userPrompt }],
    });

    let content = "";

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        content += event.delta.text;
        yield event.delta.text;
      }
    }

    const finalMessage = await stream.finalMessage();
    const promptTokens = finalMessage.usage.input_tokens;
    const completionTokens = finalMessage.usage.output_tokens;
    const cacheRead = (finalMessage.usage as unknown as Record<string, number>).cache_read_input_tokens ?? 0;
    const cacheCreation = (finalMessage.usage as unknown as Record<string, number>).cache_creation_input_tokens ?? 0;

    const modelInfo = getModelById(request.model);
    const cost = modelInfo
      ? calculateCostWithCache(modelInfo, promptTokens, completionTokens, cacheRead, cacheCreation)
      : 0;

    return {
      content,
      promptTokens,
      completionTokens,
      cost,
      model: request.model,
      cacheRead,
      cacheCreation,
    };
  }
}
