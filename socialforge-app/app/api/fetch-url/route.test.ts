import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// Synthetic HTML pages for testing
const SYNTHETIC_ARTICLE_HTML = `
<!DOCTYPE html>
<html>
<head><title>10 Tips for Better Content Marketing in 2026</title></head>
<body>
  <nav><a href="/">Home</a><a href="/blog">Blog</a></nav>
  <header><div class="logo">MarketingPro</div></header>
  <article>
    <h1>10 Tips for Better Content Marketing in 2026</h1>
    <p>Content marketing continues to evolve rapidly. Here are the top strategies that leading brands are using to connect with their audiences.</p>
    <h2>1. Authentic Voice Matters</h2>
    <p>Consumers can spot generic AI-generated content. The brands winning in 2026 are those that maintain a genuine, human voice across all channels.</p>
    <h2>2. Research-Driven Topics</h2>
    <p>Using real-time web research to inform content creation leads to 3x higher engagement rates compared to topics chosen without data backing.</p>
    <h2>3. Multi-Platform Adaptation</h2>
    <p>The same message needs different packaging for LinkedIn, Twitter, email, and blog formats. Smart creators adapt their voice while keeping core identity.</p>
  </article>
  <footer><p>Copyright 2026 MarketingPro</p></footer>
  <script>console.log("analytics");</script>
  <style>.ad { display: block; }</style>
</body>
</html>
`;

const SYNTHETIC_BLOG_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>The Future of Social Media Engagement</title>
  <meta property="og:title" content="Social Media Engagement Guide 2026" />
</head>
<body>
  <div class="navbar">Menu items here</div>
  <main>
    <h1>The Future of Social Media Engagement</h1>
    <p>Social media algorithms in 2026 favor content that sparks genuine conversation. Here's what you need to know about creating engaging posts.</p>
    <p>Key metrics have shifted from likes to meaningful interactions. Comments, shares, and saves now drive 80% of algorithmic reach.</p>
    <p>Brands that invest in community building see 5x return on their content investment compared to those focused solely on broadcasting.</p>
  </main>
  <div class="sidebar">Related posts</div>
  <div class="ad">Advertisement</div>
</body>
</html>
`;

const SYNTHETIC_MINIMAL_HTML = `
<!DOCTYPE html>
<html>
<head><title></title></head>
<body>
  <div>
    <p>Just some plain text content without any semantic structure or article tags.</p>
    <p>This tests the fallback to body text extraction.</p>
  </div>
</body>
</html>
`;

const SYNTHETIC_LARGE_HTML = `
<!DOCTYPE html>
<html>
<head><title>Large Content Page</title></head>
<body>
  <article>
    <p>${"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ".repeat(200)}</p>
  </article>
</body>
</html>
`;

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/fetch-url", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetch-url API route", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Mock global fetch to return synthetic HTML
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns 400 when URL is missing", async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("URL is required");
  });

  it("returns 400 for invalid URL", async () => {
    const res = await POST(makeRequest({ url: "not-a-url" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid URL");
  });

  it("returns 400 for non-HTTP protocol", async () => {
    const res = await POST(makeRequest({ url: "ftp://example.com/file" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Only HTTP/HTTPS URLs are supported");
  });

  it("extracts article content and strips nav/footer/scripts", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(SYNTHETIC_ARTICLE_HTML, { status: 200 })
    );

    const res = await POST(makeRequest({ url: "https://example.com/article" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("10 Tips for Better Content Marketing in 2026");
    expect(data.url).toBe("https://example.com/article");

    // Should contain article text
    expect(data.text).toContain("Content marketing continues to evolve");
    expect(data.text).toContain("Authentic Voice Matters");
    expect(data.text).toContain("Research-Driven Topics");

    // Should NOT contain nav, footer, or script content
    expect(data.text).not.toContain("analytics");
    expect(data.text).not.toContain("Copyright 2026 MarketingPro");
  });

  it("extracts from <main> tag and uses og:title", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(SYNTHETIC_BLOG_HTML, { status: 200 })
    );

    const res = await POST(makeRequest({ url: "https://example.com/blog-post" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    // og:title is present but <title> takes priority since it's non-empty
    expect(data.title).toBe("The Future of Social Media Engagement");
    expect(data.text).toContain("Social media algorithms in 2026");
    expect(data.text).toContain("meaningful interactions");

    // Sidebar and ad content should be stripped
    expect(data.text).not.toContain("Related posts");
    expect(data.text).not.toContain("Advertisement");
  });

  it("falls back to body text when no semantic elements exist", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(SYNTHETIC_MINIMAL_HTML, { status: 200 })
    );

    const res = await POST(makeRequest({ url: "https://example.com/plain" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.text).toContain("plain text content without any semantic structure");
    expect(data.text).toContain("fallback to body text extraction");
  });

  it("truncates content over 8000 characters", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(SYNTHETIC_LARGE_HTML, { status: 200 })
    );

    const res = await POST(makeRequest({ url: "https://example.com/large" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.text.length).toBeLessThanOrEqual(8003); // 8000 + "..."
    expect(data.text).toMatch(/\.\.\.$/);
  });

  it("returns 502 when upstream returns non-OK status", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("Forbidden", { status: 403 })
    );

    const res = await POST(makeRequest({ url: "https://example.com/blocked" }));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("HTTP 403");
  });

  it("handles fetch failures gracefully", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

    const res = await POST(makeRequest({ url: "https://example.com/down" }));
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("Failed to fetch URL");
  });
});
