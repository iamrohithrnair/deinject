import { z } from "zod";

export const securityTelemetrySchema = z.object({
  fusedThreatScore: z.number().min(0).max(1),
  isInjected: z.boolean(),
  segmentReport: z.array(
    z.object({
      index: z.number(),
      consistencyScore: z.number().min(0).max(1),
      exploitSignatureDetected: z.boolean(),
      offendingTextFragment: z.string(),
    })
  ),
  remediationAction: z.enum([
    "PASSTHROUGH",
    "TARGETED_TRUNCATION",
    "FALLBACK_SAFE_REPLAY",
  ]),
});

export type SecurityTelemetryOutput = z.infer<typeof securityTelemetrySchema>;
