"use client";

import { Bot, Clock, Wrench } from "lucide-react";
import type { ToolTraceEntry } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ToolTracePanelProps {
  toolTrace?: ToolTraceEntry[];
  agentRunId?: string;
  pipelineMode?: string;
}

function formatPipelineMode(mode?: string) {
  if (!mode) return null;
  if (mode === "agent") return "Live — Cursor agent + MCP";
  if (mode === "mock-tools") return "Demo — deterministic MCP tools";
  return mode;
}

export function ToolTracePanel({
  toolTrace,
  agentRunId,
  pipelineMode,
}: ToolTracePanelProps) {
  const modeLabel = formatPipelineMode(pipelineMode);
  const entries = toolTrace ?? [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="text-indigo-600" size={18} />
          <h3 className="text-sm font-bold text-slate-900">
            Agent &amp; MCP Activity Log
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {modeLabel && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
              pipelineMode === "agent"
                ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                : "border-violet-200 bg-violet-50 text-violet-800"
            )}
          >
            <Bot size={12} />
            {modeLabel}
          </span>
        )}
        {agentRunId && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono text-slate-700">
            <span className="font-semibold text-slate-500">agentRunId:</span>
            {agentRunId}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-2">
          No tool trace returned for this run.
        </p>
      ) : (
        <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <li
              key={`${entry.tool}-${i}`}
              className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono font-semibold text-indigo-700">
                  {entry.tool}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono shrink-0">
                  <Clock size={10} />
                  step {i + 1}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{entry.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
