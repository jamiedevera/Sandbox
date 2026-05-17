# Accuracy Testing Strategy

How the Sandbox project's results are validated for accuracy, and how to extend
the suite. This document is the strategy; the suite itself lives in `tests/`.

## What "accuracy" means here

Sandbox turns an uploaded `.zip` into a deployment-risk simulation (risk score,
issue list, failure-cascade timeline). "Accuracy" splits into two halves, and
only one of them is verifiable:

- **Deterministic pipeline correctness.** The snapshot builder, hashing, scoring
  math, and UI derivations have a *knowable-correct answer* for a known input.
  These are validated **exactly**.
- **watsonx LLM output.** The model is non-deterministic and there is no
  real-world ground truth for "is this risk prediction correct." For LLM output,
  "accuracy" is redefined as **contract conformance + grounding**: valid schema,
  valid enums, `risk_score` in range, the prompt-requested event count, and
  output that echoes the detected snapshot rather than hallucinating.

**Explicitly out of scope:** real-world predictive calibration (does the
simulation match what actually happens in production). The deterministic fallback
even fabricates fixed issue text unrelated to the uploaded code — the app is a
simulation/demo, not a calibrated predictor. Validating that would need real
deployment-outcome data the project does not have.

## Tooling

- **Vitest** (`vitest run`) — sole new dependency; native TS/ESM, built-in
  snapshots. Config in `vitest.config.ts` (node environment, `@/*` alias).
- The pure analysis functions were extracted into `src/lib/analysis.ts` and the
  report math into `src/lib/utils.ts` so they can be unit-tested directly. This
  refactor is behaviour-preserving — `src/app/api/analyze/route.ts` imports them.

```bash
npm run test           # run the whole suite once
npm run test:watch     # watch mode while developing
npm run test:accuracy  # run + write accuracy-report.json + print a summary table
```

## 1. Scope — what is validated

### Deterministic outputs (exact match expected)

| ID | Output | Source |
|----|--------|--------|
| D1 | `simpleHash` integer | `lib/analysis` |
| D2 | file counts: `total_files` / `code_files` / `config_files` | `buildSystemSnapshot` |
| D3 | `stack[]` detection | `buildSystemSnapshot` |
| D4 | `entry_points[]` | `buildSystemSnapshot` |
| D5 | `folder_structure` (`folders` 20-cap, `key_files`) | `buildSystemSnapshot` |
| D6 | `risk_signals[]` (secrets / `eval`-`exec` / non-localhost HTTP) | `buildSystemSnapshot` |
| D7 | `dependency_graph` (`nodes` 15-cap, `relationships`) | `buildSystemSnapshot` |
| D8 | `project_name`, `project_summary` | `buildSystemSnapshot` |
| D9 | noise-directory filtering | `buildSystemSnapshot` |
| D10 | `generateDeterministicRiskScore` | `lib/analysis` |
| D11 | `generateDeterministicAnalysis` determinism | `lib/analysis` |
| D12 | `generateDeterministicAnalysis` module count / risk distribution | `lib/analysis` |
| D13 | `getRiskBadgeClass` | `lib/utils` |
| D14 | `getScoreColor` | `lib/utils` |
| D15 | `formatFileSize` | `lib/utils` |
| D16 | `computeDamage` | `lib/utils` |
| D17 | `estimateIncidentCost` | `lib/utils` |
| D18 | `getRecommendation` | `lib/utils` |
| D19 | `extractFirstJsonObject` | `lib/analysis` |

### Probabilistic / contract outputs

| ID | Output | Validated as |
|----|--------|--------------|
| P1 | watsonx `AIResult` shape | schema contract (`validateAIResult`) |
| P2 | enum validity (issue/event/module fields) | value ∈ enum |
| P3 | `risk_score` ∈ [0, 100] | range |
| P4 | `simulation` length ∈ [8, 12] | range (prompt-specified) |
| P5 | grounding — output echoes detected snapshot | equality vs snapshot |
| P6 | route always returns a valid `AIResult` | degradation contract |
| P7 | `_meta` correctness | exact |

## 2. Ground truth

- **Hand-labelled fixture archives** — committed source trees under
  `tests/fixtures/zips/<name>/`, each with a sibling `<name>.expected.json`
  stating the exact `SystemSnapshot` the deterministic pipeline must produce.
