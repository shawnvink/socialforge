import { NextRequest, NextResponse } from "next/server";
import { loadPrompt, loadCorePrompt, type PromptStep } from "@/lib/prompts/loader";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get("platform");
  const step = searchParams.get("step") as PromptStep;
  const coreModule = searchParams.get("core");

  // Core prompt request
  if (coreModule) {
    try {
      const prompt = loadCorePrompt(coreModule);
      return NextResponse.json({ prompt });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 404 });
    }
  }

  // Platform prompt request
  if (!platform || !step) {
    return NextResponse.json(
      { error: "Missing required params: platform, step (or core)" },
      { status: 400 }
    );
  }

  try {
    const prompt = loadPrompt(platform, step);
    return NextResponse.json({ prompt });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
