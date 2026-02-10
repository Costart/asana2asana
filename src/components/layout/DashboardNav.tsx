"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function DashboardNav({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b border-outline-variant/30 bg-white">
      <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-display rounded-lg bg-primary px-2.5 py-1 text-sm font-extrabold tracking-wide text-on-primary">
            A2A
          </span>
          <span className="font-display text-lg font-extrabold text-on-surface">
            Asana2Asana
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-on-surface-variant">{email}</span>
          <Link href="/settings">
            <Button variant="text" size="sm">
              Settings
            </Button>
          </Link>
          <Button variant="outlined" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
