import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { AIProviderSetup } from "@/components/dashboard/AIProviderSetup";
import { createClient } from "@/lib/supabase/server";
import { getAIConfig } from "@/lib/ai-token";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const aiConfig = await getAIConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-on-surface">
          Settings
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Manage your account settings
        </p>
      </div>

      <AIProviderSetup currentProvider={aiConfig?.provider ?? null} />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium text-on-surface">Email</p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">User ID</p>
            <p className="text-sm text-on-surface-variant font-mono text-xs">
              {user?.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
