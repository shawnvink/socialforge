"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PLATFORMS } from "@/lib/llm/models";
import { formatDate, formatCost, truncate } from "@/lib/utils";
import { Library, LayoutGrid, List, Copy, Check, ArrowRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

const KANBAN_COLUMNS = [
  { id: "draft", label: "Draft", dotColor: "bg-gray-400" },
  { id: "review", label: "In Review", dotColor: "bg-amber-400" },
  { id: "approved", label: "Approved", dotColor: "bg-blue-400" },
  { id: "published", label: "Published", dotColor: "bg-green-400" },
];

export default function ContentPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const content = useQuery(api.content.list, filterPlatform ? { platform: filterPlatform } : {});
  const updateContent = useMutation(api.content.update);
  const removeContent = useMutation(api.content.remove);

  const filtered = content ?? [];

  const copyContent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateContent({ id: id as Id<"content">, kanbanStatus: status });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await removeContent({ id: id as Id<"content"> });
    } catch {
      // ignore
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-semibold">Content Library</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            All generated content across every platform
          </p>
        </div>
        <div className="flex items-center rounded-xl border bg-card p-1">
          <button
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              view === "kanban" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Board
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterPlatform("")}
          className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            filterPlatform === ""
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilterPlatform(p.id)}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              filterPlatform === p.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {content === undefined ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Library className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-5 text-[17px] font-semibold">No content yet</h3>
          <p className="mt-1.5 max-w-sm text-center text-[14px] text-muted-foreground">
            Content you generate will appear here. Use the list or board view to manage your content pipeline.
          </p>
          <Link
            href="/generate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Generate Content <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : view === "list" ? (
        /* List View */
        <div className="space-y-2">
          {filtered.map((item) => {
            const platformInfo = PLATFORMS.find((p) => p.id === item.platform);
            const statusCol = KANBAN_COLUMNS.find((c) => c.id === item.kanbanStatus);
            return (
              <div key={item._id} className="group flex items-start gap-5 rounded-2xl border bg-card px-6 py-5 transition-all hover:border-primary/20">
                <Link href={`/content/${item._id}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-muted-foreground">{platformInfo?.name}</span>
                    <span className="text-muted-foreground/30">/</span>
                    <span className="text-[12px] text-muted-foreground">{item.contentType}</span>
                    {item.validationScore !== undefined && (
                      <span className={`ml-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        item.validationScore >= 8.5
                          ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                      }`}>
                        {item.validationScore}/10
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[15px] font-medium">{item.topic}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {truncate(item.optimizedContent || item.generatedContent, 200)}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${statusCol?.dotColor}`} />
                      {statusCol?.label}
                    </span>
                    <span>{item.modelUsed}</span>
                    <span>{formatCost(item.cost)}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => copyContent(item._id, item.optimizedContent || item.generatedContent)}
                    className="rounded-lg p-2 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {copied === item._id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="rounded-lg p-2 text-muted-foreground/40 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-4 gap-5">
          {KANBAN_COLUMNS.map((col) => {
            const items = filtered.filter((c) => c.kanbanStatus === col.id);
            return (
              <div key={col.id}>
                <div className="mb-3 flex items-center gap-2 px-1">
                  <div className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                  <h3 className="text-[13px] font-semibold">{col.label}</h3>
                  <span className="text-[12px] text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <Link key={item._id} href={`/content/${item._id}`} className="block rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm">
                      <div className="flex items-start justify-between">
                        <p className="text-[12px] text-muted-foreground">
                          {PLATFORMS.find((p) => p.id === item.platform)?.name}
                        </p>
                      </div>
                      <p className="mt-1 text-[14px] font-medium leading-snug">{item.topic}</p>
                      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                        {truncate(item.generatedContent, 100)}
                      </p>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed px-4 py-8 text-center text-[12px] text-muted-foreground">
                      No items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
