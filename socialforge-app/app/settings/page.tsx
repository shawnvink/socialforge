"use client";

import { useState, useEffect } from "react";
import { ANTHROPIC_MODELS, OPENROUTER_MODELS } from "@/lib/llm/models";
import { CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";

export default function SettingsPage() {
  const [activeProvider, setActiveProvider] = useState<"anthropic" | "openrouter">("anthropic");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [defaultModel, setDefaultModel] = useState("claude-sonnet-4-5-20250929");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState<{
    hasAnthropic: boolean;
    hasOpenRouter: boolean;
    anthropicKeyPreview: string | null;
    openrouterKeyPreview: string | null;
  } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setApiStatus)
      .catch(() => {});
  }, []);

  const saveKeys = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anthropicApiKey: anthropicKey || undefined,
          openrouterApiKey: openrouterKey || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setAnthropicKey("");
        setOpenrouterKey("");
        const status = await fetch("/api/settings").then((r) => r.json());
        setApiStatus(status);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage("Failed to save keys");
    }
    setSaving(false);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: activeProvider,
          model: defaultModel,
          systemPrompt: "You are a helpful assistant.",
          userPrompt: "Say 'SocialForge connected successfully' and nothing else.",
          maxTokens: 50,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setTestResult({ success: false, message: data.error });
      } else {
        setTestResult({ success: true, message: data.content });
      }
    } catch {
      setTestResult({ success: false, message: "Could not reach API" });
    }
    setTesting(false);
  };

  const models = activeProvider === "anthropic" ? ANTHROPIC_MODELS : OPENROUTER_MODELS;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-semibold">Settings</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Configure your LLM provider, API keys, and default model
        </p>
      </div>

      {/* Provider Selection */}
      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Provider
        </h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Choose how SocialForge connects to language models
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setActiveProvider("anthropic");
              setDefaultModel("claude-sonnet-4-5-20250929");
            }}
            className={`rounded-2xl border-2 p-6 text-left transition-all duration-150 ${
              activeProvider === "anthropic"
                ? "border-primary bg-primary/3 shadow-sm"
                : "border-transparent bg-card hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50">
                <span className="text-lg">A</span>
              </div>
              {apiStatus?.hasAnthropic && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            <h3 className="mt-4 text-[16px] font-semibold">Anthropic Direct</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Direct access to Claude Opus, Sonnet, and Haiku. Best quality for SocialForge prompts.
            </p>
          </button>

          <button
            onClick={() => {
              setActiveProvider("openrouter");
              setDefaultModel("anthropic/claude-sonnet-4-5");
            }}
            className={`rounded-2xl border-2 p-6 text-left transition-all duration-150 ${
              activeProvider === "openrouter"
                ? "border-primary bg-primary/3 shadow-sm"
                : "border-transparent bg-card hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50">
                <span className="text-lg">OR</span>
              </div>
              {apiStatus?.hasOpenRouter && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            <h3 className="mt-4 text-[16px] font-semibold">OpenRouter</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Access 100+ models including Claude, GPT-4, Gemini, and Llama. Flexible and cost-effective.
            </p>
          </button>
        </div>
      </section>

      {/* API Key */}
      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          API Key
        </h2>
        <div className="mt-4 rounded-2xl border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="text-[14px] font-medium">
                {activeProvider === "anthropic" ? "Anthropic API Key" : "OpenRouter API Key"}
              </label>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {activeProvider === "anthropic"
                  ? "Get your key at console.anthropic.com"
                  : "Get your key at openrouter.ai/keys"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(activeProvider === "anthropic" ? apiStatus?.hasAnthropic : apiStatus?.hasOpenRouter) ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-3 py-1 text-[12px] font-medium text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/30 px-3 py-1 text-[12px] font-medium text-red-600 dark:text-red-400">
                  <XCircle className="h-3.5 w-3.5" /> Not configured
                </span>
              )}
            </div>
          </div>

          {(activeProvider === "anthropic" ? apiStatus?.anthropicKeyPreview : apiStatus?.openrouterKeyPreview) && (
            <p className="mt-3 font-mono text-[12px] text-muted-foreground">
              Current: {activeProvider === "anthropic" ? apiStatus?.anthropicKeyPreview : apiStatus?.openrouterKeyPreview}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <input
              type="password"
              placeholder={activeProvider === "anthropic" ? "sk-ant-..." : "sk-or-..."}
              value={activeProvider === "anthropic" ? anthropicKey : openrouterKey}
              onChange={(e) =>
                activeProvider === "anthropic"
                  ? setAnthropicKey(e.target.value)
                  : setOpenrouterKey(e.target.value)
              }
              className="flex-1 rounded-xl border bg-background px-4 py-3 text-[14px] font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              onClick={saveKeys}
              disabled={saving || !(activeProvider === "anthropic" ? anthropicKey : openrouterKey)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Key
            </button>
          </div>
          {message && (
            <p className={`mt-3 text-[13px] ${message.startsWith("Error") ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {message}
            </p>
          )}
        </div>
      </section>

      {/* Default Model */}
      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Default Model
        </h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Select which model to use for content generation. You can override this per-request.
        </p>
        <div className="mt-4 space-y-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setDefaultModel(model.id)}
              className={`flex w-full items-center justify-between rounded-xl border-2 px-5 py-4 text-left transition-all duration-150 ${
                defaultModel === model.id
                  ? "border-primary bg-primary/3"
                  : "border-transparent bg-card hover:border-border"
              }`}
            >
              <div>
                <p className="text-[14px] font-medium">{model.name}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{model.description}</p>
              </div>
              <div className="ml-6 text-right shrink-0">
                <p className="font-mono text-[13px] text-muted-foreground">
                  ${model.inputCostPer1M} <span className="text-muted-foreground/50">in</span>
                </p>
                <p className="font-mono text-[13px] text-muted-foreground">
                  ${model.outputCostPer1M} <span className="text-muted-foreground/50">out</span>
                </p>
                <p className="text-[11px] text-muted-foreground/50">per 1M tokens</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Test Connection */}
      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
          Connection Test
        </h2>
        <div className="mt-4 rounded-2xl border bg-card p-6">
          <p className="text-[14px] text-muted-foreground">
            Send a test message to verify your API key and model are working correctly.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={testConnection}
              disabled={testing}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Test Connection
            </button>
            {testResult && (
              <div className={`flex-1 rounded-xl px-4 py-3 text-[13px] ${
                testResult.success
                  ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
              }`}>
                {testResult.message}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
