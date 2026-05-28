"use client";

import type { AdUnit, SecurityTelemetry } from "@/lib/types";

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
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between min-h-[490px] backdrop-blur-sm">
      <div>
        <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Sanitized Output Stream
          </span>
        </div>
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {answer}
        </div>
      </div>

      <div
        className={`mt-8 p-4 rounded-xl border transition-all shadow-lg ${
          telemetry.isInjected
            ? "bg-amber-950/10 border-amber-900/50 text-amber-200"
            : "bg-indigo-950/10 border-indigo-900/50 text-indigo-200"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block mb-0.5">
              Vetted Placement Stream
            </span>
            <h4 className="font-bold text-sm text-slate-100 tracking-tight">
              {advertisement.title}
            </h4>
          </div>
          <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 border border-slate-800 rounded text-slate-400 font-bold">
            CONTEXT_SECURE
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          {advertisement.description}
        </p>
        <a
          href={advertisement.link}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-all font-mono"
        >
          Audit Target URL Architecture →
        </a>
      </div>
    </div>
  );
}
