import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

export async function GET() {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
  const hasGoogleSearch = !!process.env.GOOGLE_SEARCH_API_KEY && !!process.env.GOOGLE_SEARCH_CX;

  return NextResponse.json({
    hasAnthropic,
    hasOpenRouter,
    hasGoogleSearch,
    anthropicKeyPreview: hasAnthropic
      ? `${process.env.ANTHROPIC_API_KEY!.slice(0, 10)}...`
      : null,
    openrouterKeyPreview: hasOpenRouter
      ? `${process.env.OPENROUTER_API_KEY!.slice(0, 10)}...`
      : null,
    googleSearchKeyPreview: process.env.GOOGLE_SEARCH_API_KEY
      ? `${process.env.GOOGLE_SEARCH_API_KEY.slice(0, 10)}...`
      : null,
    googleSearchCxPreview: process.env.GOOGLE_SEARCH_CX
      ? `${process.env.GOOGLE_SEARCH_CX.slice(0, 10)}...`
      : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anthropicApiKey, openrouterApiKey, googleSearchApiKey, googleSearchCx } = body;

    let envContent = "";
    try {
      envContent = fs.readFileSync(ENV_PATH, "utf-8");
    } catch {
      // File doesn't exist yet
    }

    const lines = envContent.split("\n").filter(Boolean);
    const envMap = new Map<string, string>();
    for (const line of lines) {
      const eqIndex = line.indexOf("=");
      if (eqIndex > 0) {
        envMap.set(line.slice(0, eqIndex), line.slice(eqIndex + 1));
      }
    }

    if (anthropicApiKey) envMap.set("ANTHROPIC_API_KEY", anthropicApiKey);
    if (openrouterApiKey) envMap.set("OPENROUTER_API_KEY", openrouterApiKey);
    if (googleSearchApiKey) envMap.set("GOOGLE_SEARCH_API_KEY", googleSearchApiKey);
    if (googleSearchCx) envMap.set("GOOGLE_SEARCH_CX", googleSearchCx);

    const newContent = Array.from(envMap.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") + "\n";

    fs.writeFileSync(ENV_PATH, newContent);

    return NextResponse.json({
      success: true,
      message: "API keys saved. Restart the dev server for changes to take effect.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
