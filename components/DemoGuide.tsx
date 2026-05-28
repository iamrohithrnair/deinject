"use client";

import { MousePointerClick, ToggleLeft, Activity } from "lucide-react";

const STEPS = [
  {
    icon: ToggleLeft,
    title: "Switch to Demo mode",
    body: "Use the Demo toggle above so runs use deterministic MCP tools — fast, reproducible for judges.",
  },
  {
    icon: MousePointerClick,
    title: 'Click "Web Exploit Trigger (IPI)"',
    body: "Runs a query crafted to surface an indirect prompt-injection payload hidden in a finance blog segment.",
  },
  {
    icon: Activity,
    title: "Watch red telemetry",
    body: "MANA fusion flags the exploit, remediation truncates the bad segment, and you still get a safe answer plus vetted ad.",
  },
] as const;

export function DemoGuide() {
  return (
    <section className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 p-8 text-center shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        How to demo (≈30 seconds)
      </h2>
      <p className="text-sm text-slate-600 mb-8 max-w-lg mx-auto">
        No README required — follow these three steps to show injection
        detection and remediation end to end.
      </p>
      <ol className="grid gap-4 sm:grid-cols-3 text-left max-w-4xl mx-auto">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-xl border border-white/80 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <step.icon className="text-indigo-500" size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
              {step.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
