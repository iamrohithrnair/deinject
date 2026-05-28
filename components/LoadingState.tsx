"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PipelineSteps, type PipelinePhase } from "@/components/PipelineSteps";
import { cn } from "@/lib/cn";

type ApiMode = "live" | "mock";

const PHASES: { phase: PipelinePhase; label: string; detail: string }[] = [
  {
    phase: "tavily",
    label: "Tavily search",
    detail: "Fetching web results for your query…",
  },
  {
    phase: "websentinel",
    label: "WebSentinel segmentation",
    detail: "Splitting pages into isolated context segments…",
  },
  {
    phase: "mana",
    label: "MANA MCP fusion",
    detail: "Running authority + divergence checks per segment…",
  },
  {
    phase: "remediation",
    label: "Remediation FSM",
    detail: "Routing PASSTHROUGH, truncation, or safe replay…",
  },
  {
    phase: "output",
    label: "Safe output",
    detail: "Composing sanitized answer and vetted ad unit…",
  },
];

interface LoadingStateProps {
  apiMode?: ApiMode;
}

export function LoadingState({ apiMode = "mock" }: LoadingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const current = PHASES[phaseIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((i) => (i < PHASES.length - 1 ? i + 1 : i));
    }, apiMode === "live" ? 2200 : 1400);
    return () => clearInterval(interval);
  }, [apiMode]);

  return (
    <div className="space-y-5">
      <PipelineSteps activePhase={current.phase} />
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Loader2
            className="mb-4 h-10 w-10 animate-spin text-indigo-600"
            aria-hidden
          />
          <p className="text-sm font-semibold text-slate-900">
            {apiMode === "live"
              ? "Live run — Cursor agent orchestrating MCP tools"
              : "Demo run — deterministic MCP tool chain"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Step {phaseIndex + 1} of {PHASES.length}
          </p>
        </div>
        <ul className="mt-8 space-y-2 max-w-md mx-auto" aria-live="polite">
          {PHASES.map((p, i) => {
            const status =
              i < phaseIndex ? "done" : i === phaseIndex ? "active" : "pending";
            return (
              <li
                key={p.phase}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-all",
                  status === "active" &&
                    "border-indigo-200 bg-indigo-50 text-indigo-900",
                  status === "done" &&
                    "border-emerald-200 bg-emerald-50/60 text-emerald-800",
                  status === "pending" &&
                    "border-slate-100 bg-slate-50/50 text-slate-400"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    status === "active" && "bg-indigo-600 text-white",
                    status === "done" && "bg-emerald-600 text-white",
                    status === "pending" && "bg-slate-200 text-slate-500"
                  )}
                >
                  {status === "done" ? "✓" : i + 1}
                </span>
                <div>
                  <span className="font-semibold block">{p.label}</span>
                  {status === "active" && (
                    <span className="text-slate-600 mt-0.5 block">{p.detail}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
