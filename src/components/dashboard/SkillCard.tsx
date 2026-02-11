"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import type { SkillCriteria } from "@/lib/types";

interface SkillCardProps {
  criteria: SkillCriteria;
  version: number;
}

export function SkillCard({ criteria, version }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skill</CardTitle>
            <CardDescription>v{version}</CardDescription>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-on-surface">{criteria.summary}</p>

        {/* Include patterns */}
        <div>
          <p className="text-xs font-medium text-on-surface-variant mb-2">
            Include
          </p>
          <div className="flex flex-wrap gap-1.5">
            {criteria.includePatterns.themes.map((theme) => (
              <span
                key={theme}
                className="inline-flex items-center rounded-full bg-success-container px-2.5 py-0.5 text-xs font-medium text-on-success-container"
              >
                {theme}
              </span>
            ))}
            {criteria.includePatterns.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center rounded-full bg-primary-container px-2.5 py-0.5 text-xs font-medium text-on-primary-container"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Exclude patterns */}
        {(criteria.excludePatterns.themes.length > 0 ||
          criteria.excludePatterns.keywords.length > 0) && (
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">
              Exclude
            </p>
            <div className="flex flex-wrap gap-1.5">
              {criteria.excludePatterns.themes.map((theme) => (
                <span
                  key={theme}
                  className="inline-flex items-center rounded-full bg-error-container px-2.5 py-0.5 text-xs font-medium text-on-error-container"
                >
                  {theme}
                </span>
              ))}
              {criteria.excludePatterns.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center rounded-full bg-error-container px-2.5 py-0.5 text-xs font-medium text-on-error-container"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learned rules */}
        {criteria.learnedRules.length > 0 && (
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">
              Learned Rules
            </p>
            <ul className="space-y-1">
              {criteria.learnedRules.map((rule, i) => (
                <li key={i} className="text-xs text-on-surface-variant">
                  &bull; {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expanded view */}
        {expanded && (
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2">
              Task Characteristics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {criteria.includePatterns.taskCharacteristics.map((ch) => (
                <span
                  key={ch}
                  className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs text-on-surface-variant"
                >
                  {ch}
                </span>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              Confidence threshold: {criteria.confidenceThreshold}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
