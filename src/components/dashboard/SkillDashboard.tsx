"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AsanaConnect } from "./AsanaConnect";
import { SkillCard } from "./SkillCard";
import { TaskQueue } from "./TaskQueue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Connection, Skill } from "@/lib/types";

interface SkillDashboardProps {
  isConnected: boolean;
  hasAIConfig: boolean;
}

export function SkillDashboard({
  isConnected,
  hasAIConfig,
}: SkillDashboardProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch("/api/connections/active");
      if (res.ok) {
        const data = await res.json();
        setConnection(data.connection);
        setSkill(data.skill);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchActive();
    } else {
      setLoading(false);
    }
  }, [isConnected, fetchActive]);

  const refreshSkill = useCallback(async () => {
    if (!connection) return;
    const res = await fetch(`/api/connections/${connection.id}/skill`);
    if (res.ok) {
      const data = await res.json();
      setSkill(data.skill);
    }
  }, [connection]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-on-surface-variant py-8">
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
        Loading...
      </div>
    );
  }

  // No AI provider configured — prompt user to set one up
  if (!hasAIConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Required</CardTitle>
          <CardDescription>
            Connect an AI provider to power skill learning and task
            classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-on-surface-variant mb-4">
            Go to Settings to connect your Anthropic, OpenAI, or Google Gemini
            API key.
          </p>
          <Link href="/settings">
            <Button>Go to Settings</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // No active connection yet — show project selection
  if (!connection || !skill) {
    return (
      <AsanaConnect
        isConnected={isConnected}
        hasActiveConnection={false}
        onConnectionCreated={fetchActive}
      />
    );
  }

  // Active connection with skill — show the full dashboard
  return (
    <div className="space-y-6">
      {/* Connection header */}
      <div className="rounded-xl border border-outline-variant/50 bg-white p-4 flex items-center justify-between">
        <div className="text-sm text-on-surface">
          <span className="text-on-surface-variant">From</span>{" "}
          <strong>{connection.from_project_name}</strong>
          <span className="text-on-surface-variant mx-2">&rarr;</span>
          <span className="text-on-surface-variant">To</span>{" "}
          <strong>{connection.to_project_name}</strong>
        </div>
      </div>

      {/* Skill + Task Queue */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SkillCard criteria={skill.criteria} version={skill.version} />
        </div>
        <div className="lg:col-span-2">
          <TaskQueue
            connectionId={connection.id}
            onSkillRefined={refreshSkill}
          />
        </div>
      </div>
    </div>
  );
}
