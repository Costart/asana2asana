import { NextResponse } from "next/server";
import { getAsanaToken } from "@/lib/asana-token";
import { getAIConfig } from "@/lib/ai-token";
import { createClient } from "@/lib/supabase/server";
import { fetchProjectTasks } from "@/lib/asana";
import { evaluateTaskBatch } from "@/lib/ai";
import type { Connection, Skill } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = await getAsanaToken();
  if (!token) {
    return NextResponse.json(
      { error: "Not connected to Asana" },
      { status: 401 },
    );
  }

  const aiConfig = await getAIConfig();
  if (!aiConfig) {
    return NextResponse.json(
      { error: "AI provider not configured" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Verify connection belongs to user
  const { data: connection } = (await supabase
    .from("connections")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()) as { data: Connection | null };

  if (!connection) {
    return NextResponse.json(
      { error: "Connection not found" },
      { status: 404 },
    );
  }

  // Get latest skill
  const { data: skill } = (await supabase
    .from("skills")
    .select("*")
    .eq("connection_id", connection.id)
    .order("version", { ascending: false })
    .limit(1)
    .single()) as { data: Skill | null };

  if (!skill) {
    return NextResponse.json({ error: "No skill found" }, { status: 404 });
  }

  try {
    // Fetch source tasks
    const sourceTasks = await fetchProjectTasks(
      token,
      connection.from_project_gid,
    );
    const incompleteTasks = sourceTasks.filter((t) => !t.completed);

    // Get already-seen task GIDs
    const { data: existing } = await supabase
      .from("task_candidates")
      .select("task_gid")
      .eq("connection_id", connection.id);

    const seenGids = new Set((existing ?? []).map((e) => e.task_gid));
    const newTasks = incompleteTasks.filter((t) => !seenGids.has(t.gid));

    if (newTasks.length === 0) {
      // Update poll timestamp even if no new tasks
      await supabase
        .from("connections")
        .update({ last_polled_at: new Date().toISOString() })
        .eq("id", connection.id);

      return NextResponse.json({ newCandidates: 0 });
    }

    // Evaluate new tasks against the skill
    const evaluations = await evaluateTaskBatch(
      aiConfig,
      newTasks,
      skill.criteria,
    );

    // Insert candidates that meet the threshold (and also low-score ones for transparency)
    const candidates = evaluations.map((ev) => {
      const task = newTasks.find((t) => t.gid === ev.task_gid);
      return {
        connection_id: connection.id,
        task_gid: ev.task_gid,
        task_name: task?.name ?? "",
        task_notes: task?.notes ?? null,
        ai_score: ev.score,
        ai_reasoning: ev.reasoning,
        status:
          ev.score >= skill.criteria.confidenceThreshold
            ? "pending"
            : "rejected",
      };
    });

    if (candidates.length > 0) {
      const { error } = await supabase
        .from("task_candidates")
        .upsert(candidates, { onConflict: "connection_id,task_gid" });

      if (error) throw error;
    }

    // Update poll timestamp
    await supabase
      .from("connections")
      .update({ last_polled_at: new Date().toISOString() })
      .eq("id", connection.id);

    const pendingCount = candidates.filter(
      (c) => c.status === "pending",
    ).length;
    return NextResponse.json({ newCandidates: pendingCount });
  } catch (error) {
    console.error("Poll failed:", error);
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
