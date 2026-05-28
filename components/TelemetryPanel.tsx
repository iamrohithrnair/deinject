"use client";

import { AlertTriangle, CheckCircle, Cpu } from "lucide-react";
import type { SecurityTelemetry } from "@/lib/types";

interface TelemetryPanelProps {
  telemetry: SecurityTelemetry;
}

export function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  const offending = telemetry.segmentReport.find(
    (r) => r.exploitSignatureDetected
  )?.offendingTextFragment;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all shadow-2xl relative overflow-hidden backdrop-blur ${
        telemetry.isInjected
          ? "bg-red-950/20 border-red-900/60 text-red-200"
          : "bg-emerald-950/10 border-emerald-900/50 text-emerald-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/40 pb-3">
        <div className="flex items-center gap-2">
          {telemetry.isInjected ? (
            <AlertTriangle className="text-red-400" size={20} />
          ) : (
            <CheckCircle className="text-emerald-400" size={20} />
          )}
          <h3 className="font-extrabold text-xs uppercase tracking-wider font-mono">
            FUSED IMMUNITY MATRIX
          </h3>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-md font-mono border font-extrabold ${
            telemetry.isInjected
              ? "bg-red-900/40 border-red-700 text-red-200"
              : "bg-emerald-900/40 border-emerald-700 text-emerald-300"
          }`}
        >
          s_t VECTOR: {(telemetry.fusedThreatScore * 100).toFixed(0)}%
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="bg-slate-950/80 p-3.5 rounded-xl font-mono text-slate-300 border border-slate-800 leading-relaxed">
          <span className="text-slate-500 font-bold block mb-1.5 flex items-center gap-1">
            <Cpu size={12} />
            {" // Sandbox Evaluation Trace:"}
          </span>
          Remediation Routing Strategy triggered:{" "}
          <span className="text-indigo-400 font-bold">
            {telemetry.remediationAction}
          </span>
          .
        </div>

        {telemetry.isInjected && (
          <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl space-y-2">
            <span className="font-bold font-mono text-red-400 text-xs block">
              Isolated Exploit Signature:
            </span>
            <div className="font-mono text-[11px] text-red-300 bg-slate-950/90 p-3 rounded-lg border border-red-950 overflow-x-auto max-h-[140px] leading-relaxed whitespace-pre-wrap">
              {offending ||
                "Hidden adversarial systemic hijack parameters intercepted."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
