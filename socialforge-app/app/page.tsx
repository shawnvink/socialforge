"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PLATFORMS } from "@/lib/llm/models";
import { formatCost } from "@/lib/utils";
import {
  Users,
  PenTool,
  Library,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Music2,
  Mail,
  Mic,
  FileText,
  AtSign,
  Facebook,
  Send,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Music2,
  newsletter: Mail,
  podcast: Mic,
  blog: FileText,
  threads: AtSign,
  facebook: Facebook,
  "email-copywriting": Send,
};

const STAT_CARD_STYLES = [
  {
    label: "Voice Profiles",
    icon: Users,
    sublabel: "Created",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    borderGlow: "hover:shadow-blue-500/10",
    href: "/profiles",
  },
  {
    label: "Content Pieces",
    icon: PenTool,
    sublabel: "Generated",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    borderGlow: "hover:shadow-purple-500/10",
    href: "/content",
  },
  {
    label: "In Library",
    icon: Library,
    sublabel: "Ready to use",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    borderGlow: "hover:shadow-amber-500/10",
    href: "/content",
  },
  {
    label: "Total Spend",
    icon: DollarSign,
    sublabel: "All time",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    borderGlow: "hover:shadow-emerald-500/10",
    href: "/settings",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Analyze",
    desc: "Extract voice DNA from 20-30 content samples per platform",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    bgGlow: "bg-blue-500/10",
  },
  {
    step: "02",
    title: "Generate",
    desc: "Create content that sounds exactly like the creator",
    icon: Sparkles,
    color: "from-purple-500 to-purple-600",
    bgGlow: "bg-purple-500/10",
  },
  {
    step: "03",
    title: "Optimize",
    desc: "Boost engagement metrics while preserving authentic voice",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/10",
  },
  {
    step: "04",
    title: "Validate",
    desc: "Score across 5 indistinguishability tests for quality",
    icon: Shield,
    color: "from-emerald-500 to-green-500",
    bgGlow: "bg-emerald-500/10",
  },
];

export default function Dashboard() {
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);
  const profiles = useQuery(api.profiles.list, {});
  const content = useQuery(api.content.list, {});
  const stats = useQuery(api.analytics.getStats);

  const profileCount = profiles?.length ?? 0;
  const contentCount = content?.length ?? 0;
  const libraryCount = content?.filter((c) => c.kanbanStatus === "approved" || c.kanbanStatus === "published").length ?? 0;
  const totalSpend = stats?.totalCost ?? 0;

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setApiConfigured(data.hasAnthropic || data.hasOpenRouter))
      .catch(() => setApiConfigured(false));
  }, []);

  return (
    <div className="space-y-14">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">System Online</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="gradient-text">SocialForge</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Clone any creator&apos;s voice across 11 platforms. Analyze, generate,
          optimize, and validate — all powered by AI.
        </p>
      </div>

      {/* API Warning */}
      {apiConfigured === false && (
        <Link href="/settings">
          <div className="group flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-8 py-6 transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/10">
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-amber-200">Connect your API key</p>
                <p className="mt-1 text-sm text-amber-400/70">
                  Add an Anthropic or OpenRouter API key to start generating content
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-amber-500/50 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {STAT_CARD_STYLES.map((stat, i) => {
          const values = [
            String(profileCount),
            String(contentCount),
            String(libraryCount),
            formatCost(totalSpend),
          ];
          return { ...stat, value: values[i] };
        }).map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl ${stat.borderGlow}`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <stat.icon className={`h-5 w-5 ${stat.iconColor} opacity-60`} />
              </div>
              <p className="mt-3 text-4xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/70">{stat.sublabel}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Workflow Pipeline */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Workflow Pipeline
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((item, i) => (
            <Link
              key={item.step}
              href="/generate"
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg cursor-pointer"
            >
              {/* Step number */}
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.bgGlow}`}>
                <item.icon className={`h-5 w-5 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[11px] font-bold text-muted-foreground/50">{item.step}</span>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
              {/* Connector arrow */}
              {i < 3 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden text-muted-foreground/20 lg:block">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      {stats && stats.totalCalls > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Usage & Costs
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <p className="text-xs font-medium text-muted-foreground">Today</p>
              <p className="mt-2 text-2xl font-bold">{formatCost(stats.dailyCost)}</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <p className="text-xs font-medium text-muted-foreground">This Week</p>
              <p className="mt-2 text-2xl font-bold">{formatCost(stats.weeklyCost)}</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <p className="text-xs font-medium text-muted-foreground">This Month</p>
              <p className="mt-2 text-2xl font-bold">{formatCost(stats.monthlyCost)}</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <p className="text-xs font-medium text-muted-foreground">Total API Calls</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalCalls}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.totalTokens.toLocaleString()} tokens
              </p>
            </div>
          </div>
          {Object.keys(stats.byAction).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(stats.byAction).map(([action, count]) => (
                <div key={action} className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-1.5">
                  <span className="text-[12px] font-medium capitalize">{action.replace(/-/g, " ")}</span>
                  <span className="text-[12px] text-muted-foreground">{count as number}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platforms Grid */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Platforms
          </h2>
          <Link
            href="/generate"
            className="group flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Generate content
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const Icon = PLATFORM_ICONS[platform.id] || PenTool;
            return (
              <Link key={platform.id} href={`/generate?platform=${platform.id}`}>
                <div className="group flex items-center gap-5 rounded-2xl border border-border/50 bg-card/40 px-6 py-5 transition-all duration-200 hover:border-border hover:bg-card/80 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10">
                    <Icon className="h-6 w-6 text-muted-foreground/70 transition-colors group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold">{platform.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Analyze &middot; Generate &middot; Optimize &middot; Validate
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/20 transition-all group-hover:translate-x-0.5 group-hover:text-primary/50" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
