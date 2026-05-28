"use client";

import { ExternalLink, Layers } from "lucide-react";
import type { SecurityTelemetry, TextSegment } from "@/lib/types";

interface SegmentsLedgerProps {
  telemetry: SecurityTelemetry;
  segments: TextSegment[];
}

export function SegmentsLedger({ telemetry, segments }: SegmentsLedgerProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Layers className="text-slate-400" size={16} />
        <h3 className="text-xs font-extrabold font-mono uppercase tracking-widest text-slate-400">
          WebSentinel Content Segments
        </h3>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {telemetry.segmentReport.map((report) => {
          const rawSeg = segments[report.index];
          if (!rawSeg) return null;
          return (
            <div
              key={report.index}
              className={`border p-3.5 rounded-xl text-xs transition-all ${
                report.exploitSignatureDetected
                  ? "bg-red-950/20 border-red-900/50 shadow-lg shadow-red-950/20"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    report.exploitSignatureDetected
                      ? "bg-red-900/40 text-red-300"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  SEGMENT #{report.index} (Consistency:{" "}
                  {(report.consistencyScore * 100).toFixed(0)}%)
                </span>
                <a
                  href={rawSeg.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-slate-300"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <p
                className={`font-mono text-[11px] leading-relaxed p-2.5 rounded border ${
                  report.exploitSignatureDetected
                    ? "bg-slate-950 text-red-400/90 border-red-900/40"
                    : "bg-slate-900/40 text-slate-400 border-slate-800/60 line-clamp-2"
                }`}
              >
                {rawSeg.textChunk}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
