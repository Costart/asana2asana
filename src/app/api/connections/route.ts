import { NextResponse } from "next/server";
import { getAsanaToken } from "@/lib/asana-token";
import { getAIConfig } from "@/lib/ai-token";
import { createClient } from "@/lib/supabase/server";
import { fetchProjectTasks } from "@/lib/asana";
import { generateSkill } from "@/lib/ai";
import type { CreateConnectionRequest } from "@/lib/types";

export async function POST(request: Request) {
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
      { error: "AI provider not configured. Go to Settings to connect one." },
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

  const body: CreateConnectionRequest = await request.json();
  if (!body.fromProject?.gid || !body.toProject?.gid) {
    return NextResponse.json(
      { error: "Both projects are required" },
      { status: 400 },
    );
  }

  try {
    // Delete any existing connection for this user
    await supabase.from("connections").delete().eq("user_id", user.id);

    // Create the connection
    const { data: connection, error: connError } = await supabase
      .from("connections")
      .insert({
        user_id: user.id,
        from_project_gid: body.fromProject.gid,
        from_project_name: body.fromProject.name,
        to_project_gid: body.toProject.gid,
        to_project_name: body.toProject.name,
      })
      .select()
      .single();

    if (connError) throw connError;

    // Fetch destination tasks and generate the initial skill
    const destinationTasks = await fetchProjectTasks(token, body.toProject.gid);
    const criteria = await generateSkill(aiConfig, destinationTasks);

    const { data: skill, error: skillError } = await supabase
      .from("skills")
      .insert({
        connection_id: connection.id,
        version: 1,
        criteria,
      })
      .select()
      .single();

    if (skillError) throw skillError;

    return NextResponse.json({ connection, skill });
  } catch (error) {
    console.error("Failed to create connection:", error);
    return NextResponse.json(
      { error: "Failed to create connection and generate skill" },
      { status: 500 },
    );
  }
}
