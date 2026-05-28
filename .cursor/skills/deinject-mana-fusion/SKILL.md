---
name: deinject-mana-fusion
description: MANA heterogeneous signal fusion — authority markers + contextual divergence into s_t.
---

# MANA Fusion

1. `mana_scan_authority_markers` — regex signals (SYSTEM NOTE, Ignore previous instructions, etc.)
2. `mana_score_contextual_divergence` — topic token overlap + risk keywords (crypto, affiliate, override)
3. `mana_fuse_threat_vector` — produces `fusedThreatScore` (0–1), `isInjected`, `segmentReport[]`

Higher s_t = more compromised. Threshold for remediation: s_t > 0.60 or any exploit signature.
