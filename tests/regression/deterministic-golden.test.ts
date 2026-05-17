// Snapshot tests for generateDeterministicAnalysis.
// If a change is intended, update snapshots with: npx vitest -u

import { describe, it, expect } from 'vitest'
import { generateDeterministicAnalysis } from '@/lib/analysis'

const CASES = [
  { hash: 0, sec: false, perf: false },
  { hash: 1, sec: true, perf: false },
  { hash: 2, sec: true, perf: true },
  { hash: 40, sec: true, perf: true }, // risk-score cap branch
]

describe('generateDeterministicAnalysis snapshots', () => {
  for (const { hash, sec, perf } of CASES) {
    it(`hash=${hash} sec=${sec} perf=${perf} is unchanged`, () => {
      const result = generateDeterministicAnalysis(
        hash,
        '50.0',
        'golden-project',
        ['React', 'Node.js'],
        42,
        sec,
        perf
      )
      expect(result).toMatchSnapshot()
    })
  }
})
