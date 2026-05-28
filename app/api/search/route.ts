import { NextRequest, NextResponse } from "next/server";
import { searchWeb } from "@/lib/ingestion/tavily";
import { segmentWebResults } from "@/lib/segmentation/web-sentinel";
import { scanHeuristicHints } from "@/lib/firewall/heuristics";
import { evaluateSegments } from "@/lib/firewall/evaluator";
import { remediateContext } from "@/lib/remediation/state-machine";
import { generateAnswer } from "@/lib/generation/summarize";

function missingKeysResponse() {
  return NextResponse.json(
    {
      error:
        "Live search requires TAVILY_API_KEY and OPENAI_API_KEY in .env.local",
    },
    { status: 503 }
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.TAVILY_API_KEY || !process.env.OPENAI_API_KEY) {
      return missingKeysResponse();
    }

    const body = await req.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const { results } = await searchWeb(query);
    const segments = segmentWebResults(results);
    const heuristicHints = scanHeuristicHints(segments);
    const telemetry = await evaluateSegments(query, segments, heuristicHints);
    const { summaryPrompt, activeAdUnit } = remediateContext(
      query,
      segments,
      telemetry
    );
    const answer = await generateAnswer(summaryPrompt);

    return NextResponse.json({
      answer,
      telemetry,
      segmentsProcessed: segments,
      advertisement: activeAdUnit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
