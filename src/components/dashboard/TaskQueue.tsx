"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { TaskCandidate, CandidateStatus } from "@/lib/types";

const POLL_INTERVAL = 60_000;

type Tab = "pending" | "moved" | "rejected" | "all";

interface TaskQueueProps {
  connectionId: string;
  onSkillRefined?: () => void;
}

// --- Score Bar ---
function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.7
      ? "bg-success"
      : score >= 0.4
        ? "bg-amber-500"
        : "bg-error";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-surface-container">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-on-surface-variant w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

// --- Task Card ---
function TaskCard({
  candidate,
  onReview,
}: {
  candidate: TaskCandidate;
  onReview: (id: string, action: "approve" | "reject", comment?: string) => void;
}) {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isPending = candidate.status === "pending";

  async function handleReview(action: "approve" | "reject") {
    setSubmitting(true);
    await onReview(candidate.id, action, comment || undefined);
    setSubmitting(false);
    setComment("");
    setShowComment(false);
  }

  return (
    <div className="rounded-xl border border-outline-variant/50 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface truncate">
            {candidate.task_name}
          </p>
          {candidate.task_notes && (
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
              {candidate.task_notes}
            </p>
          )}
        </div>
        {!isPending && (
          <span
            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              candidate.status === "moved"
                ? "bg-success-container text-on-success-container"
                : "bg-error-container text-on-error-container"
            }`}
          >
            {candidate.status === "moved" ? "Moved" : "Rejected"}
          </span>
        )}
      </div>

      <ScoreBar score={candidate.ai_score} />

      <p className="text-xs text-on-surface-variant italic">
        {candidate.ai_reasoning}
      </p>

      {candidate.user_comment && (
        <p className="text-xs text-on-surface-variant border-l-2 border-primary pl-2">
          {candidate.user_comment}
        </p>
      )}

      {isPending && (
        <div className="space-y-2">
          {showComment && (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (helps refine the skill)..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              rows={2}
            />
          )}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleReview("approve")}
              disabled={submitting}
            >
              {submitting ? "..." : "Approve & Move"}
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onClick={() => handleReview("reject")}
              disabled={submitting}
            >
              Reject
            </Button>
            <button
              onClick={() => setShowComment(!showComment)}
              className="ml-auto text-xs text-primary hover:underline"
            >
              {showComment ? "Hide comment" : "Add comment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Stats Bar ---
function StatsBar({
  stats,
  lastPolled,
}: {
  stats: { pending: number; moved: number; rejected: number };
  lastPolled: string | null;
}) {
  return (
    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
      <span>
        <strong className="text-on-surface">{stats.pending}</strong> pending
      </span>
      <span>
        <strong className="text-on-surface">{stats.moved}</strong> moved
      </span>
      <span>
        <strong className="text-on-surface">{stats.rejected}</strong> rejected
      </span>
      {lastPolled && (
        <span className="ml-auto">
          Last checked:{" "}
          {new Date(lastPolled).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}

// --- Main TaskQueue ---
export function TaskQueue({ connectionId, onSkillRefined }: TaskQueueProps) {
  const [tab, setTab] = useState<Tab>("pending");
  const [candidates, setCandidates] = useState<TaskCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [stats, setStats] = useState({ pending: 0, moved: 0, rejected: 0 });
  const [lastPolled, setLastPolled] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    const res = await fetch(
      `/api/connections/${connectionId}/candidates?status=${tab}`
    );
    if (res.ok) {
      const data = await res.json();
      setCandidates(data.candidates);
    }
  }, [connectionId, tab]);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/connections/active");
    if (res.ok) {
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.connection?.last_polled_at)
        setLastPolled(data.connection.last_polled_at);
    }
  }, []);

  const poll = useCallback(async () => {
    setPolling(true);
    try {
      await fetch(`/api/connections/${connectionId}/poll`, { method: "POST" });
      await fetchCandidates();
      await fetchStats();
    } finally {
      setPolling(false);
    }
  }, [connectionId, fetchCandidates, fetchStats]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCandidates(), fetchStats()]).finally(() =>
      setLoading(false)
    );
  }, [fetchCandidates, fetchStats]);

  // Auto-poll
  useEffect(() => {
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [poll]);

  async function handleReview(
    candidateId: string,
    action: "approve" | "reject",
    comment?: string
  ) {
    const res = await fetch(`/api/candidates/${candidateId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comment }),
    });

    if (res.ok) {
      const data = await res.json();
      // Remove from current list
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      await fetchStats();
      if (data.skillRefined && onSkillRefined) {
        onSkillRefined();
      }
    }
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "moved", label: "Moved", count: stats.moved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
    { key: "all", label: "All" },
  ];

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Task Queue</CardTitle>
          <Button
            size="sm"
            variant="tonal"
            onClick={poll}
            disabled={polling}
          >
            {polling ? "Checking..." : "Check Now"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatsBar stats={stats} lastPolled={lastPolled} />

        {/* Tabs */}
        <div className="flex gap-1 border-b border-outline-variant/50">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold h-4 min-w-4 px-1">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
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
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-on-surface-variant">
              {tab === "pending"
                ? "No pending tasks. New tasks will appear here when detected."
                : "No tasks in this category yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => (
              <TaskCard key={c.id} candidate={c} onReview={handleReview} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
