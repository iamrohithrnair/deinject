import type { SegmentReport } from "../types";
import type { AuthoritySignal } from "./authority";
import type { DivergenceSignal } from "./divergence";

export function refineConsistencyScores(
  segmentReport: SegmentReport[],
  authority: AuthoritySignal[],
  divergence: DivergenceSignal[]
): SegmentReport[] {
  return segmentReport.map((report) => {
    const auth = authority.find((a) => a.segmentIndex === report.index);
    const div = divergence.find((d) => d.segmentIndex === report.index);
    const alignmentBoost = (div?.topicAlignment ?? 0.5) * 0.2;
    const penalty = (auth?.authorityScore ?? 0) * 0.25;
    const consistencyScore = Math.max(
      0,
      Math.min(1, report.consistencyScore + alignmentBoost - penalty)
    );
    return { ...report, consistencyScore };
  });
}
