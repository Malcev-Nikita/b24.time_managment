import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fmt, fmtDiff, splitHours } from './format.js'

test('fmt: часы и минуты', () => {
    assert.equal(fmt(0), '0м')
    assert.equal(fmt(59), '1м')
    assert.equal(fmt(3600), '1ч 0м')
    assert.equal(fmt(3 * 3600 + 25 * 60), '3ч 25м')
    assert.equal(fmt(undefined), '0м')
})

test('fmt: округление минут не даёт «60м»', () => {
    assert.equal(fmt(3599), '1ч 0м')
    assert.equal(fmt(7199), '2ч 0м')
    assert.deepEqual(splitHours(7199), { hours: 2, minutes: 0 })
})

test('fmtDiff: знак разницы', () => {
    assert.equal(fmtDiff(4800), '+1ч 20м')
    assert.equal(fmtDiff(-2700), '−45м')
    assert.equal(fmtDiff(0), '±0м')
})
