import { NextRequest, NextResponse } from "next/server";
import { getMockScenario } from "@/lib/fixtures/mock-poisoned-segments";
import { remediateContext } from "@/lib/remediation/state-machine";
import { generateAnswer, getCannedAnswer } from "@/lib/generation/summarize";

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

    const { segments, telemetry } = getMockScenario(scenario);
    const { summaryPrompt, activeAdUnit } = remediateContext(
      query,
      segments,
      telemetry
    );

    let answer: string;
    if (process.env.OPENAI_API_KEY) {
      answer = await generateAnswer(summaryPrompt);
    } else {
      answer = getCannedAnswer(query, telemetry.isInjected);
    }

    return NextResponse.json({
      answer,
      telemetry,
      segmentsProcessed: segments,
      advertisement: activeAdUnit,
      mock: true,
      scenario,
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
