"use client";

import { FileText, Megaphone } from "lucide-react";
import type { AdUnit, SecurityTelemetry } from "@/lib/types";
import { cn } from "@/lib/cn";

interface OutputCanvasProps {
  answer: string;
  telemetry: SecurityTelemetry;
  advertisement: AdUnit;
}

export function OutputCanvas({
  answer,
  telemetry,
  advertisement,
}: OutputCanvasProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[490px]">
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <FileText className="text-indigo-600" size={18} />
          <div>
            <span className="text-sm font-bold text-slate-900 block">
              Safe answer (post-remediation)
            </span>
            <span className="text-[10px] text-slate-500">
              User-facing text with injected segments removed or replayed
            </span>
          </div>
        </div>
        <div className="max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </div>

      <div
        className={cn(
          "mt-8 p-4 rounded-xl border transition-all",
          telemetry.isInjected
            ? "bg-amber-50 border-amber-200"
            : "bg-indigo-50 border-indigo-200"
        )}
      >
        <div className="flex justify-between items-start mb-2 gap-3">
          <div className="flex items-start gap-2">
            <Megaphone
              className={cn(
                "shrink-0 mt-0.5",
                telemetry.isInjected ? "text-amber-600" : "text-indigo-600"
              )}
              size={16}
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-0.5">
                Vetted ad placement
              </span>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">
                {advertisement.title}
              </h4>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-white px-2 py-0.5 border border-slate-200 rounded text-emerald-700 font-bold shrink-0">
            CONTEXT_SECURE
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {advertisement.description}
        </p>
        <a
          href={advertisement.link}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-all"
        >
          View placement target →
        </a>
      </div>
    </div>
  );
}
