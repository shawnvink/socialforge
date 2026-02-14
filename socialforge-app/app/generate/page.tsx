"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PLATFORMS, ANTHROPIC_MODELS, OPENROUTER_MODELS } from "@/lib/llm/models";
import { formatCost, formatTokens } from "@/lib/utils";
import { Loader2, Copy, Check, ChevronRight, Sparkles, Save, UserCircle, Brain, Square, RefreshCw, ArrowRight } from "lucide-react";
import { buildBridgingContext, isCrossPlatform, getPlatformName } from "@/lib/prompts/crossPlatformAdapter";

type Step = "analyze" | "generate" | "optimize" | "validate";

const STEPS: { id: Step; label: string; tag: string; description: string }[] = [
  { id: "analyze", tag: "P1", label: "Analyze", description: "Extract voice profile" },
  { id: "generate", tag: "P2", label: "Generate", description: "Create content" },
  { id: "optimize", tag: "P3", label: "Optimize", description: "Improve performance" },
  { id: "validate", tag: "P4", label: "Validate", description: "Score authenticity" },
];

function parseGenesisScore(text: string): number {
  // Try to extract a genesis/authenticity score from the expression profile
  const patterns = [
    /genesis\s*score[:\s]*(\d+(?:\.\d+)?)/i,
    /authenticity\s*score[:\s]*(\d+(?:\.\d+)?)/i,
    /overall\s*score[:\s]*(\d+(?:\.\d+)?)/i,
    /score[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) return Math.min(10, Math.max(0, parseFloat(match[1])));
  }
  return 0;
}

function parseValidationScore(text: string): number {
  const patterns = [
    /(?:overall|final|total|composite)\s*(?:authenticity\s*)?score[:\s]*(\d+(?:\.\d+)?)/i,
    /score[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i,
    /(\d+(?:\.\d+)?)\s*\/\s*10/,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) return Math.min(10, Math.max(0, parseFloat(match[1])));
  }
  return 0;
}

