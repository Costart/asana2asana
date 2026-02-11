import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setAIConfig, type AIProvider, AI_PROVIDERS } from "@/lib/ai-token";

async function validateKey(
  provider: AIProvider,
  apiKey: string,
): Promise<boolean> {
  try {
    switch (provider) {
      case "anthropic": {
        const client = new Anthropic({ apiKey });
        await client.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        });
        return true;
      }
      case "openai": {
        const client = new OpenAI({ apiKey });
        await client.chat.completions.create({
          model: "gpt-4o",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        });
        return true;
      }
      case "deepseek": {
        const dsClient = new OpenAI({
          apiKey,
          baseURL: "https://api.deepseek.com",
        });
        await dsClient.chat.completions.create({
          model: "deepseek-chat",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        });
        return true;
      }
      case "gemini": {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        await model.generateContent("Hi");
        return true;
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { provider, apiKey } = await request.json();

  if (!provider || !apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Provider and API key are required" },
      { status: 400 },
    );
  }

  if (!AI_PROVIDERS[provider as AIProvider]) {
    return NextResponse.json(
      { error: "Unsupported provider" },
      { status: 400 },
    );
  }

  const valid = await validateKey(provider as AIProvider, apiKey.trim());
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid API key. Please check your key and try again." },
      { status: 401 },
    );
  }

  await setAIConfig({
    provider: provider as AIProvider,
    apiKey: apiKey.trim(),
  });

  return NextResponse.json({ success: true });
}
