import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateTides } from '../src/calculator.js'

test('produces 24 predictions for one day', () => {
  const result = calculateTides(40.0, '2026-05-17')
  assert.equal(result.length, 24)
})

test('each prediction has hour and height fields', () => {
  const result = calculateTides(40.0, '2026-05-17')
  for (const point of result) {
    assert.equal(typeof point.hour, 'number')
    assert.equal(typeof point.height, 'number')
  }
})

test('latitude changes the predicted amplitudes', () => {
  const equator = calculateTides(0, '2026-05-17')
  const polar = calculateTides(89, '2026-05-17')
  assert.notDeepEqual(equator, polar)
})

test('hours are sequential from 0 to 23', () => {
  const result = calculateTides(40.0, '2026-05-17')
  for (let i = 0; i < result.length; i++) {
    assert.equal(result[i].hour, i)
  }
})
