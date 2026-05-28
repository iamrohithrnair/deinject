"use client";

import { AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react";
import type { SecurityTelemetry } from "@/lib/types";
import { cn } from "@/lib/cn";

interface TelemetryPanelProps {
  telemetry: SecurityTelemetry;
}

export function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  const offending = telemetry.segmentReport.find(
    (r) => r.exploitSignatureDetected
  )?.offendingTextFragment;

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border shadow-sm",
        telemetry.isInjected
          ? "bg-red-50 border-red-200"
          : "bg-emerald-50 border-emerald-200"
      )}
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          {telemetry.isInjected ? (
            <AlertTriangle className="text-red-600" size={20} />
          ) : (
            <CheckCircle className="text-emerald-600" size={20} />
          )}
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Threat verdict
            </h3>
            <p className="text-[10px] text-slate-600">
              {telemetry.isInjected
                ? "Injection detected — remediation applied"
                : "All segments passed — safe to synthesize"}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-md font-mono font-bold border",
            telemetry.isInjected
              ? "bg-red-100 border-red-300 text-red-800"
              : "bg-emerald-100 border-emerald-300 text-emerald-800"
          )}
        >
          s_t = {(telemetry.fusedThreatScore * 100).toFixed(0)}%
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200 text-slate-700">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mb-1">
            <ShieldCheck size={12} />
            Remediation action
          </span>
          <span className="font-mono font-bold text-indigo-700">
            {telemetry.remediationAction}
          </span>
        </div>

        {telemetry.isInjected && (
          <div className="bg-white border border-red-200 p-4 rounded-xl space-y-2">
            <span className="font-semibold text-red-800 text-xs block">
              Isolated exploit fragment
            </span>
            <div className="font-mono text-[11px] text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 overflow-x-auto max-h-[140px] leading-relaxed whitespace-pre-wrap">
              {offending ||
                "Hidden adversarial instructions intercepted in a web segment."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
