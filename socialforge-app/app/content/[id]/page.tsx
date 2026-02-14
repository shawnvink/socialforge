"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PLATFORMS } from "@/lib/llm/models";
import { formatDate, formatCost, formatTokens } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  Copy,
  Check,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";

const KANBAN_COLUMNS = [
  { id: "draft", label: "Draft", dotColor: "bg-gray-400" },
  { id: "review", label: "In Review", dotColor: "bg-amber-400" },
  { id: "approved", label: "Approved", dotColor: "bg-blue-400" },
  { id: "published", label: "Published", dotColor: "bg-green-400" },
];

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");

  const content = useQuery(api.content.get, { id: id as Id<"content"> });
  const profile = useQuery(
    api.profiles.get,
    content?.profileId ? { id: content.profileId } : "skip"
  );
  const updateContent = useMutation(api.content.update);
  const removeContent = useMutation(api.content.remove);

  const platformInfo = content ? PLATFORMS.find((p) => p.id === content.platform) : null;
  const statusCol = content ? KANBAN_COLUMNS.find((c) => c.id === content.kanbanStatus) : null;

  const handleDelete = async () => {
    if (!confirm("Delete this content? This cannot be undone.")) return;
    setDeleting(true);
    await removeContent({ id: id as Id<"content"> });
    router.push("/content");
  };

  const handleStatusChange = async (status: string) => {
    await updateContent({ id: id as Id<"content">, kanbanStatus: status });
  };

  const copyText = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(""), 2000);
  };

  if (content === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="space-y-6">
        <Link href="/content" className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
        <div className="rounded-2xl border border-dashed py-20 text-center">
          <h3 className="text-[17px] font-semibold">Content not found</h3>
          <p className="mt-1.5 text-[14px] text-muted-foreground">This content may have been deleted.</p>
        </div>
      </div>
    );
  }

  const bestContent = content.optimizedContent || content.generatedContent;

  return (
    <div className="space-y-8">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link href="/content" className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={content.kanbanStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border bg-background px-3 py-2.5 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>{col.label}</option>
            ))}
          </select>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 px-4 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 font-medium">
                {platformInfo?.name ?? content.platform}
              </span>
              <span>{content.contentType}</span>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${statusCol?.dotColor}`} />
                {statusCol?.label}
              </div>
            </div>
            <h1 className="mt-3 text-[24px] font-semibold">{content.topic}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
              <span>Model: {content.modelUsed}</span>
              <span>Provider: {content.provider}</span>
              <span>{formatTokens(content.promptTokens + content.completionTokens)} tokens</span>
              <span>{formatCost(content.cost)}</span>
              <span>{formatDate(content.createdAt)}</span>
            </div>
          </div>
          {content.validationScore !== undefined && (
            <div className={`flex flex-col items-center rounded-2xl px-5 py-3 ${
              content.validationScore >= 8.5
                ? "bg-green-50 dark:bg-green-950/30"
                : "bg-amber-50 dark:bg-amber-950/30"
            }`}>
              <span className={`text-2xl font-bold ${
                content.validationScore >= 8.5
                  ? "text-green-700 dark:text-green-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}>
                {content.validationScore}
              </span>
              <span className="text-[11px] text-muted-foreground">/10</span>
            </div>
          )}
        </div>

        {/* Profile link */}
        {profile && (
          <Link
            href={`/profiles/${content.profileId}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <User className="h-3.5 w-3.5" />
            Profile: {profile.creatorName} (Helix: {profile.helixScore}/10)
          </Link>
        )}
      </div>

      {/* Generated Content */}
      <ContentSection
        title="Generated Content"
        content={content.generatedContent}
        onCopy={() => copyText(content.generatedContent, "generated")}
        copied={copiedSection === "generated"}
      />

      {/* Optimized Content */}
      {content.optimizedContent && (
        <ContentSection
          title="Optimized Content"
          content={content.optimizedContent}
          onCopy={() => copyText(content.optimizedContent!, "optimized")}
          copied={copiedSection === "optimized"}
        />
      )}

      {/* Validation Report */}
      {content.validationReport && (
        <ContentSection
          title="Validation Report"
          content={content.validationReport}
          onCopy={() => copyText(content.validationReport!, "validation")}
          copied={copiedSection === "validation"}
          mono
        />
      )}

      {/* Quick Copy Best Version */}
      <div className="flex justify-center">
        <button
          onClick={() => copyText(bestContent, "best")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          {copiedSection === "best" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedSection === "best" ? "Copied!" : `Copy ${content.optimizedContent ? "Optimized" : "Generated"} Content`}
        </button>
      </div>
    </div>
  );
}

function ContentSection({
  title,
  content,
  onCopy,
  copied,
  mono,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="px-6 py-5">
        <div className={`whitespace-pre-wrap leading-relaxed text-foreground/85 ${
          mono ? "font-mono text-[13px]" : "text-[14px] leading-[1.7]"
        }`}>
          {content}
        </div>
      </div>
    </div>
  );
}
