"use client";

import { Search } from "lucide-react";

export interface TestScenario {
  label: string;
  text: string;
  scenario?: "clean" | "ipi";
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
    <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-4 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Query pipeline entry point..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onSearch(query);
              }
            }}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm font-medium"
          />
        </div>
        <button
          type="button"
          onClick={() => onSearch(query)}
          disabled={loading || !query.trim()}
          className="w-full md:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/40 border border-indigo-500/20 active:scale-[0.98]"
        >
          {loading ? "Fusing Signals..." : "Initialize Run"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mr-2">
          Adversarial Suite:
        </span>
        {scenarios.map((scenario) => (
          <button
            key={scenario.label}
            type="button"
            onClick={() => onSearch(scenario.text, scenario.scenario)}
            className="text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-lg text-slate-300 hover:text-slate-100 transition-all shadow-inner"
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </section>
  );
}
