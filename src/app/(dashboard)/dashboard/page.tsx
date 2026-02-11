import { SkillDashboard } from "@/components/dashboard/SkillDashboard";
import { createClient } from "@/lib/supabase/server";
import { hasAsanaToken } from "@/lib/asana-token";
import { hasAIConfig } from "@/lib/ai-token";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isConnected = await hasAsanaToken();
  const aiConfigured = await hasAIConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-on-surface">
          Dashboard
        </h1>
        <p className="mt-2 text-on-surface-variant">{user?.email}</p>
      </div>

      <SkillDashboard isConnected={isConnected} hasAIConfig={aiConfigured} />
    </div>
  );
}
