import { getCannedAnswer } from "../science/context";
import { isExploitTripped } from "../science/remediation";
import type {
  SearchResponse,
  SecurityTelemetry,
  TavilyResult,
  TextSegment,
  ToolTraceEntry,
} from "../types";
import {
  buildTelemetryFromSignals,
  handleBuildSanitizedContext,
  handleGetVettedAd,
  handleManaDivergence,
  handleManaFuse,
  handleManaScanAuthority,
  handleRemediationSelect,
  handleWebsentinelConsistency,
  handleWebsentinelSegment,
} from "./handlers";

export interface PipelineInput {
  query: string;
  results?: TavilyResult[];
  segments?: TextSegment[];
}

export interface PipelineOutput {
  response: SearchResponse;
  toolTrace: ToolTraceEntry[];
}

export function invokeDeinjectToolsDirectly(
  input: PipelineInput
): PipelineOutput {
  const toolTrace: ToolTraceEntry[] = [];
  const { query } = input;

  let segments: TextSegment[];
  if (input.segments) {
    segments = input.segments;
    toolTrace.push({
      tool: "websentinel_segment",
      summary: `Using ${segments.length} preloaded segments`,
    });
  } else if (input.results) {
    const segOut = handleWebsentinelSegment(input.results);
    segments = segOut.segments;
    toolTrace.push({
      tool: "websentinel_segment",
      summary: `Produced ${segments.length} segments`,
    });
  } else {
    throw new Error("Pipeline requires segments or Tavily results");
  }

  const authority = handleManaScanAuthority(segments);
  toolTrace.push({
    tool: "mana_scan_authority_markers",
    summary: `Scanned ${authority.signals.length} segments, ${authority.signals.reduce((n, s) => n + s.markerCount, 0)} markers`,
  });

  const divergence = handleManaDivergence(query, segments);
  toolTrace.push({
    tool: "mana_score_contextual_divergence",
    summary: `Divergence sweep on ${divergence.signals.length} segments`,
  });

  const fusion = handleManaFuse(segments, authority.signals, divergence.signals);
  toolTrace.push({
    tool: "mana_fuse_threat_vector",
    summary: `s_t=${(fusion.fusedThreatScore * 100).toFixed(0)}%, injected=${fusion.isInjected}`,
  });

  const consistency = handleWebsentinelConsistency(
    fusion.segmentReport,
    authority.signals,
    divergence.signals
  );
  toolTrace.push({
    tool: "websentinel_check_consistency",
    summary: `Refined ${consistency.segmentReport.length} consistency scores`,
  });

  const partial = {
    fusedThreatScore: fusion.fusedThreatScore,
    isInjected: fusion.isInjected,
    segmentReport: consistency.segmentReport,
  };

  const remediation = handleRemediationSelect(partial);
  const telemetry = {
    ...partial,
    remediationAction: remediation.remediationAction,
  };

  toolTrace.push({
    tool: "remediation_select_action",
    summary: remediation.remediationAction,
  });

  const context = handleBuildSanitizedContext(query, segments, telemetry);
  toolTrace.push({
    tool: "build_sanitized_context",
    summary: `Feed length ${context.processedContextFeed.length} chars`,
  });

  const exploitTripped = isExploitTripped(telemetry);
  const ad = handleGetVettedAd(exploitTripped);
  toolTrace.push({
    tool: "get_vetted_ad_unit",
    summary: ad.advertisement.id,
  });

  const answer = getCannedAnswer(query, telemetry.isInjected);

  const response: SearchResponse = {
    answer,
    telemetry,
    segmentsProcessed: segments,
    advertisement: ad.advertisement,
    toolTrace,
  };

  toolTrace.push({
    tool: "emit_pipeline_result",
    summary: "Pipeline complete (deterministic)",
  });

  return {
    response: { ...response, pipelineMode: "mock-tools" },
    toolTrace,
  };
}

/** Recompute telemetry from segments via science tools (for mock with fixtures). */
export function runSciencePipeline(
  query: string,
  segments: TextSegment[]
): SecurityTelemetry {
  return buildTelemetryFromSignals(segments, query);
}
