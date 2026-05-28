"use client";

import { cn } from "@/lib/cn";

const STEPS = [
  { n: 1, label: "Tavily", detail: "Web search ingest" },
  { n: 2, label: "WebSentinel", detail: "Segment isolation" },
  { n: 3, label: "MANA", detail: "MCP fusion tools" },
  { n: 4, label: "Remediation", detail: "Truncate or replay" },
  { n: 5, label: "Output", detail: "Safe answer + ad" },
] as const;

export type PipelinePhase =
  | "tavily"
  | "websentinel"
  | "mana"
  | "remediation"
  | "output";

const PHASE_TO_STEP: Record<PipelinePhase, number> = {
  tavily: 1,
  websentinel: 2,
  mana: 3,
  remediation: 4,
  output: 5,
};

interface PipelineStepsProps {
  activeStep?: number;
  activePhase?: PipelinePhase;
  compact?: boolean;
}

export function PipelineSteps({
  activeStep,
  activePhase,
  compact = false,
}: PipelineStepsProps) {
  const current =
    activeStep ?? (activePhase ? PHASE_TO_STEP[activePhase] : undefined);

  return (
    <nav
      aria-label="DeInject pipeline"
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        compact ? "p-3" : "p-4"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Pipeline (left → right)
      </p>
      <ol className="flex flex-wrap gap-2 sm:gap-0 sm:flex-nowrap sm:items-stretch">
        {STEPS.map((step, i) => {
          const isActive = current === step.n;
          const isDone = current !== undefined && step.n < current;
          return (
            <li
              key={step.n}
              className={cn(
                "flex flex-1 min-w-[88px] items-center gap-2 sm:flex-col sm:text-center sm:px-1",
                i < STEPS.length - 1 &&
                  "sm:relative sm:after:content-[''] sm:after:absolute sm:after:top-4 sm:after:left-[calc(50%+18px)] sm:after:w-[calc(100%-36px)] sm:after:h-px sm:after:bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                  isActive &&
                    "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200",
                  isDone && "border-violet-500 bg-violet-50 text-violet-700",
                  !isActive &&
                    !isDone &&
                    "border-slate-200 bg-slate-50 text-slate-500"
                )}
              >
                {step.n}
              </span>
              <div className="min-w-0">
                <span
                  className={cn(
                    "block text-xs font-semibold",
                    isActive ? "text-indigo-700" : "text-slate-800"
                  )}
                >
                  {step.label}
                </span>
                {!compact && (
                  <span className="block text-[10px] text-slate-500 truncate">
                    {step.detail}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
