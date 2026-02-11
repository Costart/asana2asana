import { NextResponse } from "next/server";
import { getAsanaToken } from "@/lib/asana-token";
import { getAIConfig } from "@/lib/ai-token";
import { createClient } from "@/lib/supabase/server";
import { addTaskToProject } from "@/lib/asana";
import { refineSkill } from "@/lib/ai";
import type {
  ReviewRequest,
  TaskCandidate,
  Connection,
  Skill,
} from "@/lib/types";

const REFINEMENT_THRESHOLD = 5;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: candidateId } = await params;
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

  const body: ReviewRequest = await request.json();
  if (!body.action || !["approve", "reject"].includes(body.action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // Get the candidate and verify ownership
  const { data: candidate } = (await supabase
    .from("task_candidates")
    .select("*, connections!inner(user_id, to_project_gid, id)")
    .eq("id", candidateId)
    .single()) as {
    data: (TaskCandidate & { connections: Connection }) | null;
  };

  if (!candidate || candidate.connections.user_id !== user.id) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  try {
    const newStatus = body.action === "approve" ? "approved" : "rejected";

    // If approved, move the task to the destination project in Asana
    if (body.action === "approve") {
      await addTaskToProject(
        token,
        candidate.task_gid,
        candidate.connections.to_project_gid,
      );
    }

    // Update the candidate status
    await supabase
      .from("task_candidates")
      .update({
        status: body.action === "approve" ? "moved" : "rejected",
        user_comment: body.comment || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", candidateId);

    // Check if we should trigger skill refinement
    let skillRefined = false;
    const connectionId = candidate.connection_id;

    // Get latest skill
    const { data: latestSkill } = (await supabase
      .from("skills")
      .select("*")
      .eq("connection_id", connectionId)
      .order("version", { ascending: false })
      .limit(1)
      .single()) as { data: Skill | null };

    if (latestSkill) {
      // Count reviewed candidates since last skill version
      const { count: reviewedSinceSkill } = await supabase
        .from("task_candidates")
        .select("*", { count: "exact", head: true })
        .eq("connection_id", connectionId)
        .not("reviewed_at", "is", null)
        .gte("reviewed_at", latestSkill.created_at);

      if ((reviewedSinceSkill ?? 0) >= REFINEMENT_THRESHOLD) {
        // Get the feedback for refinement
        const { data: feedbackItems } = await supabase
          .from("task_candidates")
          .select("task_name, task_notes, status, user_comment, ai_score")
          .eq("connection_id", connectionId)
          .not("reviewed_at", "is", null)
          .gte("reviewed_at", latestSkill.created_at);

        if (feedbackItems && feedbackItems.length > 0) {
          const feedback = feedbackItems.map((f) => ({
            task_name: f.task_name,
            task_notes: f.task_notes,
            action: f.status as "approved" | "rejected",
            comment: f.user_comment,
            ai_score: f.ai_score,
          }));

          const newCriteria = await refineSkill(
            aiConfig,
            latestSkill.criteria,
            feedback,
          );

          await supabase.from("skills").insert({
            connection_id: connectionId,
            version: latestSkill.version + 1,
            criteria: newCriteria,
          });

          skillRefined = true;
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      skillRefined,
    });
  } catch (error) {
    console.error("Review failed:", error);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
