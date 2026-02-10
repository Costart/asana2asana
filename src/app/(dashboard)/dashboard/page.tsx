import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { AsanaConnect } from "@/components/dashboard/AsanaConnect";
import { createClient } from "@/lib/supabase/server";
import { hasAsanaToken } from "@/lib/asana-token";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isConnected = await hasAsanaToken();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-on-surface">
          Dashboard
        </h1>
        <p className="mt-2 text-on-surface-variant">Welcome back!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-elevation-2 hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-on-surface-variant">
              Email: {user?.email}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              ID: {user?.id}
            </p>
          </CardContent>
        </Card>

        <AsanaConnect isConnected={isConnected} />
      </div>
    </div>
  );
}
