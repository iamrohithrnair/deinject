import { getFirewallAd, getLegitAd } from "../ads/registry";
import { scanAuthorityMarkers } from "../science/authority";
import { refineConsistencyScores } from "../science/consistency";
import { buildSanitizedContext } from "../science/context";
import { scoreContextualDivergence } from "../science/divergence";
import { fuseThreatVector } from "../science/fusion";
import type { AuthoritySignal } from "../science/authority";
import type { DivergenceSignal } from "../science/divergence";
import {
  isExploitTripped,
  selectRemediationAction,
} from "../science/remediation";
import { segmentWebResults } from "../science/segmentation";
import type {
  AdUnit,
  SearchResponse,
  SecurityTelemetry,
  TavilyResult,
  TextSegment,
} from "../types";

export function handleWebsentinelSegment(results: TavilyResult[]) {
  return { segments: segmentWebResults(results) };
}

export function handleManaScanAuthority(segments: TextSegment[]) {
  return { signals: scanAuthorityMarkers(segments) };
}

export function handleManaDivergence(query: string, segments: TextSegment[]) {
  return { signals: scoreContextualDivergence(query, segments) };
}

export function handleManaFuse(
  _segments: TextSegment[],
  authority: AuthoritySignal[],
  divergence: DivergenceSignal[]
) {
  const fused = fuseThreatVector({ authority, divergence });
  return {
    fusedThreatScore: fused.fusedThreatScore,
    isInjected: fused.isInjected,
    segmentReport: fused.segmentReport,
  };
}

export function handleWebsentinelConsistency(
  segmentReport: SecurityTelemetry["segmentReport"],
  authority: ReturnType<typeof scanAuthorityMarkers>,
  divergence: ReturnType<typeof scoreContextualDivergence>
) {
  return {
    segmentReport: refineConsistencyScores(
      segmentReport,
      authority,
      divergence
    ),
  };
}

export function handleRemediationSelect(
  partial: Pick<
    SecurityTelemetry,
    "fusedThreatScore" | "isInjected" | "segmentReport"
  >
) {
  return { remediationAction: selectRemediationAction(partial) };
}

export function handleBuildSanitizedContext(
  query: string,
  segments: TextSegment[],
  telemetry: SecurityTelemetry
) {
  return buildSanitizedContext(query, segments, telemetry);
}

export function handleGetVettedAd(exploitTripped: boolean): { advertisement: AdUnit } {
  return {
    advertisement: exploitTripped ? getFirewallAd() : getLegitAd(),
  };
}

export function handleEmitPipelineResult(result: SearchResponse) {
  return { ok: true, received: result };
}

export function buildTelemetryFromSignals(
  segments: TextSegment[],
  query: string
): SecurityTelemetry {
  const authority = scanAuthorityMarkers(segments);
  const divergence = scoreContextualDivergence(query, segments);
  const fusion = fuseThreatVector({ authority, divergence });
  const refined = refineConsistencyScores(
    fusion.segmentReport,
    authority,
    divergence
  );
  const partial = {
    fusedThreatScore: fusion.fusedThreatScore,
    isInjected: fusion.isInjected,
    segmentReport: refined,
  };
  const remediationAction = selectRemediationAction(partial);
  return { ...partial, remediationAction };
}
