import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseYmd, periodStart, previousRange, ymd, ymdhms } from './dates.js'

// Четверг, 9 октября 2026, 14:05:09
const now = new Date(2026, 9, 8 + 1, 14, 5, 9)

const range = (period, at = now) => {
    const { from, to } = previousRange(period, at)
    return [ymd(from), ymdhms(to)]
}

test('ymd и parseYmd — туда и обратно без сдвига по поясу', () => {
    assert.equal(ymd(parseYmd('2026-03-01')), '2026-03-01')
})

test('periodStart', () => {
    assert.equal(ymd(periodStart('today', now)), '2026-10-09')
    assert.equal(ymd(periodStart('week', now)), '2026-10-05') // понедельник
    assert.equal(ymd(periodStart('week', new Date(2026, 9, 11))), '2026-10-05') // воскресенье
    assert.equal(ymd(periodStart('month', now)), '2026-10-01')
    assert.equal(ymd(periodStart('year', now)), '2026-01-01')
})

test('previousRange: тот же отрезок прошлого периода', () => {
    assert.deepEqual(range('today'), ['2026-10-08', '2026-10-08T14:05:09'])
    assert.deepEqual(range('week'), ['2026-09-28', '2026-10-02T14:05:09'])
    assert.deepEqual(range('month'), ['2026-09-01', '2026-09-09T14:05:09'])
    assert.deepEqual(range('year'), ['2025-01-01', '2025-10-09T14:05:09'])
})

test('previousRange: в прошлом месяце меньше дней', () => {
    assert.deepEqual(range('month', new Date(2026, 2, 31, 10)), ['2026-02-01', '2026-02-28T10:00:00'])
    // 29 февраля високосного года -> 28 февраля прошлого
    assert.deepEqual(range('year', new Date(2028, 1, 29, 10)), ['2027-01-01', '2027-02-28T10:00:00'])
})

test('previousRange: неделя через границу месяца', () => {
    // Понедельник 2 ноября -> понедельник 26 октября
    assert.deepEqual(range('week', new Date(2026, 10, 2, 9)), ['2026-10-26', '2026-10-26T09:00:00'])
})