- **Golden values + known properties** — `simpleHash` and the scoring/cost/damage
  functions are pinned to hand-computed constants plus invariants (range,
  monotonicity, caps).
- **Recorded watsonx transcripts** — `tests/fixtures/watson-responses/*.txt` hold
  raw model output (valid + adversarial). They are the only stable ground truth
  possible for a non-deterministic model.

## 3. Metrics & thresholds

| Metric | Outputs | Threshold (CI gate) |
|--------|---------|---------------------|
| Exact-match | D1–D19 | 100% — any deviation fails CI |
| Set precision/recall/F1 | D3, D6 | F1 ≥ 0.95 across the corpus |
| File-count MAE | D2 | 0 across the corpus |
| Range / bounds | D10, P3, P4 | within bounds; D10 ∈ [50, 95] |
| Monotonicity | D10 | non-decreasing in both issue flags |
| Schema conformance | P1, P2, P6 | route output 100% valid |
| Latency | `buildSystemSnapshot` | < 500 ms soft / < 2 s hard |

CI fails on: any deterministic test failure, any un-updated snapshot mismatch,
route contract < 100%, or detection F1 < 0.95.

## 4. Test layout

```
tests/
  unit/          per-function exact-match tests (D1-D19)
  integration/   full /api/analyze pipeline + watsonx contract (P1-P7)
  regression/    toMatchSnapshot() drift locks
  fixtures/
    zips/<name>/             committed source trees (built into zips in memory)
    zips/<name>.expected.json hand-labelled expected snapshot
    watson-responses/*.txt   recorded model transcripts
  helpers/
    load-fixture.ts      loadFixtureZip / buildZip / loadExpectedSnapshot / loadWatsonResponse
    ai-result-schema.ts  validateAIResult() contract validator
    run-accuracy.mjs     accuracy-report runner
```

Two regression mechanisms, kept distinct: the `.expected.json` files assert
**correctness** (`toEqual`); the `regression/` snapshots assert **stability**
(`toMatchSnapshot`) and catch drift in fields nobody hand-labelled.

ZIP fixtures are committed as plain source trees, never as binary `.zip` files —
`loadFixtureZip()` builds the archive in memory with `adm-zip` (the same library
the production pipeline uses), with sorted entry order for byte-determinism.

## 5. Adding a test case

**A new zip fixture (deterministic accuracy):**

1. Create `tests/fixtures/zips/<name>/` and add source files.
2. Add `<name>` to the `FIXTURES` array in both
   `tests/unit/build-system-snapshot.test.ts` and
   `tests/regression/snapshot-golden.test.ts`.
3. Run `npx vitest run -u tests/regression/snapshot-golden.test.ts` to generate
   the golden snapshot.
4. Open `tests/regression/__snapshots__/snapshot-golden.test.ts.snap`, **verify
   by hand** that your fixture's snapshot is correct, then copy it into
   `tests/fixtures/zips/<name>.expected.json`.
5. `npm run test` — the `toEqual` test now locks that hand-verified result.

**A new watsonx transcript (contract):** drop the raw model text into
`tests/fixtures/watson-responses/<name>.txt` and add `<name>` to the
`RECORDED_RESPONSES` array in `tests/integration/watson-contract.test.ts`.

**Edge cases still to cover** are marked `it.todo(...)` in the suite — empty
archive, deep nesting (folder cap), many imports (node cap), binary files, mixed
stacks, no-entry-point, and adversarial truncated/empty model output.

## 6. Reporting

`npm run test:accuracy` runs the suite, prints a per-layer pass/fail/todo table,
and writes `accuracy-report.json`. CI (`.github/workflows/test.yml`) runs it on
every push and pull request and uploads that report as a build artifact.

The live watsonx smoke test (`tests/integration/watson-live.smoke.test.ts`) is
**skipped unless `WATSONX_API_KEY` and `WATSONX_PROJECT_ID` are set** — it never
runs in CI and never calls the paid API by default.

## Assumptions on file

- The deterministic fallback's issue/simulation text is **fixed boilerplate**, not
  derived from the upload; tests assert its *structure and determinism*, never
  that its content describes the actual code.
- Known gap: `/api/analyze` only re-validates `risk_score`. watsonx JSON that is
  structurally valid but missing `summary`/`issues`/`simulation` passes straight
  through. This is flagged as an `it.todo` in `analyze-route.test.ts`; adopting
  `validateAIResult` in the route would close it.
