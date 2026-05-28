# PRODUCT SPECIFICATION: DEINJECT (OR CONTEXTSANITIZE)
## AI SEARCH NODE WITH SEGMENTED CONTEXT-ISOLATION FIREWALL

## 1. Scientific Foundations

1. **Segmented Context Consistency (WebSentinel Framework, 2026):** Parse untrusted web text into discrete Segments of Interest (S_i). Evaluate each segment independently against the user query. Trigger targeted truncation when segments contain administrative overrides or malicious ad directions.

2. **Heterogeneous Signal Fusion (MANA Framework, 2026):** Fuse textual authority markers and contextual divergence metrics into a rolling Ad-Relevance and Security Score (s_t) from 0.0 to 1.0.

## 2. Pipeline

Query → Tavily retrieval → WebSentinel segmentation → MANA tools (MCP) → Remediation FSM → Cursor agent synthesis → Sanitized answer + vetted ad unit.

**Live:** `lib/agent/run-pipeline.ts` drives a local Cursor agent with inline stdio MCP (`deinject-science`).

**Mock:** `lib/mcp/invoke-tools.ts` runs the same tool handlers in-process (deterministic, no agent).

## 3. Remediation thresholds

If `isInjected || fusedThreatScore > 0.60`:
- TARGETED_TRUNCATION: filter segments without exploit signatures
- FALLBACK_SAFE_REPLAY: flush context, firewall ad widget

## 4. APIs

- `POST /api/search` — live agent pipeline (503 without `TAVILY_API_KEY` / `CURSOR_API_KEY`)
- `POST /api/search/mock` — deterministic MCP tools on fixtures

## 5. UI

Split-screen SOC dashboard: telemetry + MCP tool trace left, sanitized output right. Live/Mock toggle. Adversarial suite presets.
