import { cookies } from "next/headers";
import { encryptToken, decryptToken } from "./asana-token";

const COOKIE_NAME = "ai_config";

export type AIProvider = "anthropic" | "openai" | "gemini" | "deepseek";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

export const AI_PROVIDERS: Record<
  AIProvider,
  { label: string; placeholder: string }
> = {
  anthropic: { label: "Anthropic (Claude)", placeholder: "sk-ant-..." },
  openai: { label: "OpenAI (GPT)", placeholder: "sk-..." },
  gemini: { label: "Google (Gemini)", placeholder: "AIza..." },
  deepseek: { label: "DeepSeek", placeholder: "sk-..." },
};

export async function setAIConfig(config: AIConfig): Promise<void> {
  const cookieStore = await cookies();
  const value = `${config.provider}:${encryptToken(config.apiKey)}`;
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getAIConfig(): Promise<AIConfig | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    const colonIdx = cookie.value.indexOf(":");
    if (colonIdx === -1) return null;
    const provider = cookie.value.slice(0, colonIdx) as AIProvider;
    const encrypted = cookie.value.slice(colonIdx + 1);
    if (!AI_PROVIDERS[provider]) return null;
    return { provider, apiKey: decryptToken(encrypted) };
  } catch {
    return null;
  }
}

export async function clearAIConfig(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function hasAIConfig(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(COOKIE_NAME);
}
