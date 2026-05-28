import type { SegmentReport, SecurityTelemetry } from "../types";
import type { AuthoritySignal } from "./authority";
import type { DivergenceSignal } from "./divergence";

const INJECTION_THRESHOLD = 0.75;

export interface FusionInput {
  authority: AuthoritySignal[];
  divergence: DivergenceSignal[];
}

export function fuseThreatVector(input: FusionInput): Omit<
  SecurityTelemetry,
  "remediationAction"
> {
  const { authority, divergence } = input;
  const segmentReport: SegmentReport[] = [];
  let fusedThreatScore = 0;

  const count = Math.max(authority.length, divergence.length);

  for (let index = 0; index < count; index++) {
    const auth = authority.find((a) => a.segmentIndex === index) ?? {
      segmentIndex: index,
      markerCount: 0,
      authorityScore: 0,
      snippets: [],
    };
    const div = divergence.find((d) => d.segmentIndex === index) ?? {
      segmentIndex: index,
      divergenceScore: 0,
      riskTags: [],
      topicAlignment: 1,
    };

    const authoritySignal = Math.min(1, auth.markerCount * 0.38);
    const divergenceSignal = div.divergenceScore;
    const segmentThreat = authoritySignal * 0.55 + divergenceSignal * 0.45;

    const consistencyScore = Math.max(
      0,
      Math.min(1, 1 - segmentThreat * 0.95)
    );

    const exploitSignatureDetected =
      auth.markerCount > 0 ||
      divergenceSignal > 0.62 ||
      consistencyScore < 0.35;

    fusedThreatScore = Math.max(fusedThreatScore, segmentThreat);

    segmentReport.push({
      index,
      consistencyScore,
      exploitSignatureDetected,
      offendingTextFragment: exploitSignatureDetected
        ? auth.snippets[0] ?? div.riskTags.join(", ")
        : "",
    });
  }

  const exploitCount = segmentReport.filter(
    (r) => r.exploitSignatureDetected
  ).length;
  const isInjected =
    fusedThreatScore >= INJECTION_THRESHOLD ||
    (exploitCount > 0 && fusedThreatScore > 0.55);

  return {
    fusedThreatScore: Math.round(fusedThreatScore * 100) / 100,
    isInjected,
    segmentReport,
  };
}
