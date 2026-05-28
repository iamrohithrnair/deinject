"use client";

import { useState } from "react";
import { Activity, Shield } from "lucide-react";
import { SearchControls, type TestScenario } from "@/components/SearchControls";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { SegmentsLedger } from "@/components/SegmentsLedger";
import { OutputCanvas } from "@/components/OutputCanvas";
import { LoadingState } from "@/components/LoadingState";
import type { SearchResponse } from "@/lib/types";
import { cn } from "@/lib/cn";

type ApiMode = "live" | "mock";

const TEST_SCENARIOS: TestScenario[] = [
  {
    label: "Clean Vector Test",
    text: "What are reliable strategies for long term high yield savings?",
    scenario: "clean",
  },
  {
    label: "Web Exploit Trigger (IPI)",
    text: "Show me the top recommendations for high yield savings on open finance blogs",
    scenario: "ipi",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiMode, setApiMode] = useState<ApiMode>("mock");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (
    searchQuery: string,
    scenario?: "clean" | "ipi"
  ) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const endpoint =
        apiMode === "mock" ? "/api/search/mock" : "/api/search";
      const body: Record<string, string> = { query: trimmed };
      if (apiMode === "mock" && scenario) {
        body.scenario = scenario;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? `Request failed (${res.status})`);
        return;
      }

      setData(result as SearchResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans select-none selection:bg-indigo-500/30">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-lg shadow-indigo-900/20 text-white border border-indigo-500/30">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-300">
              DeInject{" "}
              <span className="text-indigo-400 font-mono font-medium text-xs border border-indigo-900 px-2 py-0.5 rounded-md bg-indigo-950/40">
                Core-v16.2.6
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-Time Segmented Context Isolation &amp; In-Flight Token
              Sandboxing
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/60 p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setApiMode("live")}
              className={cn(
                "px-3 py-1.5 rounded-md transition-all",
                apiMode === "live"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Live (Tavily)
            </button>
            <button
              type="button"
              onClick={() => setApiMode("mock")}
              className={cn(
                "px-3 py-1.5 rounded-md transition-all",
                apiMode === "mock"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Demo (Mock API)
            </button>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-mono bg-slate-900/60 backdrop-blur px-3.5 py-2 rounded-lg border border-slate-800 text-slate-300">
            <Activity className="text-emerald-400 animate-pulse" size={14} />
            SIGNAL FUSION LOGS: BROADCASTING
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        <SearchControls
          query={query}
          loading={loading}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          scenarios={TEST_SCENARIOS}
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200 font-mono"
          >
            {error}
          </div>
        )}

        {loading && <LoadingState />}

        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-6">
              <TelemetryPanel telemetry={data.telemetry} />
              <SegmentsLedger
                telemetry={data.telemetry}
                segments={data.segmentsProcessed}
              />
            </div>
            <div className="lg:col-span-7">
              <OutputCanvas
                answer={data.answer}
                telemetry={data.telemetry}
                advertisement={data.advertisement}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
