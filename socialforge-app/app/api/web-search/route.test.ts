import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// Synthetic Google Custom Search API responses
const SYNTHETIC_SEARCH_RESPONSE = {
  items: [
    {
      title: "Content Marketing Strategy Guide 2026 - MarketingPro",
      snippet: "Learn the latest content marketing strategies for 2026. Discover how AI-augmented research and authentic voice creation drive engagement.",
      link: "https://marketingpro.com/content-strategy-2026",
    },
    {
      title: "How Top Creators Build Authentic Brands - CreatorEconomy",
      snippet: "Study of 500+ successful creators reveals the patterns behind authentic brand building. Voice consistency is the #1 factor.",
      link: "https://creatoreconomy.com/authentic-brands",
    },
    {
      title: "Social Media Trends Report - DataInsights",
      snippet: "Comprehensive analysis of social media trends. Video content sees 240% more engagement, but text posts with personal stories still dominate LinkedIn.",
      link: "https://datainsights.com/social-trends-2026",
    },
    {
      title: "Email Marketing vs Social: ROI Comparison - GrowthLab",
      snippet: "Email marketing delivers $42 ROI per $1 spent, outperforming social media for direct conversions. But social builds the top of funnel.",
      link: "https://growthlab.io/email-vs-social",
    },
    {
      title: "The Science of Viral Content - ViralResearch",
      snippet: "Neuroscience-backed analysis of why certain content goes viral. Emotional resonance and novelty are the two strongest predictors.",
      link: "https://viralresearch.org/science-of-viral",
    },
  ],
};

const SYNTHETIC_ERROR_RESPONSE = {
  error: {
    code: 403,
    message: "Daily Limit Exceeded. The quota will be reset at midnight Pacific Time.",
    status: "PERMISSION_DENIED",
  },
};

const SYNTHETIC_EMPTY_RESPONSE = {
  searchInformation: { totalResults: "0" },
};

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/web-search", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("web-search API route", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    process.env.GOOGLE_SEARCH_API_KEY = "test-api-key-12345";
    process.env.GOOGLE_SEARCH_CX = "test-search-engine-cx";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = originalEnv;
  });

  it("returns 400 when query is missing", async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Query is required");
  });

  it("returns 400 when API keys are not configured", async () => {
    delete process.env.GOOGLE_SEARCH_API_KEY;
    delete process.env.GOOGLE_SEARCH_CX;

    const res = await POST(makeRequest({ query: "content marketing" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("not configured");
  });

  it("returns search results for a valid query", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(SYNTHETIC_SEARCH_RESPONSE), { status: 200 })
    );

    const res = await POST(makeRequest({ query: "content marketing strategies 2026" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.results).toHaveLength(5);

    // Verify first result structure
    expect(data.results[0]).toEqual({
      title: "Content Marketing Strategy Guide 2026 - MarketingPro",
      snippet: expect.stringContaining("content marketing strategies"),
      url: "https://marketingpro.com/content-strategy-2026",
    });

    // Verify all results have required fields
    for (const result of data.results) {
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("snippet");
      expect(result).toHaveProperty("url");
      expect(typeof result.title).toBe("string");
      expect(typeof result.snippet).toBe("string");
      expect(typeof result.url).toBe("string");
    }
  });

  it("sends correct parameters to Google API", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(SYNTHETIC_SEARCH_RESPONSE), { status: 200 })
    );

    await POST(makeRequest({ query: "voice branding tips" }));

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const calledUrl = vi.mocked(globalThis.fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("googleapis.com/customsearch/v1");
    expect(calledUrl).toContain("key=test-api-key-12345");
    expect(calledUrl).toContain("cx=test-search-engine-cx");
    expect(calledUrl).toContain("q=voice+branding+tips");
    expect(calledUrl).toContain("num=5");
  });

  it("handles Google API errors gracefully", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(SYNTHETIC_ERROR_RESPONSE), { status: 200 })
    );

    const res = await POST(makeRequest({ query: "test query" }));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toContain("Daily Limit Exceeded");
  });

  it("returns empty array when no results found", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(SYNTHETIC_EMPTY_RESPONSE), { status: 200 })
    );

    const res = await POST(makeRequest({ query: "extremely obscure query xyz123" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.results).toEqual([]);
  });

  it("handles network errors", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("DNS resolution failed"));

    const res = await POST(makeRequest({ query: "test" }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("DNS resolution failed");
  });
});
