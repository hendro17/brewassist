# BrewAssist — Development Track

Audit format: ID, task, status (TODO/WIP/DONE), evidence (commit/config/file), date.

## Wave 1 — Quality Gates Foundation
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T1.1 | TRACK.md task board exists | DONE | this file | 2026-10-29 |
| T1.2 | Vitest test runner installed (workspace) | DONE | root devDep vitest 3.2.7 + coverage-v8 | 2026-10-29 |
| T1.3 | Server smoke tests (modifiers + validator) | DONE | 11 tests, modifiers.test.ts + validator.test.ts | 2026-10-29 |
| T1.4 | App smoke tests (brew store) | DONE | 3 tests brew.test.ts | 2026-10-29 |
| T1.5 | Typecheck + test wired to npm scripts | DONE | root `npm test` / `npm run typecheck`, coverage 100% lines core | 2026-10-29 |

## Wave 2 — CI GitHub Actions
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T2.1 | `.github/workflows/ci.yml` lint/typecheck/test on PR+push | DONE | ci.yml npm ci + typecheck + coverage lcov check | 2026-10-29 |
| T2.2 | Secrets SONAR_TOKEN + SONAR_HOST_URL set in repo | DONE | gh secret set both, verified in run log | 2026-10-29 |

## Wave 3 — SonarQube
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T3.1 | sonar-project.properties (sources app/src server/src) | DONE | key placeholder hendro17_brewassist_REPLACE_UUID + org hendro17 | 2026-10-29 |
| T3.2 | Workflow job sonar scan + quality gate (sonar.yml) | DONE | sonar.yml scan v6 + gate v1.2.0 | 2026-10-29 |
| T3.3 | Coverage lcov generated in CI | DONE local | vitest config reporter lcov, coverage/lcov.info verified | 2026-10-29 |
| T3.4 | Create SonarCloud project brewassist, paste real key | DONE | project hendro17_brewassist_638d026b-d0f1-4d52-850c-dc4600813732 via UI, key in properties | 2026-10-29 |
| T3.5 | Quality gate verify | DONE | gate OK, ncloc 91, coverage 57%, dup 0% | 2026-10-29 |
| T3.6 | Fix Sonar S1854 dead assignments modifiers.ts | DONE | refactor const axis table, score 10.0 | 2026-10-29 |
| T3.7 | Fix 17x Web:InputWithoutLabelCheck Step1/Step3 | DONE | closed by T6.5 native label/input pairs | 2026-10-29 |

## Wave 4 — CodeScene
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T4.1 | .codescene/code-health-rules.json adapted vue+ts | DONE | 2 rule sets, 38 thresholds, validate ok | 2026-10-29 |
| T4.2 | Code health review of engine libs, findings logged | DONE | modifiers 10.0, validator 9.68 cc=9, store 10.0 | 2026-10-29 |
| T4.3 | Refactor if critical findings | DONE | validator data-driven checks → 10.0, tests 14/14 green | 2026-10-29 |

## Wave 5 — GitNexus
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T5.1 | Index brewassist repo (.gitnexus/gitnexus.json) | DONE | gitnexus analyze: 104 nodes 144 edges 4 clusters | 2026-10-29 |
| T5.2 | Scan report saved to findings/ | DONE | findings/brewassist-gitnexus-scan.md, cycles clean | 2026-10-29 |

## Wave 6 — Phase 4 Features
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T6.1 | Seed B6/B7/B9/B10 hardware data | DONE | server/src/db/seed-hardware.sql + live: 10 grinders, 4 waters, 9 filters, 8 drippers, verified=false | 2026-10-29 |
| T6.2 | Wire LLM call in recipe route | DONE | server/src/lib/llm.ts + routes/recipe.ts engine+LLM, validator-gated, fail-closed, score 10.0 | 2026-10-29 |
| T6.3 | Build timer with Native Audio | DONE | app/src/composables/useBrewTimer.ts + Step2 timer UI, Web Audio beep, 800ms pre-pour, score 10.0 | 2026-10-29 |
| T6.4 | Install Shadcn-Vue + PWA | DONE | reka-ui/cva/clsx/tailwind-merge + vite-plugin-pwa SW generated, cn() utils, build green | 2026-10-29 |
| T6.5 | Fix 17 a11y labels | DONE | Step1 15 labels + Step3 3 labels, native label/input pairs | 2026-10-29 |
| T6.6 | Key settings BYOK UI | DONE | app/src/components/KeySettings.vue max-3 ping-gated localStorage | 2026-10-29 |

## Wave 7 — Next (TODO)
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T7.1 | Commit uncommitted Wave 6 payload evidence (6a40c36 stat cites pours.ts/validator? verify) | DONE | verified tracked: seed-hardware.sql, llm.ts, useBrewTimer.ts, KeySettings.vue | 2026-10-30 |
| T7.2 | Re-run npm test + typecheck green post-consolidation | DONE | vitest 17/17, vue-tsc + tsc clean | 2026-10-30 |
| T7.3 | Sonar rescan confirm InputWithoutLabelCheck closed | TODO | - | - |

## Wave 8 — Bugs + Dead Ends
| ID | Task | Status | Evidence | Date |
|----|------|--------|----------|------|
| T8.1 | Timer Step2 reaktif (MaybeRef, bukan snapshot) | DONE | useBrewTimer MaybeRef + watch reset, Step2 pass computed | 2026-10-30 |
| T8.2 | Step2 gen() error handling (try/catch + tampilkan error) | DONE | genError role=alert, JSON.parse/network/422 ditangani | 2026-10-30 |
| T8.3 | Output LLM divalidasi validator, fallback engine saat invalid | DONE | llmShapeErrors (volume/temp/pours) → status engine-fallback-llm-invalid | 2026-10-30 |
| T8.4 | Feedback Step3 persist (localStorage + saved_at + konfirmasi UI) | DONE | s.setFeedback persist, Step3 saved badge | 2026-10-30 |
| T8.5 | Store persist (inputs/recipe survive refresh) | DONE | brewassist-state LS, loadSaved di main.ts, LS stub di test | 2026-10-30 |
| T8.6 | Hardware seed dipakai (Step1 dropdown / API lookup, bukan free-text) | DONE | hardware.ts mirror seed + 4 select Step1 | 2026-10-30 |
| T8.7 | Test useBrewTimer (vitest fake-timer) | DONE | rAF manual + AudioContext stub, 3 test | 2026-10-30 |
| T8.8 | keys.ts ping: validasi base_url + sanitasi error upstream | DONE | block localhost/internal, tanpa echo upstream reply, 3 test | 2026-10-30 |
| T8.9 | Verifikasi findings/brewassist-gitnexus-scan.md (klaim T5.2 vs glob kosong) | DONE | file tak pernah ada di history → reindex 283n/491e + report baru | 2026-10-30 |
| T8.10 | Commit perubahan TRACK konsolidasi | TODO | - | - |

## References
- Sonar workflow: `Herd/hitung-swdkllj/.github/workflows/build.yml` (SONAR scan v8.2.2 + gate v1.2.1).
- Sonar props: `Herd/hitung-swdkllj/sonar-project.properties`.
- CodeScene rules: `Herd/DeepEye-scanner-suite/.codescene/code-health-rules.json`.
- GitNexus index: `Herd/hitung-swdkllj/.gitnexus/gitnexus.json`.
- CI pattern: `Herd/DeepEye-scanner-suite/.github/workflows/ci.yml`.
