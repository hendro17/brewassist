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
| T3.7 | Fix 17x Web:InputWithoutLabelCheck Step1/Step3 | TODO | with Shadcn-Vue labeled form components | - |

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

## References
- Sonar workflow: `Herd/hitung-swdkllj/.github/workflows/build.yml` (SONAR scan v8.2.2 + gate v1.2.1).
- Sonar props: `Herd/hitung-swdkllj/sonar-project.properties`.
- CodeScene rules: `Herd/DeepEye-scanner-suite/.codescene/code-health-rules.json`.
- GitNexus index: `Herd/hitung-swdkllj/.gitnexus/gitnexus.json`.
- CI pattern: `Herd/DeepEye-scanner-suite/.github/workflows/ci.yml`.
