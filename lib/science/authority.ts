const AUTHORITY_PATTERNS = [
  /SYSTEM\s+(NOTE|UPDATE)/i,
  /ATTENTION\s+AI/i,
  /Ignore\s+previous\s+instructions/i,
  /IMPORTANT\s+DIRECTIVE/i,
  /\[SYSTEM\]/i,
  /maintenance\s+mode/i,
  /Override\s+all\s+safety/i,
];

export interface AuthoritySignal {
  segmentIndex: number;
  markerCount: number;
  authorityScore: number;
  snippets: string[];
}

export function scanAuthorityMarkers(
  segments: { textChunk: string }[]
): AuthoritySignal[] {
  return segments.map((seg, segmentIndex) => {
    const snippets: string[] = [];
    let markerCount = 0;

    for (const pattern of AUTHORITY_PATTERNS) {
      const match = seg.textChunk.match(pattern);
      if (match) {
        markerCount += 1;
        snippets.push(match[0]);
      }
    }

    const authorityScore = Math.min(1, markerCount * 0.35);

    return { segmentIndex, markerCount, authorityScore, snippets };
  });
}
