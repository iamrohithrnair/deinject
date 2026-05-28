---
name: deinject-websentinel
description: WebSentinel segmented context isolation — segmentation and per-segment consistency checks.
---

# WebSentinel Protocol

- `websentinel_segment`: split Tavily `results[]` into paragraph chunks (max 12, min 30 chars).
- `websentinel_check_consistency`: refine alignment scores after MANA fusion; never analyze segments as one monolithic block.

Each segment is evaluated independently against the user query vector.
