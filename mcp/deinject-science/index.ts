#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  handleBuildSanitizedContext,
  handleEmitPipelineResult,
  handleGetVettedAd,
  handleManaDivergence,
  handleManaFuse,
  handleManaScanAuthority,
  handleRemediationSelect,
  handleWebsentinelConsistency,
  handleWebsentinelSegment,
} from "../../lib/mcp/handlers";
import type { SearchResponse, SecurityTelemetry, TextSegment } from "../../lib/types";

const server = new Server(
  { name: "deinject-science", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const TOOLS = [
  {
    name: "websentinel_segment",
    description: "WebSentinel: split Tavily results into segments of interest (max 12)",
    inputSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
            },
            required: ["url", "title", "content"],
          },
        },
      },
      required: ["results"],
    },
  },
  {
    name: "mana_scan_authority_markers",
    description: "MANA: scan segments for authority-marker exploit signatures",
    inputSchema: {
      type: "object",
      properties: {
        segments: { type: "array" },
      },
      required: ["segments"],
    },
  },
  {
    name: "mana_score_contextual_divergence",
    description: "MANA: score topic alignment and high-risk divergence per segment",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        segments: { type: "array" },
      },
      required: ["query", "segments"],
    },
  },
  {
    name: "mana_fuse_threat_vector",
    description: "MANA: fuse authority + divergence into s_t and segment report",
    inputSchema: {
      type: "object",
      properties: {
        segments: { type: "array" },
        authority: { type: "array" },
        divergence: { type: "array" },
      },
      required: ["segments", "authority", "divergence"],
    },
  },
  {
    name: "websentinel_check_consistency",
    description: "WebSentinel: refine per-segment consistency scores",
    inputSchema: {
      type: "object",
      properties: {
        segmentReport: { type: "array" },
        authority: { type: "array" },
        divergence: { type: "array" },
      },
      required: ["segmentReport", "authority", "divergence"],
    },
  },
  {
    name: "remediation_select_action",
    description: "Select PASSTHROUGH | TARGETED_TRUNCATION | FALLBACK_SAFE_REPLAY",
    inputSchema: {
      type: "object",
      properties: {
        fusedThreatScore: { type: "number" },
        isInjected: { type: "boolean" },
        segmentReport: { type: "array" },
      },
      required: ["fusedThreatScore", "isInjected", "segmentReport"],
    },
  },
  {
    name: "build_sanitized_context",
    description: "Build sanitized context feed and synthesis prompt",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        segments: { type: "array" },
        telemetry: { type: "object" },
      },
      required: ["query", "segments", "telemetry"],
    },
  },
  {
    name: "get_vetted_ad_unit",
    description: "Return vetted ad unit (legit or firewall widget)",
    inputSchema: {
      type: "object",
      properties: {
        exploitTripped: { type: "boolean" },
      },
      required: ["exploitTripped"],
    },
  },
  {
    name: "emit_pipeline_result",
    description: "Terminal handoff: emit final SearchResponse JSON",
    inputSchema: {
      type: "object",
      properties: {
        answer: { type: "string" },
        telemetry: { type: "object" },
        segmentsProcessed: { type: "array" },
        advertisement: { type: "object" },
      },
      required: ["answer", "telemetry", "segmentsProcessed", "advertisement"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  try {
    let result: unknown;

    switch (name) {
      case "websentinel_segment":
        result = handleWebsentinelSegment(a.results as never);
        break;
      case "mana_scan_authority_markers":
        result = handleManaScanAuthority(a.segments as TextSegment[]);
        break;
      case "mana_score_contextual_divergence":
        result = handleManaDivergence(
          a.query as string,
          a.segments as TextSegment[]
        );
        break;
      case "mana_fuse_threat_vector":
        result = handleManaFuse(
          a.segments as TextSegment[],
          a.authority as never,
          a.divergence as never
        );
        break;
      case "websentinel_check_consistency":
        result = handleWebsentinelConsistency(
          a.segmentReport as SecurityTelemetry["segmentReport"],
          a.authority as never,
          a.divergence as never
        );
        break;
      case "remediation_select_action":
        result = handleRemediationSelect({
          fusedThreatScore: a.fusedThreatScore as number,
          isInjected: a.isInjected as boolean,
          segmentReport: a.segmentReport as SecurityTelemetry["segmentReport"],
        });
        break;
      case "build_sanitized_context":
        result = handleBuildSanitizedContext(
          a.query as string,
          a.segments as TextSegment[],
          a.telemetry as SecurityTelemetry
        );
        break;
      case "get_vetted_ad_unit":
        result = handleGetVettedAd(a.exploitTripped as boolean);
        break;
      case "emit_pipeline_result":
        result = handleEmitPipelineResult(a as unknown as SearchResponse);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: JSON.stringify({ error: message }) }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
