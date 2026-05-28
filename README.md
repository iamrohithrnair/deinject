# DeInject

Segmented context-isolation firewall for AI web search. Mitigates Web-Based Indirect Prompt Injections (IPI) and malicious ad hijacking using the **WebSentinel** segmentation model and **MANA** heterogeneous signal fusion.

## Requirements

- Node.js **>= 20.9.0**
- `TAVILY_API_KEY` and `OPENAI_API_KEY` for live search (optional for mock demo)

## Setup

```bash
npm install
cp .env.local.example .env.local
# Add TAVILY_API_KEY and OPENAI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live vs Mock

| Mode | Endpoint | Keys required |
|------|----------|---------------|
| **Demo (Mock API)** | `POST /api/search/mock` | Optional (`OPENAI_API_KEY` for LLM answers; canned text if missing) |
| **Live (Tavily)** | `POST /api/search` | Both `TAVILY_API_KEY` and `OPENAI_API_KEY` (503 if missing) |

### Judge demo (recommended)

1. Toggle **Demo (Mock API)** in the header.
2. Click **Web Exploit Trigger (IPI)** — red telemetry, quarantined segments, firewall ad unit.
3. Click **Clean Vector Test** — green telemetry, legit banking ad.

### Live ingestion

1. Toggle **Live (Tavily)**.
2. Run a clean savings query with valid API keys.

## Scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # serve production build
npm run lint   # ESLint
```

## Architecture

- `lib/ingestion/tavily.ts` — web retrieval
- `lib/segmentation/web-sentinel.ts` — paragraph segmentation (max 12 segments)
- `lib/firewall/` — heuristics + `generateObject` (gpt-4o-mini) + Zod schema
- `lib/remediation/state-machine.ts` — passthrough / truncation / fallback
- `lib/generation/summarize.ts` — answer synthesis (gpt-4o)

See `PROMPT.md` for the full product specification.
