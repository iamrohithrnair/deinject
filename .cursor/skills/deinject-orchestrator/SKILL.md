---
name: deinject-orchestrator
description: Orchestrate DeInject WebSentinel + MANA pipeline via deinject-science MCP tools. Use when running live search security analysis.
---

# DeInject Orchestrator

Run tools in this exact order (segments are usually pre-loaded from Tavily):

1. `mana_scan_authority_markers` — `{ segments }`
2. `mana_score_contextual_divergence` — `{ query, segments }`
3. `mana_fuse_threat_vector` — `{ segments, authority: signals, divergence: signals }`
4. `websentinel_check_consistency` — `{ segmentReport, authority, divergence }`
5. `remediation_select_action` — `{ fusedThreatScore, isInjected, segmentReport }`
6. `build_sanitized_context` — `{ query, segments, telemetry }` (merge remediation into telemetry)
7. `get_vetted_ad_unit` — `{ exploitTripped }` where exploitTripped = isInjected OR fusedThreatScore > 0.6

Synthesize a user answer from sanitized context only. Call `emit_pipeline_result` with full SearchResponse JSON.

Never fabricate scores; use tool outputs.
