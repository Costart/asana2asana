"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface AsanaProject {
  gid: string;
  name: string;
  workspace: { gid: string; name: string };
}

export function AsanaConnect({ isConnected }: { isConnected: boolean }) {
  const router = useRouter();
  const [projects, setProjects] = useState<AsanaProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromProject, setFromProject] = useState("");
  const [toProject, setToProject] = useState("");

  // PAT form state
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) return;

    setLoading(true);
    fetch("/api/asana/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isConnected]);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;

    setConnecting(true);
    setConnectError(null);

    try {
      const res = await fetch("/api/asana/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "Failed to connect";
        try {
          message = JSON.parse(text).error || message;
        } catch {}
        throw new Error(message);
      }

      setToken("");
      router.refresh();
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    await fetch("/api/asana/disconnect", { method: "POST" });
    router.refresh();
  }

  if (!isConnected) {
    return (
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Connect to Asana</CardTitle>
          <CardDescription>
            Enter your Asana Personal Access Token to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-surface-container p-4 space-y-3">
            <p className="text-sm font-medium text-on-surface">
              How to get your API key
            </p>
            <ol className="text-sm text-on-surface-variant space-y-2 list-decimal list-inside">
              <li>
                Open the{" "}
                <a
                  href="https://app.asana.com/0/developer-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Asana Developer Console
                </a>
              </li>
              <li>
                Go to the{" "}
                <span className="font-medium text-on-surface">
                  Personal access tokens
                </span>{" "}
                tab
              </li>
              <li>
                Click{" "}
                <span className="font-medium text-on-surface">
                  Create new token
                </span>
                , give it a name, and copy the token
              </li>
            </ol>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <Input
              id="asana-token"
              type="password"
              label="Personal Access Token"
              placeholder="1/1234567890123:abc..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              error={connectError ?? undefined}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                Your token is encrypted and stored securely.
              </p>
              <Button type="submit" disabled={connecting || !token.trim()}>
                {connecting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asana Projects</CardTitle>
          <CardDescription>Loading your projects...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading projects from Asana...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asana Projects</CardTitle>
          <CardDescription className="text-error">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outlined" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group projects by workspace
  const workspaces = projects.reduce<
    Record<string, { name: string; projects: AsanaProject[] }>
  >((acc, project) => {
    const wsGid = project.workspace?.gid ?? "unknown";
    if (!acc[wsGid]) {
      acc[wsGid] = {
        name: project.workspace?.name ?? "Workspace",
        projects: [],
      };
    }
    acc[wsGid].projects.push(project);
    return acc;
  }, {});

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Asana Projects</CardTitle>
            <CardDescription>
              Select the source and destination projects
            </CardDescription>
          </div>
          <Button variant="outlined" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="from-project"
              className="block text-sm font-medium text-on-surface-variant mb-2"
            >
              From Project
            </label>
            <select
              id="from-project"
              value={fromProject}
              onChange={(e) => setFromProject(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a project...</option>
              {Object.entries(workspaces).map(([wsGid, ws]) => (
                <optgroup key={wsGid} label={ws.name}>
                  {ws.projects.map((p) => (
                    <option
                      key={p.gid}
                      value={p.gid}
                      disabled={p.gid === toProject}
                    >
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="to-project"
              className="block text-sm font-medium text-on-surface-variant mb-2"
            >
              To Project
            </label>
            <select
              id="to-project"
              value={toProject}
              onChange={(e) => setToProject(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a project...</option>
              {Object.entries(workspaces).map(([wsGid, ws]) => (
                <optgroup key={wsGid} label={ws.name}>
                  {ws.projects.map((p) => (
                    <option
                      key={p.gid}
                      value={p.gid}
                      disabled={p.gid === fromProject}
                    >
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {fromProject && toProject && (
          <div className="mt-4 rounded-lg bg-primary-container p-3 text-sm text-on-primary-container">
            Ready to sync from{" "}
            <strong>{projects.find((p) => p.gid === fromProject)?.name}</strong>{" "}
            to{" "}
            <strong>{projects.find((p) => p.gid === toProject)?.name}</strong>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
