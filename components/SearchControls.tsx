"use client";

import { Search, Sparkles, Bug } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TestScenario {
  label: string;
  text: string;
  scenario?: "clean" | "ipi";
  hint: string;
}

interface SearchControlsProps {
  query: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: (searchQuery: string, scenario?: "clean" | "ipi") => void;
  scenarios: TestScenario[];
}

export function SearchControls({
  query,
  loading,
  onQueryChange,
  onSearch,
  scenarios,
}: SearchControlsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">
        Run a query through the firewall
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Type a question or use a preset below to exercise clean vs injected
        web context.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-5">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="e.g. high yield savings strategies…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onSearch(query);
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => onSearch(query)}
          disabled={loading || !query.trim()}
          className="w-full md:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 font-semibold text-sm text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200/50 active:scale-[0.98]"
        >
          {loading ? "Running pipeline…" : "Run pipeline"}
        </button>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Judge presets
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {scenarios.map((scenario) => {
            const isIpi = scenario.scenario === "ipi";
            return (
              <button
                key={scenario.label}
                type="button"
                onClick={() => onSearch(scenario.text, scenario.scenario)}
                disabled={loading}
                className={cn(
                  "text-left rounded-xl border p-4 transition-all hover:shadow-md disabled:opacity-60",
                  isIpi
                    ? "border-red-200 bg-red-50/50 hover:border-red-300"
                    : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {isIpi ? (
                    <Bug className="text-red-600" size={16} />
                  ) : (
                    <Sparkles className="text-emerald-600" size={16} />
                  )}
                  <span className="text-sm font-semibold text-slate-900">
                    {scenario.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {scenario.hint}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
