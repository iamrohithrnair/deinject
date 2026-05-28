import { NextRequest, NextResponse } from "next/server";
import { hasCursorApiKey, CURSOR_API_KEY_ENV } from "@/lib/agent/env";
import { searchWeb } from "@/lib/ingestion/tavily";
import { segmentWebResults } from "@/lib/science/segmentation";

export const maxDuration = 120;

function missingKeysResponse() {
  return NextResponse.json(
    {
      error: `Live search requires TAVILY_API_KEY and ${CURSOR_API_KEY_ENV} in .env.local`,
    },
    { status: 503 }
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.TAVILY_API_KEY || !hasCursorApiKey()) {
      return missingKeysResponse();
    }

    const body = await req.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const { results } = await searchWeb(query);
    const segments = segmentWebResults(results);

    const { runDeinjectAgent } = await import("@/lib/agent/run-pipeline");
    const { response, agentRunId } = await runDeinjectAgent(query, segments);

    return NextResponse.json({
      ...response,
      agentRunId,
      pipelineMode: "agent",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
