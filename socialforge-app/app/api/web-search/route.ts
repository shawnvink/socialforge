import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    if (!apiKey || !cx) {
      return NextResponse.json(
        { error: "Google Search API not configured. Add your API key and Search Engine ID in Settings." },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      key: apiKey,
      cx,
      q: query,
      num: "5",
    });

    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Google Search API error" },
        { status: 502 }
      );
    }

    const results = (data.items || []).map((item: { title?: string; snippet?: string; link?: string }) => ({
      title: item.title || "",
      snippet: item.snippet || "",
      url: item.link || "",
    }));

    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
