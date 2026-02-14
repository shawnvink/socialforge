"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PLATFORMS } from "@/lib/llm/models";
import { formatDate } from "@/lib/utils";
import { Users, Plus, ArrowRight, Trash2, Loader2 } from "lucide-react";

export default function ProfilesPage() {
  const [filterPlatform, setFilterPlatform] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const profiles = useQuery(api.profiles.list, filterPlatform ? { platform: filterPlatform } : {});
  const removeProfile = useMutation(api.profiles.remove);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete profile "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await removeProfile({ id: id as Id<"profiles"> });
    } catch {
      // ignore
    }
    setDeletingId(null);
  };

  const filtered = profiles ?? [];

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-semibold">Voice Profiles</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Saved expression profiles from voice analysis
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Profile
        </Link>
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
      {profiles === undefined ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-5 text-[17px] font-semibold">No profiles yet</h3>
          <p className="mt-1.5 max-w-sm text-center text-[14px] text-muted-foreground">
            Analyze content samples to create your first voice profile. Profiles are reusable across all content generation.
          </p>
          <Link
            href="/generate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Create First Profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((profile) => {
            const platformInfo = PLATFORMS.find((p) => p.id === profile.platform);
            return (
              <div key={profile._id} className="group flex items-center justify-between rounded-2xl border bg-card px-6 py-5 transition-all duration-150 hover:border-primary/30 hover:shadow-sm">
                <Link href={`/profiles/${profile._id}`} className="flex flex-1 items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-[14px] font-bold text-primary">
                    {profile.creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[15px] font-medium">{profile.creatorName}</p>
                    <div className="mt-0.5 flex items-center gap-3 text-[13px] text-muted-foreground">
                      <span>{platformInfo?.name}</span>
                      <span>Genesis: {profile.genesisScore}/10</span>
                      <span>{formatDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(profile._id, profile.creatorName)}
                    disabled={deletingId === profile._id}
                    className="rounded-lg p-2 text-muted-foreground/40 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    {deletingId === profile._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary/50" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
