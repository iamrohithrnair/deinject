export interface TextSegment {
  sourceUrl: string;
  sourceTitle: string;
  textChunk: string;
}

export interface SegmentReport {
  index: number;
  consistencyScore: number;
  exploitSignatureDetected: boolean;
  offendingTextFragment: string;
}

export type RemediationAction =
  | "PASSTHROUGH"
  | "TARGETED_TRUNCATION"
  | "FALLBACK_SAFE_REPLAY";

export interface SecurityTelemetry {
  fusedThreatScore: number;
  isInjected: boolean;
  segmentReport: SegmentReport[];
  remediationAction: RemediationAction;
}

export interface AdUnit {
  id: string;
  title: string;
  description: string;
  link: string;
  isSafe: boolean;
}

export interface SearchResponse {
  answer: string;
  telemetry: SecurityTelemetry;
  segmentsProcessed: TextSegment[];
  advertisement: AdUnit;
}

export interface TavilyResult {
  url: string;
  title: string;
  content: string;
}
