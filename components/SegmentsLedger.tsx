"use client";

import { ExternalLink, Layers } from "lucide-react";
import type { SecurityTelemetry, TextSegment } from "@/lib/types";
import { cn } from "@/lib/cn";

interface SegmentsLedgerProps {
  telemetry: SecurityTelemetry;
  segments: TextSegment[];
}

export function SegmentsLedger({ telemetry, segments }: SegmentsLedgerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
        <Layers className="text-violet-600" size={18} />
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            WebSentinel segments
          </h3>
          <p className="text-[10px] text-slate-500">
            Each chunk checked in isolation — red = exploit signature
          </p>
        </div>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {telemetry.segmentReport.map((report) => {
          const rawSeg = segments[report.index];
          if (!rawSeg) return null;
          return (
            <div
              key={report.index}
              className={cn(
                "border p-3.5 rounded-xl text-xs transition-all",
                report.exploitSignatureDetected
                  ? "bg-red-50 border-red-200"
                  : "bg-slate-50 border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold px-2 py-0.5 rounded",
                    report.exploitSignatureDetected
                      ? "bg-red-200 text-red-900"
                      : "bg-slate-200 text-slate-700"
                  )}
                >
                  Segment #{report.index} · consistency{" "}
                  {(report.consistencyScore * 100).toFixed(0)}%
                </span>
                <a
                  href={rawSeg.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-600"
                  title="Open source"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <p
                className={cn(
                  "font-mono text-[11px] leading-relaxed p-2.5 rounded border",
                  report.exploitSignatureDetected
                    ? "bg-white text-red-800 border-red-100"
                    : "bg-white text-slate-600 border-slate-100 line-clamp-2"
                )}
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
