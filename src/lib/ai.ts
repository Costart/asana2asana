import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SkillCriteria, TaskEvaluation } from "./types";
import type { AsanaTask } from "./asana";
import type { AIConfig } from "./ai-token";

function taskToString(task: AsanaTask): string {
  const parts = [`Name: ${task.name}`];
  if (task.notes) parts.push(`Notes: ${task.notes.slice(0, 500)}`);
  if (task.tags?.length)
    parts.push(`Tags: ${task.tags.map((t) => t.name).join(", ")}`);
  if (task.assignee) parts.push(`Assignee: ${task.assignee.name}`);
  return parts.join("\n");
}

async function callLLM(
  config: AIConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  switch (config.provider) {
    case "anthropic": {
      const client = new Anthropic({ apiKey: config.apiKey });
      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      const block = response.content[0];
      if (block.type !== "text") throw new Error("Unexpected response type");
      return block.text;
    }

    case "openai": {
      const client = new OpenAI({ apiKey: config.apiKey });
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2048,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
      return response.choices[0]?.message?.content ?? "";
    }

    case "deepseek": {
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: "https://api.deepseek.com",
      });
      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        max_tokens: 2048,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
      return response.choices[0]?.message?.content ?? "";
    }

    case "gemini": {
      const genAI = new GoogleGenerativeAI(config.apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userPrompt);
      return result.response.text();
    }

    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}

function parseJSON<T>(text: string): T {
  const jsonMatch =
    text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    text.match(/(\{[\s\S]*\})/) ||
    text.match(/(\[[\s\S]*\])/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  return JSON.parse(jsonMatch[1].trim());
}

export async function generateSkill(
  config: AIConfig,
  destinationTasks: AsanaTask[],
): Promise<SkillCriteria> {
  const taskList = destinationTasks
    .filter((t) => !t.completed)
    .slice(0, 50)
    .map((t, i) => `${i + 1}. ${taskToString(t)}`)
    .join("\n\n");

  const system = `You are an analyst that identifies patterns in project tasks. You output only valid JSON with no additional text.`;

  const prompt = `Analyze these tasks from an Asana project and identify the common themes, patterns, and characteristics that define what belongs in this project.

Tasks:
${taskList}

Return a JSON object with this exact structure:
{
  "summary": "One sentence describing what this project is about",
  "includePatterns": {
    "themes": ["theme1", "theme2"],
    "keywords": ["keyword1", "keyword2"],
    "taskCharacteristics": ["characteristic1"]
  },
  "excludePatterns": {
    "themes": [],
    "keywords": [],
    "taskCharacteristics": []
  },
  "confidenceThreshold": 0.6,
  "learnedRules": []
}

Be specific about the themes and keywords you observe. Include 3-8 themes and 5-15 keywords.`;

  const text = await callLLM(config, system, prompt);
  return parseJSON<SkillCriteria>(text);
}

export async function evaluateTaskBatch(
  config: AIConfig,
  tasks: AsanaTask[],
  skill: SkillCriteria,
): Promise<TaskEvaluation[]> {
  if (tasks.length === 0) return [];

  const taskList = tasks
    .map((t, i) => `${i + 1}. [GID: ${t.gid}]\n${taskToString(t)}`)
    .join("\n\n");

  const system = `You are a task classifier. You evaluate whether tasks match a project's criteria. You output only valid JSON with no additional text.`;

  const prompt = `Given this skill (classification criteria):
${JSON.stringify(skill, null, 2)}

Evaluate each of these tasks and score how well they match the criteria (0.0 = no match, 1.0 = perfect match).

Tasks to evaluate:
${taskList}

Return a JSON array with one entry per task:
[
  { "task_gid": "...", "score": 0.85, "reasoning": "Brief explanation" }
]

Consider the include patterns, exclude patterns, and any learned rules. Be calibrated in your scores.`;

  const text = await callLLM(config, system, prompt);
  return parseJSON<TaskEvaluation[]>(text);
}

export async function refineSkill(
  config: AIConfig,
  currentSkill: SkillCriteria,
  feedback: Array<{
    task_name: string;
    task_notes: string | null;
    action: "approved" | "rejected";
    comment: string | null;
    ai_score: number;
  }>,
): Promise<SkillCriteria> {
  const feedbackList = feedback
    .map((f, i) => {
      const parts = [
        `${i + 1}. "${f.task_name}" — ${f.action.toUpperCase()} (AI scored: ${f.ai_score})`,
      ];
      if (f.task_notes) parts.push(`   Notes: ${f.task_notes.slice(0, 200)}`);
      if (f.comment) parts.push(`   User comment: ${f.comment}`);
      return parts.join("\n");
    })
    .join("\n\n");

  const system = `You are a learning system that refines classification criteria based on user feedback. You output only valid JSON with no additional text.`;

  const prompt = `Here is the current skill (classification criteria):
${JSON.stringify(currentSkill, null, 2)}

Here is recent user feedback on task classifications:
${feedbackList}

Update the skill criteria based on this feedback:
- If approved tasks had low scores, broaden the include patterns
- If rejected tasks had high scores, add exclude patterns or narrow includes
- Add specific learned rules based on user comments
- Adjust the confidence threshold if needed (raise if too many false positives, lower if too many false negatives)

Return the updated skill as a JSON object with the same structure. Keep existing patterns that still apply and add new ones from the feedback.`;

  const text = await callLLM(config, system, prompt);
  return parseJSON<SkillCriteria>(text);
}
