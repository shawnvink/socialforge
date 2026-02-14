import { NextRequest, NextResponse } from "next/server";
import { AnthropicProvider } from "@/lib/llm/anthropic";
import { OpenRouterProvider } from "@/lib/llm/openrouter";
import type { LLMProvider } from "@/lib/llm/provider";

function getProvider(provider: string): LLMProvider {
  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured. Add it to .env.local");
    return new AnthropicProvider(apiKey);
  } else if (provider === "openrouter") {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured. Add it to .env.local");
    return new OpenRouterProvider(apiKey);
  }
  throw new Error(`Unknown provider: ${provider}`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, systemPrompt, userPrompt, maxTokens, stream } = body;

    if (!provider || !model || !systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: "Missing required fields: provider, model, systemPrompt, userPrompt" },
        { status: 400 }
      );
    }

    let llm: LLMProvider;
    try {
      llm = getProvider(provider);
    } catch (err: unknown) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Provider error" },
        { status: 500 }
      );
    }

    // Non-streaming (original behavior)
    if (!stream) {
      const response = await llm.generate({
        model,
        systemPrompt,
        userPrompt,
        maxTokens: maxTokens || 8192,
      });
      return NextResponse.json(response);
    }

    // Streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const gen = llm.generateStream({
            model,
            systemPrompt,
            userPrompt,
            maxTokens: maxTokens || 8192,
          });

          let result;
          while (true) {
            const { value, done } = await gen.next();
            if (done) {
              result = value;
              break;
            }
            // Send text chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: value })}\n\n`));
          }

          // Send final metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                promptTokens: result.promptTokens,
                completionTokens: result.completionTokens,
                cost: result.cost,
                model: result.model,
                cacheRead: result.cacheRead ?? 0,
                cacheCreation: result.cacheCreation ?? 0,
              })}\n\n`
            )
          );
          controller.close();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("LLM API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
