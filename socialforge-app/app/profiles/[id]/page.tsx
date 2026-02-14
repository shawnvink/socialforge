"use client";

import { use } from "react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PLATFORMS } from "@/lib/llm/models";
import { formatDate, formatCost } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  Download,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

export default function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const profile = useQuery(api.profiles.get, { id: id as Id<"profiles"> });
  const contentItems = useQuery(api.content.list, { profileId: id as Id<"profiles"> });
  const removeProfile = useMutation(api.profiles.remove);

  const platformInfo = profile ? PLATFORMS.find((p) => p.id === profile.platform) : null;

  const handleDelete = async () => {
    if (!confirm(`Delete profile "${profile?.creatorName}"? This will not delete associated content, but it will be unlinked.`)) return;
    setDeleting(true);
    await removeProfile({ id: id as Id<"profiles"> });
    router.push("/profiles");
  };

  const handleExport = () => {
    if (!profile) return;
    const data = {
      creatorName: profile.creatorName,
      platform: profile.platform,
      genesisScore: profile.genesisScore,
      expressionProfile: profile.expressionProfile,
      voiceBible: profile.voiceBible,
      modelUsed: profile.modelUsed,
      provider: profile.provider,
      createdAt: new Date(profile.createdAt).toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.creatorName.toLowerCase().replace(/\s+/g, "-")}-${profile.platform}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyProfile = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.expressionProfile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="space-y-6">
        <Link href="/profiles" className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to profiles
        </Link>
        <div className="rounded-2xl border border-dashed py-20 text-center">
          <h3 className="text-[17px] font-semibold">Profile not found</h3>
          <p className="mt-1.5 text-[14px] text-muted-foreground">This profile may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link href="/profiles" className="inline-flex items-center gap-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to profiles
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <Link
            href={`/generate?platform=${profile.platform}&profile=${id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" /> Generate Content
          </Link>
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

      {/* Profile Header */}
      <div className="rounded-2xl border bg-card p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-[24px] font-bold text-primary">
            {profile.creatorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-semibold">{profile.creatorName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[14px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-[13px] font-medium">
                {platformInfo?.name ?? profile.platform}
              </span>
              <span>Genesis Score: <strong className="text-foreground">{profile.genesisScore}/10</strong></span>
              <span>Model: {profile.modelUsed}</span>
              <span>Provider: {profile.provider}</span>
              <span>Created: {formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expression Profile */}
      <div className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-[16px] font-semibold">Expression Profile</h2>
          <button
            onClick={copyProfile}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="px-6 py-5">
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-foreground/80">
            {profile.expressionProfile}
          </pre>
        </div>
      </div>

      {/* Associated Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold">Associated Content</h2>
          <span className="text-[13px] text-muted-foreground">
            {contentItems?.length ?? 0} items
          </span>
        </div>
        {contentItems === undefined ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : contentItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-12 text-center">
            <p className="text-[14px] text-muted-foreground">No content generated with this profile yet.</p>
            <Link
              href={`/generate?platform=${profile.platform}&profile=${id}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Generate First Content
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {contentItems.map((item) => (
              <Link key={item._id} href={`/content/${item._id}`} className="block rounded-2xl border bg-card px-6 py-4 transition-all hover:border-primary/20 hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span>{item.contentType}</span>
                    {item.validationScore !== undefined && (
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        item.validationScore >= 8.5
                          ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                      }`}>
                        {item.validationScore}/10
                      </span>
                    )}
                    <span className="capitalize">{item.kanbanStatus}</span>
                  </div>
                  <p className="mt-1 text-[14px] font-medium">{item.topic}</p>
                  <div className="mt-1 flex items-center gap-3 text-[12px] text-muted-foreground">
                    <span>{formatCost(item.cost)}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
