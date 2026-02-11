"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type AIProvider = "anthropic" | "openai" | "gemini" | "deepseek";

// Ordered by recommendation for structured classification tasks
const PROVIDER_ORDER: AIProvider[] = [
  "anthropic",
  "openai",
  "gemini",
  "deepseek",
];

const PROVIDERS: Record<
  AIProvider,
  {
    label: string;
    placeholder: string;
    help: string;
    rank: number;
    badge: string;
    note: string;
  }
> = {
  anthropic: {
    label: "Anthropic (Claude)",
    placeholder: "sk-ant-...",
    help: "Get your key from console.anthropic.com",
    rank: 1,
    badge: "Recommended",
    note: "Best at structured JSON output and nuanced pattern recognition. Most reliable for skill learning.",
  },
  openai: {
    label: "OpenAI (GPT-4o)",
    placeholder: "sk-...",
    help: "Get your key from platform.openai.com/api-keys",
    rank: 2,
    badge: "Great",
    note: "Strong all-rounder with excellent instruction following. Very reliable JSON output.",
  },
  gemini: {
    label: "Google (Gemini 2.0 Flash)",
    placeholder: "AIza...",
    help: "Get your key from aistudio.google.com/apikey",
    rank: 3,
    badge: "Good",
    note: "Fast and cost-effective. Good for high-volume task evaluation. Generous free tier.",
  },
  deepseek: {
    label: "DeepSeek",
    placeholder: "sk-...",
    help: "Get your key from platform.deepseek.com/api_keys",
    rank: 4,
    badge: "Budget",
    note: "Very affordable. Solid reasoning but can be less consistent with complex JSON structures.",
  },
};

interface AIProviderSetupProps {
  currentProvider?: AIProvider | null;
}

export function AIProviderSetup({ currentProvider }: AIProviderSetupProps) {
  const router = useRouter();
  const [provider, setProvider] = useState<AIProvider>(
    currentProvider ?? "anthropic",
  );
  const [apiKey, setApiKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!currentProvider;

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setConnecting(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: apiKey.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to connect");
      }

      setApiKey("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    await fetch("/api/ai/disconnect", { method: "POST" });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Provider</CardTitle>
            <CardDescription>
              {isConnected
                ? `Connected to ${PROVIDERS[currentProvider!].label}`
                : "Connect an AI provider to power skill learning"}
            </CardDescription>
          </div>
          {isConnected && (
            <Button variant="outlined" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="rounded-lg bg-success-container p-3 text-sm text-on-success-container">
            Using {PROVIDERS[currentProvider!].label} for AI classification. You
            can change the provider by disconnecting and reconnecting.
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            {/* Provider cards */}
            <div className="grid gap-2 sm:grid-cols-2">
              {PROVIDER_ORDER.map((key) => {
                const p = PROVIDERS[key];
                const selected = provider === key;
                const badgeColor =
                  p.rank === 1
                    ? "bg-success-container text-on-success-container"
                    : p.rank === 2
                      ? "bg-primary-container text-on-primary-container"
                      : "bg-surface-container text-on-surface-variant";
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setProvider(key)}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      selected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/[0.03]"
                        : "border-outline-variant/50 hover:border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-on-surface">
                        {p.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badgeColor}`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {p.note}
                    </p>
                  </button>
                );
              })}
            </div>

            <Input
              id="ai-api-key"
              type="password"
              label="API Key"
              placeholder={PROVIDERS[provider].placeholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              error={error ?? undefined}
            />

            <p className="text-xs text-on-surface-variant">
              {PROVIDERS[provider].help}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                Your key is encrypted and stored securely.
              </p>
              <Button type="submit" disabled={connecting || !apiKey.trim()}>
                {connecting ? "Validating..." : "Connect"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
