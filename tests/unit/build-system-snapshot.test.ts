// Tests for buildSystemSnapshot — checks known zips give the expected result
// (file counts, stack, entry points, risk signals).

import { describe, it, expect } from 'vitest'
import { buildSystemSnapshot } from '@/lib/analysis'
import {
  loadFixtureZip,
  loadExpectedSnapshot,
  buildZip,
  FIXTURE_FILE_SIZE,
} from '../helpers/load-fixture'

const FIXTURES = ['minimal-node', 'react-ts-app', 'risky-secrets']

describe('buildSystemSnapshot - known fixtures', () => {
  for (const name of FIXTURES) {
    it(`${name}: produces exactly the expected snapshot`, () => {
      const snapshot = buildSystemSnapshot(loadFixtureZip(name), FIXTURE_FILE_SIZE)
      expect(snapshot).toEqual(loadExpectedSnapshot(name))
    })
  }

  it('react-ts-app: detects the stack with no duplicates', () => {
    const { stack } = buildSystemSnapshot(loadFixtureZip('react-ts-app'), FIXTURE_FILE_SIZE)
    expect(stack).toEqual(['React', 'JavaScript', 'Node.js'])
    expect(new Set(stack).size).toBe(stack.length)
  })

  it('risky-secrets: flags secrets, eval/exec, and non-localhost http', () => {
    const { risk_signals } = buildSystemSnapshot(loadFixtureZip('risky-secrets'), FIXTURE_FILE_SIZE)
    expect(risk_signals).toContain('Sensitive data detected in risky-secrets/config.js')
    expect(risk_signals).toContain('Dangerous function usage in risky-secrets/server.js')
    expect(risk_signals).toContain('Insecure HTTP detected in risky-secrets/config.js')
  })

  it('risky-secrets: does not flag http://localhost', () => {
    const { risk_signals } = buildSystemSnapshot(loadFixtureZip('risky-secrets'), FIXTURE_FILE_SIZE)
    expect(risk_signals.some((s) => s.includes('safe.js'))).toBe(false)
  })
})

describe('buildSystemSnapshot - edge cases', () => {
  it('excludes noise directories from all counts', () => {
    const zip = buildZip('noisy', {
      'app.js': "console.log('real code')",
      'node_modules/dep/index.js': 'module.exports = {}',
      '.next/cache/blob.js': 'cached',
    })
    const snapshot = buildSystemSnapshot(zip, FIXTURE_FILE_SIZE)
    expect(snapshot.file_stats.total_files).toBe(1)
    expect(snapshot.file_stats.code_files).toBe(1)
    expect(snapshot.risk_signals.every((s) => !s.includes('node_modules'))).toBe(true)
  })

  it('handles an empty archive without throwing', () => {
    const snapshot = buildSystemSnapshot(buildZip('empty', {}), FIXTURE_FILE_SIZE)
    expect(snapshot.file_stats.total_files).toBe(0)
    expect(snapshot.project_name).toBe('uploaded-project')
    expect(snapshot.project_summary).toBe('Unknown project with 0 code files')
  })

  // TODO: add a deep-nesting fixture to check the 20-folder cap
  it.todo('caps folder_structure.folders at 20 entries')

  // TODO: add a many-imports fixture to check the 15-node cap
  it.todo('caps dependency_graph.nodes at 15 and relationships at 30')

  // TODO: add a binary-file fixture to check it does not crash
  it.todo('skips binary files when scanning for imports and risk signals')

  // TODO: add a fixture with no entry point
  it.todo('uses the generic project summary when no entry point is found')
})
