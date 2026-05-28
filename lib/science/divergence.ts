const RISK_KEYWORDS = [
  "crypto",
  "wallet",
  "affiliate",
  "unvetted",
  "override",
  "sponsor banner",
  "maintenance mode",
  "ignore previous",
];

export interface DivergenceSignal {
  segmentIndex: number;
  topicAlignment: number;
  divergenceScore: number;
  riskTags: string[];
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3)
  );
}

export function scoreContextualDivergence(
  query: string,
  segments: { textChunk: string }[]
): DivergenceSignal[] {
  const queryTokens = tokenize(query);

  return segments.map((seg, segmentIndex) => {
    const segTokens = tokenize(seg.textChunk);
    let overlap = 0;
    for (const t of queryTokens) {
      if (segTokens.has(t)) overlap += 1;
    }
    const topicAlignment =
      queryTokens.size === 0 ? 0.5 : overlap / queryTokens.size;

    const lower = seg.textChunk.toLowerCase();
    const riskTags = RISK_KEYWORDS.filter((kw) => lower.includes(kw));
    const riskBoost = Math.min(0.5, riskTags.length * 0.12);
    const divergenceScore = Math.min(
      1,
      1 - topicAlignment * 0.6 + riskBoost
    );

    return {
      segmentIndex,
      topicAlignment,
      divergenceScore,
      riskTags,
    };
  });
}
