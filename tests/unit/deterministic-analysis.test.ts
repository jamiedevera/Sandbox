// Tests for the fallback analysis used when watsonx is not available.

import { describe, it, expect } from 'vitest'
import {
  generateDeterministicRiskScore,
  generateDeterministicAnalysis,
} from '@/lib/analysis'
import { validateAIResult } from '../helpers/ai-result-schema'

describe('generateDeterministicRiskScore', () => {
  it('matches golden values', () => {
    expect(generateDeterministicRiskScore(0, false, false)).toBe(50)
    expect(generateDeterministicRiskScore(0, true, false)).toBe(60)
    expect(generateDeterministicRiskScore(0, true, true)).toBe(65)
    expect(generateDeterministicRiskScore(100, false, false)).toBe(68)
    expect(generateDeterministicRiskScore(40, true, true)).toBe(95) // capped
  })

  it('stays within [50, 95] for every hash and flag combination', () => {
    for (let hash = 0; hash <= 300; hash++) {
      for (const sec of [false, true]) {
        for (const perf of [false, true]) {
          const score = generateDeterministicRiskScore(hash, sec, perf)
          expect(score).toBeGreaterThanOrEqual(50)
          expect(score).toBeLessThanOrEqual(95)
        }
      }
    }
  })

  it('issue flags never decrease the score', () => {
    for (let hash = 0; hash <= 300; hash++) {
      const base = generateDeterministicRiskScore(hash, false, false)
      expect(generateDeterministicRiskScore(hash, true, false)).toBeGreaterThanOrEqual(base)
      expect(generateDeterministicRiskScore(hash, false, true)).toBeGreaterThanOrEqual(base)
      expect(generateDeterministicRiskScore(hash, true, true)).toBeGreaterThanOrEqual(
        generateDeterministicRiskScore(hash, true, false)
      )
    }
  })
})

describe('generateDeterministicAnalysis', () => {
  const args = [12345, '48.0', 'demo', ['React', 'Node.js'], 30, false, false] as const

  it('same inputs give the same result', () => {
    const a = generateDeterministicAnalysis(...args)
    const b = generateDeterministicAnalysis(...args)
    expect(a).toEqual(b)
  })

  it('produces a module count of 3 + hash%3', () => {
    expect(generateDeterministicAnalysis(0, '1', 'p', [], 1, false, false).modules).toHaveLength(3)
    expect(generateDeterministicAnalysis(1, '1', 'p', [], 1, false, false).modules).toHaveLength(4)
    expect(generateDeterministicAnalysis(2, '1', 'p', [], 1, false, false).modules).toHaveLength(5)
  })

  it('returns an AIResult that satisfies the schema contract', () => {
    const result = generateDeterministicAnalysis(...args)
    const { valid, errors } = validateAIResult(result)
    expect(errors).toEqual([])
    expect(valid).toBe(true)
  })

  it('uses the deterministic risk score as risk_score', () => {
    const result = generateDeterministicAnalysis(12345, '48.0', 'demo', [], 30, true, true)
    expect(result.risk_score).toBe(generateDeterministicRiskScore(12345, true, true))
  })

  // TODO: check the module risk levels match the risk-score band
  it.todo('assigns module risk levels according to the risk-score band')
})
