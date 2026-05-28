const AUTHORITY_PATTERNS = [
  /SYSTEM\s+(NOTE|UPDATE)/i,
  /ATTENTION\s+AI/i,
  /Ignore\s+previous\s+instructions/i,
  /IMPORTANT\s+DIRECTIVE/i,
  /\[SYSTEM\]/i,
];

export interface HeuristicHint {
  segmentIndex: number;
  markerCount: number;
  snippets: string[];
}

export function scanHeuristicHints(
  segments: { textChunk: string }[]
): HeuristicHint[] {
  return segments.map((seg, index) => {
    const snippets: string[] = [];
    let markerCount = 0;

    for (const pattern of AUTHORITY_PATTERNS) {
      const match = seg.textChunk.match(pattern);
      if (match) {
        markerCount += 1;
        snippets.push(match[0]);
      }
    }

    return { segmentIndex: index, markerCount, snippets };
  });
}
