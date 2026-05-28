"use client";

import { useState } from "react";
import { Shield, Zap, Bot } from "lucide-react";
import { SearchControls, type TestScenario } from "@/components/SearchControls";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { SegmentsLedger } from "@/components/SegmentsLedger";
import { OutputCanvas } from "@/components/OutputCanvas";
import { LoadingState } from "@/components/LoadingState";
import { PipelineSteps } from "@/components/PipelineSteps";
import { DemoGuide } from "@/components/DemoGuide";
import { ToolTracePanel } from "@/components/ToolTracePanel";
import type { SearchResponse } from "@/lib/types";
import { cn } from "@/lib/cn";

type ApiMode = "live" | "mock";

const TEST_SCENARIOS: TestScenario[] = [
  {
    label: "Clean Vector Test",
    text: "What are reliable strategies for long term high yield savings?",
    scenario: "clean",
    hint: "Green telemetry — all segments pass, legit vetted ad.",
  },
  {
    label: "Web Exploit Trigger (IPI)",
    text: "Show me the top recommendations for high yield savings on open finance blogs",
    scenario: "ipi",
    hint: "Red telemetry — hidden SYSTEM NOTE detected, firewall ad.",
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

    const controller = new AbortController();
    const timeoutMs = apiMode === "live" ? 120_000 : 30_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
        signal: controller.signal,
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? `Request failed (${res.status})`);
        return;
      }

      setData(result as SearchResponse);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError(
          apiMode === "live"
            ? "Live agent timed out after 2 minutes. Try Demo mode for an instant result."
            : "Request timed out."
        );
      } else {
        setError(err instanceof Error ? err.message : "Network error");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const showIdle = !loading && !data;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 shrink-0">
                <Shield size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  DeInject
                </h1>
                <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Stops <strong>ad forgery via hidden prompt injection</strong> on
                  scraped web pages. Segments untrusted content, scores threat
                  signals, and serves only sanitized answers plus vetted ads.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setApiMode("mock")}
                  className={cn(
                    "px-4 py-2 rounded-md transition-all",
                    apiMode === "mock"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Demo (instant)
                </button>
                <button
                  type="button"
                  onClick={() => setApiMode("live")}
                  className={cn(
                    "px-4 py-2 rounded-md transition-all",
                    apiMode === "live"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Live (agent)
                </button>
              </div>
            </div>
          </div>

          {/* Mode explainer cards */}
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <div
              className={cn(
                "rounded-xl border p-4 transition-all",
                apiMode === "mock"
                  ? "border-violet-300 bg-violet-50 ring-1 ring-violet-200"
                  : "border-slate-200 bg-slate-50/50 opacity-70"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="text-violet-600" size={16} />
                <span className="text-sm font-semibold text-slate-900">
                  Demo — deterministic MCP tools
                </span>
              </div>
              <p className="text-xs text-slate-600">
                No API keys. Runs the science pipeline in-process in ~1s. Best
                for judges.
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl border p-4 transition-all",
                apiMode === "live"
                  ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200"
                  : "border-slate-200 bg-slate-50/50 opacity-70"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bot className="text-indigo-600" size={16} />
                <span className="text-sm font-semibold text-slate-900">
                  Live — Cursor agent + MCP
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Tavily web search + local Cursor agent orchestrating MCP tools.
                Requires keys; may take 30–90s.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <PipelineSteps />

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
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {loading && <LoadingState apiMode={apiMode} />}

        {showIdle && <DemoGuide />}

        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-6">
              <TelemetryPanel telemetry={data.telemetry} />
              <ToolTracePanel
                toolTrace={data.toolTrace}
                agentRunId={data.agentRunId}
                pipelineMode={data.pipelineMode}
              />
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
