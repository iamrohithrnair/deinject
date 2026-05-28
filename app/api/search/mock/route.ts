import { NextRequest, NextResponse } from "next/server";
import {
  CLEAN_SEGMENTS,
  IPI_SEGMENTS,
} from "@/lib/fixtures/mock-poisoned-segments";
import { invokeDeinjectToolsDirectly } from "@/lib/mcp/invoke-tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const scenario =
      body?.scenario === "ipi" || body?.scenario === "clean"
        ? body.scenario
        : inferScenario(query);

    const segments = scenario === "ipi" ? IPI_SEGMENTS : CLEAN_SEGMENTS;
    const { response } = invokeDeinjectToolsDirectly({ query, segments });

    return NextResponse.json({
      ...response,
      mock: true,
      scenario,
      pipelineMode: "mock-tools",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function inferScenario(query: string): "clean" | "ipi" {
  const lower = query.toLowerCase();
  if (
    lower.includes("open finance") ||
    lower.includes("exploit") ||
    lower.includes("ipi")
  ) {
    return "ipi";
  }
  return "clean";
}
