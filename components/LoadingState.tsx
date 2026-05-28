export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800/60 backdrop-blur-md">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-5 shadow-inner" />
      <p className="text-sm font-mono text-indigo-400 tracking-wide font-medium text-center px-6">
        Invoking Tavily Ingestion Engines &amp; Evaluating Segment-Level
        Consistency Multi-Passes...
      </p>
    </div>
  );
}