function GenerateContent() {
  const searchParams = useSearchParams();
  const initialPlatform = searchParams.get("platform") || "";
  const initialProfileId = searchParams.get("profile") || "";

  const [platform, setPlatform] = useState(initialPlatform);
  const [step, setStep] = useState<Step>("analyze");
  const [provider, setProvider] = useState<"anthropic" | "openrouter">("anthropic");
  const [model, setModel] = useState("claude-sonnet-4-5-20250929");

  // Profile selection
  const [useExistingProfile, setUseExistingProfile] = useState(!!initialProfileId);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(initialProfileId);

  // P1
  const [creatorName, setCreatorName] = useState("");
  const [contentSamples, setContentSamples] = useState("");
  const [voiceBible, setVoiceBible] = useState("");

  // P2
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Outputs
  const [expressionProfile, setExpressionProfile] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [optimizedContent, setOptimizedContent] = useState("");
  const [validationReport, setValidationReport] = useState("");

  // Saved IDs
  const [savedProfileId, setSavedProfileId] = useState<Id<"profiles"> | null>(null);
  const [savedContentId, setSavedContentId] = useState<Id<"content"> | null>(null);

  // Core analysis
  const [coreOutput, setCoreOutput] = useState("");
  const [coreLoading, setCoreLoading] = useState(false);
  const [coreModule, setCoreModule] = useState("");

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastCost, setLastCost] = useState<{ tokens: number; cost: number; cacheRead?: number; cacheCreation?: number } | null>(null);

  // Refinement loop
  const [refinementRound, setRefinementRound] = useState(0);
  const [refinementHistory, setRefinementHistory] = useState<Array<{ round: number; score: number }>>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [stopRefining, setStopRefining] = useState(false);

  // Refs for values read inside the recursive runStep loop
  const refinementRoundRef = useRef(0);
  const stopRefiningRef = useRef(false);
  const refinementHistoryRef = useRef<Array<{ round: number; score: number }>>([]);
  const isRefiningRef = useRef(false);
  const validationReportRef = useRef("");
  const optimizedContentRef = useRef("");

  // Convex
  const allProfiles = useQuery(api.profiles.list, {});

  // Split profiles into same-platform and cross-platform groups
  const { samePlatformProfiles, crossPlatformProfiles } = useMemo(() => {
    if (!allProfiles) return { samePlatformProfiles: [], crossPlatformProfiles: [] };
    const same = allProfiles.filter((p) => p.platform === platform);
    const cross = allProfiles.filter((p) => p.platform !== platform);
    return { samePlatformProfiles: same, crossPlatformProfiles: cross };
  }, [allProfiles, platform]);

  const profiles = allProfiles;
  const selectedProfile = useQuery(
    api.profiles.get,
    selectedProfileId ? { id: selectedProfileId as Id<"profiles"> } : "skip"
  );
  const createProfile = useMutation(api.profiles.create);
  const createContent = useMutation(api.content.create);
  const updateContent = useMutation(api.content.update);
  const logUsage = useMutation(api.analytics.logUsage);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.hasOpenRouter && !data.hasAnthropic) {
          setProvider("openrouter");
          setModel("anthropic/claude-sonnet-4-5");
        }
      })
      .catch(() => {});
  }, []);

  // When selecting an existing profile, load its data
  useEffect(() => {
    if (selectedProfile && useExistingProfile) {
      setExpressionProfile(selectedProfile.expressionProfile);
      setCreatorName(selectedProfile.creatorName);
      setSavedProfileId(selectedProfile._id);
      if (selectedProfile.voiceBible) setVoiceBible(selectedProfile.voiceBible);
      setStep("generate");
    }
  }, [selectedProfile, useExistingProfile]);

  const models = provider === "anthropic" ? ANTHROPIC_MODELS : OPENROUTER_MODELS;

  // Map step to the right state setter for streaming
  const streamSetters: Record<Step, (fn: (prev: string) => string) => void> = {
    analyze: (fn) => setExpressionProfile(fn),
    generate: (fn) => setGeneratedContent(fn),
    optimize: (fn) => setOptimizedContent(fn),
    validate: (fn) => setValidationReport(fn),
  };

  const runStep = async (currentStep: Step) => {
    setLoading(true);
    setError("");
    setLastCost(null);

    // Reset refinement state when starting a fresh validation (not from auto-loop)
    if (currentStep === "validate" && !isRefiningRef.current) {
      refinementRoundRef.current = 0;
      setRefinementRound(0);
      refinementHistoryRef.current = [];
      setRefinementHistory([]);
      stopRefiningRef.current = false;
      setStopRefining(false);
    }

    // Clear the output for this step so streaming starts fresh
    const setter = streamSetters[currentStep];
    setter(() => "");

    try {
      const stepMap: Record<Step, string> = {
        analyze: "analyzer",
        generate: "generator",
        optimize: "optimizer",
        validate: "validator",
      };
      const promptRes = await fetch(`/api/prompts?platform=${platform}&step=${stepMap[currentStep]}`);
      const promptData = await promptRes.json();
      if (promptData.error) throw new Error(promptData.error);

      const systemPrompt = promptData.prompt;
      let userPrompt = "";

      // Determine cross-platform bridging context
      const sourcePlatform = selectedProfile?.platform ?? platform;
      const crossPlatformPrefix = (step: "generate" | "optimize" | "validate") =>
        buildBridgingContext(sourcePlatform, platform, step);

      if (currentStep === "analyze") {
        userPrompt = `Creator Name: ${creatorName}\n\nContent Samples:\n${contentSamples}`;
        if (voiceBible) userPrompt += `\n\nVoice Bible:\n${voiceBible}`;
      } else if (currentStep === "generate") {
        userPrompt = crossPlatformPrefix("generate");
        userPrompt += `Expression Profile:\n${expressionProfile}\n\nTopic: ${topic}\nContent Type: ${contentType}`;
        if (voiceBible) userPrompt += `\nVoice Bible:\n${voiceBible}`;
        if (additionalNotes) userPrompt += `\nAdditional Notes: ${additionalNotes}`;
      } else if (currentStep === "optimize") {
        const contentToOptimize = refinementRoundRef.current > 0 ? optimizedContentRef.current : generatedContent;
        userPrompt = crossPlatformPrefix("optimize");
        userPrompt += `Expression Profile:\n${expressionProfile}\n\nContent to Optimize:\n${contentToOptimize}`;
        if (refinementRoundRef.current > 0 && validationReportRef.current) {
          const hist = refinementHistoryRef.current;
          const prevScore = hist.length > 0 ? hist[hist.length - 1].score : 0;
          userPrompt += `\n\nPrevious Validation Score: ${prevScore}/10\nValidation Feedback:\n${validationReportRef.current}\n\nPlease address the issues above to achieve a score of 9+/10.`;
        }
      } else if (currentStep === "validate") {
        userPrompt = crossPlatformPrefix("validate");
        userPrompt += `Expression Profile:\n${expressionProfile}\n\nContent to Validate:\n${optimizedContentRef.current || optimizedContent || generatedContent}`;
      }

      const llmRes = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, systemPrompt, userPrompt, maxTokens: 8192, stream: true }),
      });

      if (!llmRes.ok) {
        const errData = await llmRes.json();
        throw new Error(errData.error || "LLM request failed");
      }

      // Read the SSE stream
      const reader = llmRes.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let metadata: { promptTokens: number; completionTokens: number; cost: number; cacheRead?: number; cacheCreation?: number } | null = null;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          try {
            const parsed = JSON.parse(json);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.done) {
              metadata = {
                promptTokens: parsed.promptTokens,
                completionTokens: parsed.completionTokens,
                cost: parsed.cost,
                cacheRead: parsed.cacheRead ?? 0,
                cacheCreation: parsed.cacheCreation ?? 0,
              };
            } else if (parsed.text) {
              fullContent += parsed.text;
              setter(() => fullContent);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== "Stream error") {
              // JSON parse error on partial chunk — skip
            } else {
              throw e;
            }
          }
        }
      }

      if (!metadata) {
        throw new Error("Stream ended without metadata");
      }

      const tokenInfo = {
        tokens: metadata.promptTokens + metadata.completionTokens,
        cost: metadata.cost,
        cacheRead: metadata.cacheRead,
        cacheCreation: metadata.cacheCreation,
      };
      setLastCost(tokenInfo);

      // Persist to Convex after stream completes
      if (currentStep === "analyze") {
        const genesisScore = parseGenesisScore(fullContent);
        const profileId = await createProfile({
          creatorName,
          platform,
          voiceBible: voiceBible || undefined,
          expressionProfile: fullContent,
          genesisScore,
          modelUsed: model,
          provider,
        });
        setSavedProfileId(profileId);
        await logUsage({
          profileId,
          action: "analyze",
          model,
          provider,
          promptTokens: metadata.promptTokens,
          completionTokens: metadata.completionTokens,
          cost: metadata.cost,
        });
        setStep("generate");
      } else if (currentStep === "generate") {
        if (savedProfileId) {
          const contentId = await createContent({
            profileId: savedProfileId,
            platform,
            contentType,
            topic,
            generatedContent: fullContent,
            modelUsed: model,
            provider,
            promptTokens: metadata.promptTokens,
            completionTokens: metadata.completionTokens,
            cost: metadata.cost,
          });
          setSavedContentId(contentId);
          await logUsage({
            profileId: savedProfileId,
            contentId,
            action: "generate",
            model,
            provider,
            promptTokens: metadata.promptTokens,
            completionTokens: metadata.completionTokens,
            cost: metadata.cost,
          });
        }
        setStep("optimize");
      } else if (currentStep === "optimize") {
        optimizedContentRef.current = fullContent;
        if (savedContentId) {
          await updateContent({
            id: savedContentId,
            optimizedContent: fullContent,
          });
          await logUsage({
            profileId: savedProfileId ?? undefined,
            contentId: savedContentId,
            action: "optimize",
            model,
            provider,
            promptTokens: metadata.promptTokens,
            completionTokens: metadata.completionTokens,
            cost: metadata.cost,
          });
        }
        setStep("validate");
        // Auto-chain to validate during refinement
        if (isRefiningRef.current) {
          setLoading(false);
          await runStep("validate");
          return;
        }
      } else if (currentStep === "validate") {
        validationReportRef.current = fullContent;
        const score = parseValidationScore(fullContent);
        if (savedContentId) {
          await updateContent({
            id: savedContentId,
            validationReport: fullContent,
            validationScore: score,
          });
          await logUsage({
            profileId: savedProfileId ?? undefined,
            contentId: savedContentId,
            action: "validate",
            model,
            provider,
            promptTokens: metadata.promptTokens,
            completionTokens: metadata.completionTokens,
            cost: metadata.cost,
          });
        }
        // Auto-refinement loop
        const curRound = refinementRoundRef.current;
        if (score < 9 && curRound < 5 && !stopRefiningRef.current) {
          const nextRound = curRound + 1;
          refinementRoundRef.current = nextRound;
          setRefinementRound(nextRound);
          const newHistory = [...refinementHistoryRef.current, { round: curRound, score }];
          refinementHistoryRef.current = newHistory;
          setRefinementHistory(newHistory);
          isRefiningRef.current = true;
          setIsRefining(true);
          setStep("optimize");
          setLoading(false);
          await runStep("optimize");
          return;
        } else {
          // Done refining
          if (isRefiningRef.current) {
            const finalHistory = [...refinementHistoryRef.current, { round: curRound, score }];
            refinementHistoryRef.current = finalHistory;
            setRefinementHistory(finalHistory);
          }
          isRefiningRef.current = false;
          setIsRefining(false);
          stopRefiningRef.current = false;
          setStopRefining(false);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
    setLoading(false);
  };

  const runCoreAnalysis = async (module: string) => {
    setCoreLoading(true);
    setCoreModule(module);
    setCoreOutput("");
    setError("");

    try {
      const promptRes = await fetch(`/api/prompts?core=${module}`);
      const promptData = await promptRes.json();
      if (promptData.error) throw new Error(promptData.error);

      let userPrompt = `Creator Name: ${creatorName}\n\nContent Samples:\n${contentSamples}`;
      if (voiceBible) userPrompt += `\n\nVoice Bible:\n${voiceBible}`;
      if (expressionProfile) userPrompt += `\n\nExpression Profile:\n${expressionProfile}`;

      const llmRes = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, model,
          systemPrompt: promptData.prompt,
          userPrompt,
          maxTokens: 8192,
          stream: true,
        }),
      });

      if (!llmRes.ok) {
        const errData = await llmRes.json();
        throw new Error(errData.error || "LLM request failed");
      }

      const reader = llmRes.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullContent += parsed.text;
              setCoreOutput(fullContent);
            }
            if (parsed.done) {
              setLastCost({ tokens: parsed.promptTokens + parsed.completionTokens, cost: parsed.cost });
              await logUsage({
                profileId: savedProfileId ?? undefined,
                action: `core-${module}`,
                model,
                provider,
                promptTokens: parsed.promptTokens,
                completionTokens: parsed.completionTokens,
                cost: parsed.cost,
              });
            }
          } catch {
            // skip partial JSON
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
    setCoreLoading(false);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedSteps = [
    expressionProfile ? "analyze" : null,
    generatedContent ? "generate" : null,
    optimizedContent ? "optimize" : null,
    validationReport ? "validate" : null,
  ].filter(Boolean) as Step[];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold">Generate Content</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Full P1 to P4 workflow. No copy-pasting. Select a platform and follow the steps.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isCompleted = completedSteps.includes(s.id);
          return (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : isCompleted
                      ? "bg-foreground/5 text-foreground hover:bg-foreground/10"
                      : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${
                  isActive ? "bg-white/20" : isCompleted ? "bg-foreground/10" : "bg-muted"
                }`}>
                  {isCompleted && !isActive ? <Check className="h-3.5 w-3.5" /> : s.tag}
                </span>
                <div>
                  <p className="text-[13px] font-medium leading-none">{s.label}</p>
                  <p className={`text-[11px] leading-none mt-0.5 ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
                    {s.description}
                  </p>
                </div>
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground/30" />}
            </div>
          );
        })}
      </div>

      {/* Config Row */}
      <div className="flex items-end gap-4 rounded-2xl border bg-card p-5">
        <div className="flex-1">
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Platform
          </label>
          <select
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setSelectedProfileId("");
              setUseExistingProfile(false);
            }}
          >
            <option value="">Select a platform...</option>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="w-[200px]">
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Provider
          </label>
          <select
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={provider}
            onChange={(e) => {
              const p = e.target.value as "anthropic" | "openrouter";
              setProvider(p);
              setModel(p === "anthropic" ? "claude-sonnet-4-5-20250929" : "anthropic/claude-sonnet-4-5");
            }}
          >
            <option value="anthropic">Anthropic</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>
        <div className="w-[280px]">
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Model
          </label>
          <select
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-6 py-4 text-[14px] text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Cost indicator */}
      {lastCost && (
        <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
          <span>Last call: {formatTokens(lastCost.tokens)} tokens</span>
          <span>{formatCost(lastCost.cost)}</span>
          {(lastCost.cacheRead ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              Cache hit: {formatTokens(lastCost.cacheRead!)} tokens cached
            </span>
          )}
          {savedProfileId && !savedContentId && (
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
              <Save className="h-3.5 w-3.5" /> Profile saved
            </span>
          )}
          {savedContentId && (
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
              <Save className="h-3.5 w-3.5" /> Content saved
            </span>
          )}
        </div>
      )}

      {/* ===== P1: ANALYZE ===== */}
      {step === "analyze" && (
        <div className="space-y-6">
          {/* Existing profile selector */}
          {platform && profiles && profiles.length > 0 && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-[14px] font-medium">Use an existing profile?</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setUseExistingProfile(false); setSelectedProfileId(""); setExpressionProfile(""); setSavedProfileId(null); }}
                  className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-colors ${
                    !useExistingProfile
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  New Analysis
                </button>
                <button
                  onClick={() => setUseExistingProfile(true)}
                  className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-colors ${
                    useExistingProfile
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Existing Profile ({profiles.length})
                </button>
              </div>
              {useExistingProfile && (
                <>
                  <select
                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                  >
                    <option value="">Select a profile...</option>
                    {samePlatformProfiles.length > 0 && (
                      <optgroup label="Same Platform">
                        {samePlatformProfiles.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.creatorName} — Genesis: {p.genesisScore}/10
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {crossPlatformProfiles.length > 0 && (
                      <optgroup label="Cross-Platform (Will Adapt)">
                        {crossPlatformProfiles.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.creatorName} ({getPlatformName(p.platform)}) — Genesis: {p.genesisScore}/10
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {/* Cross-platform adaptation banner */}
                  {selectedProfile && isCrossPlatform(selectedProfile.platform, platform) && (
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 px-5 py-3">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-amber-800 dark:text-amber-300">
                        <ArrowRight className="h-4 w-4" />
                        Voice from {getPlatformName(selectedProfile.platform)} → Generating for {getPlatformName(platform)}
                      </div>
                      <p className="mt-1 text-[12px] text-amber-700/70 dark:text-amber-400/60">
                        Core voice DNA will be preserved. Platform patterns will be adapted automatically.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!useExistingProfile && (
            <>
              <div>
                <label className="mb-2 block text-[14px] font-medium">Creator Name</label>
                <input
                  type="text"
                  placeholder="e.g., Alex Hormozi, Ali Abdaal, Sahil Bloom"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-[15px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[14px] font-medium">Content Samples</label>
                  <span className="text-[12px] text-muted-foreground">
                    Paste 20-30 pieces, separated by --- or blank lines
                  </span>
                </div>
                <textarea
                  placeholder={"Paste your first content sample here...\n\n---\n\nPaste your second content sample here...\n\n---\n\nPaste your third content sample here..."}
                  value={contentSamples}
                  onChange={(e) => setContentSamples(e.target.value)}
                  className="w-full rounded-xl border bg-background px-5 py-4 text-[14px] leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={16}
                />
                <p className="mt-1.5 text-[12px] text-muted-foreground">
                  {contentSamples.split(/---|\n\n\n/).filter((s) => s.trim()).length} samples detected
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[14px] font-medium">Voice Bible</label>
                  <span className="text-[12px] text-muted-foreground">Optional</span>
                </div>
                <textarea
                  placeholder="If you have an existing Voice Bible, paste it here to improve accuracy..."
                  value={voiceBible}
                  onChange={(e) => setVoiceBible(e.target.value)}
                  className="w-full rounded-xl border bg-background px-5 py-4 text-[14px] leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={6}
                />
              </div>

              <button
                onClick={() => runStep("analyze")}
                disabled={loading || !platform || !creatorName || !contentSamples}
                className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                Analyze Voice Profile
              </button>

              {/* Streaming preview during P1 analysis */}
              {loading && expressionProfile && (
                <div className="rounded-2xl border bg-card">
                  <div className="flex items-center gap-2 border-b px-6 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-[13px] font-medium text-muted-foreground">Analyzing voice profile...</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto px-6 py-4">
                    <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground/70">
                      {expressionProfile}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ===== P2: GENERATE ===== */}
      {step === "generate" && (
        <div className="space-y-6">
          {expressionProfile && (
            <div className="rounded-2xl border bg-green-50/50 dark:bg-green-950/20 dark:border-green-900/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-[13px] font-medium text-green-800 dark:text-green-300">
                    Voice profile {useExistingProfile ? "loaded" : "extracted"}
                    {savedProfileId && " & saved"}
                  </span>
                </div>
                <button onClick={() => copyText(expressionProfile)} className="text-[12px] text-green-600 dark:text-green-400 hover:underline">
                  {copied ? "Copied" : "Copy profile"}
                </button>
              </div>
              <p className="mt-2 max-h-24 overflow-y-auto font-mono text-[12px] leading-relaxed text-green-700/70 dark:text-green-400/60">
                {expressionProfile.slice(0, 500)}...
              </p>
            </div>
          )}

          {/* Cross-platform adaptation banner on generate step */}
          {expressionProfile && selectedProfile && isCrossPlatform(selectedProfile.platform, platform) && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 px-6 py-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-amber-800 dark:text-amber-300">
                <ArrowRight className="h-4 w-4" />
                Voice from {getPlatformName(selectedProfile.platform)} → Generating for {getPlatformName(platform)}
              </div>
              <p className="mt-1 text-[12px] text-amber-700/70 dark:text-amber-400/60">
                Core voice DNA will be preserved. Platform patterns will be adapted automatically.
              </p>
            </div>
          )}

          {/* Core Analysis Modules */}
          {expressionProfile && (
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-[13px] font-semibold">Deep Analysis (Optional)</span>
                <span className="text-[11px] text-muted-foreground">Run core modules for richer insights</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "voice-analyzer", label: "C1: Voice DNA", desc: "Full forensic voice analysis" },
                  { id: "strategy-architect", label: "C2: Strategy", desc: "Content strategy mapping" },
                  { id: "cross-platform-harmonizer", label: "C3: Harmonize", desc: "Cross-platform calibration" },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => runCoreAnalysis(mod.id)}
                    disabled={coreLoading || loading}
                    className={`flex-1 rounded-xl border px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-muted/50 disabled:opacity-40 ${
                      coreModule === mod.id && coreOutput ? "border-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    <p className="text-[13px] font-medium">{mod.label}</p>
                    <p className="text-[11px] text-muted-foreground">{mod.desc}</p>
                  </button>
                ))}
              </div>
              {coreLoading && coreOutput && (
                <div className="rounded-xl border bg-background max-h-64 overflow-y-auto p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span className="text-[12px] text-muted-foreground">Running analysis...</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground/70">
                    {coreOutput}
                  </pre>
                </div>
              )}
              {!coreLoading && coreOutput && (
                <div className="rounded-xl border bg-background">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="text-[12px] font-medium">{coreModule.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Output</span>
                    <button onClick={() => copyText(coreOutput)} className="text-[11px] text-primary hover:underline">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-4">
                    <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground/70">
                      {coreOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="mb-2 block text-[14px] font-medium">Topic</label>
            <input
              type="text"
              placeholder="What should the content be about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-[15px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium">Content Type</label>
            <input
              type="text"
              placeholder="e.g., post, thread, email_sales, blog_post, caption, script"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-[15px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[14px] font-medium">Additional Notes</label>
              <span className="text-[12px] text-muted-foreground">Optional</span>
            </div>
            <textarea
              placeholder="Specific requirements, target audience, CTA, tone adjustments..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full rounded-xl border bg-background px-5 py-4 text-[14px] leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
            />
          </div>

          <button
            onClick={() => runStep("generate")}
            disabled={loading || !topic || !contentType}
            className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Generate Content
          </button>

          {/* Streaming preview during P2 generation */}
          {loading && generatedContent && (
            <OutputBlock
              title="Generating..."
              content={generatedContent}
              onCopy={() => copyText(generatedContent)}
              copied={copied}
              streaming
            />
          )}
        </div>
      )}

      {/* ===== P3: OPTIMIZE ===== */}
      {step === "optimize" && (
        <div className="space-y-6">
          <OutputBlock
            title="Generated Content"
            content={generatedContent}
            onCopy={() => copyText(generatedContent)}
            copied={copied}
          />

          <div className="flex gap-3">
            <button
              onClick={() => runStep("optimize")}
              disabled={loading}
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Optimize Content
            </button>
            <button
              onClick={() => setStep("validate")}
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-[15px] font-medium transition-colors hover:bg-muted"
            >
              Skip to Validate <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Streaming preview during P3 optimization */}
          {loading && optimizedContent && (
            <OutputBlock
              title="Optimizing..."
              content={optimizedContent}
              onCopy={() => copyText(optimizedContent)}
              copied={copied}
              streaming
            />
          )}
        </div>
      )}

      {/* ===== P4: VALIDATE ===== */}
      {step === "validate" && (
        <div className="space-y-6">
          <OutputBlock
            title={optimizedContent ? "Optimized Content" : "Generated Content"}
            content={optimizedContent || generatedContent}
            onCopy={() => copyText(optimizedContent || generatedContent)}
            copied={copied}
          />

          {/* Refinement progress */}
          {isRefining && loading && (
            <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-[14px] font-medium">
                  Refining... Round {refinementRound + 1}/5
                  {refinementHistory.length > 0 && (
                    <span className="ml-2 text-muted-foreground">
                      — Score: {refinementHistory[refinementHistory.length - 1].score}/10
                    </span>
                  )}
                </p>
                <p className="text-[12px] text-muted-foreground">Auto-refining until score reaches 9/10</p>
              </div>
              <button
                onClick={() => { stopRefiningRef.current = true; setStopRefining(true); }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-2 text-[13px] font-medium text-red-700 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-950/50"
              >
                <Square className="h-3.5 w-3.5" />
                Stop Refining
              </button>
            </div>
          )}

          {/* Score progression history */}
          {refinementHistory.length > 0 && !loading && (
            <div className="flex items-center gap-3 rounded-2xl border bg-card px-6 py-4">
              <span className="text-[13px] font-medium text-muted-foreground">Score progression:</span>
              <div className="flex items-center gap-1.5">
                {refinementHistory.map((h, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className={`rounded-lg px-2.5 py-1 text-[13px] font-semibold ${
                      h.score >= 9
                        ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                        : h.score >= 8
                          ? "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                    }`}>
                      {h.score}
                    </span>
                    {i < refinementHistory.length - 1 && (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-[12px] text-muted-foreground">
                ({refinementHistory.length} round{refinementHistory.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {!isRefining && (
            <button
              onClick={() => runStep("validate")}
              disabled={loading}
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Run Validation
            </button>
          )}

          {validationReport && (
            <>
              <div className="rounded-2xl border bg-card">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h3 className="text-[15px] font-semibold">Validation Report</h3>
                  <button onClick={() => copyText(validationReport)} className="text-[12px] text-primary hover:underline">
                    {copied ? "Copied" : "Copy report"}
                  </button>
                </div>
                <div className="px-6 py-5">
                  <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-foreground/80">
                    {validationReport}
                  </pre>
                </div>
              </div>
              {selectedProfile && isCrossPlatform(selectedProfile.platform, platform) && (
                <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 px-6 py-4">
                  <p className="text-[13px] font-medium text-amber-800 dark:text-amber-300">
                    Cross-platform adaptation note
                  </p>
                  <p className="mt-1 text-[12px] text-amber-700/70 dark:text-amber-400/60">
                    This content was adapted from a {getPlatformName(selectedProfile.platform)} voice profile. Validation scores may be slightly lower due to platform pattern differences — this is expected. Voice fidelity is prioritized over platform conformance.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function OutputBlock({
  title,
  content,
  onCopy,
  copied,
  streaming,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
  streaming?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          {streaming && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          <h3 className="text-[15px] font-semibold">{title}</h3>
        </div>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className={`px-6 py-5 ${streaming ? "max-h-96 overflow-y-auto" : ""}`}>
        <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-foreground/85">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
