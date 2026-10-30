# BrewAssist — GitNexus scan (regenerated 2026-10-30)

Index: 283 nodes, 491 edges, 12 clusters, 9 flows (rebuilt via `analyze --index-only`).

## detect-changes --scope all (10 files, 39 symbols, 8 flows, risk HIGH)

HIGH berasal dari edit lintas flow aktif Wave 8 — wajar untuk working tree
pre-commit, bukan cacat arsitektur. Flow terdampak:

- HandleLlm → PostCompletions / IsRetryable / ExtractText / LlmBody / ThrowForStatus
- Tick → Start / IsDue, UseBrewTimer → Pause

Changed symbols utama: `handleLlm` (recipe.ts), `useBrewTimer/state/nextPour/tick`,
`gen` (Step2.vue), `pinia` (main.ts), `ls/getItem/setItem` (brew.test.ts stub).

## impact spot-check

- `handleLlm` upstream: 1 caller langsung, risk LOW, epistemic exact.
- `useBrewTimer` upstream (pre-reindex): UNKNOWN — index 6 commit behind saat itu;
  text search konfirmasi satu-satunya caller Step2.vue:46. Post-reindex perlu re-run.

## Catatan T5.2 lama

Klaim "findings/brewassist-gitnexus-scan.md, cycles clean" tak terverifikasi —
file tidak pernah ada di git history. Report ini menggantikannya.
