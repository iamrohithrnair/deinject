import type { TavilyResult, TextSegment } from "../types";

export const MAX_SEGMENTS = 12;

export function segmentWebResults(results: TavilyResult[]): TextSegment[] {
  const segments: TextSegment[] = [];

  for (const r of results) {
    const chunks = r.content.split(/\n\n+/).filter((c) => c.trim().length > 30);
    for (const chunk of chunks) {
      if (segments.length >= MAX_SEGMENTS) {
        return segments;
      }
      segments.push({
        sourceUrl: r.url,
        sourceTitle: r.title,
        textChunk: chunk.trim(),
      });
    }
  }

  return segments;
}
