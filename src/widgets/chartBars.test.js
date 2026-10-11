import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildBars } from './chartBars.js'

const now = new Date(2026, 9, 9, 14) // четверг, 9 октября 2026

test('today: 24 часа, подписи каждого третьего часа основные', () => {
    const bars = buildBars('today', { period: 'today', hours: [{ hour: 9, seconds: 600 }] }, now)
    assert.equal(bars.length, 24)
    assert.equal(bars[9].seconds, 600)
    assert.equal(bars[9].minor, false)
    assert.equal(bars[10].minor, true)
})

test('week: дни берутся от начала периода из отчёта', () => {
    // Браузер уже в понедельнике 12-го, а отчёт ещё за неделю с 5-го — столбики не съезжают
    const report = { period: 'week', from: '2026-10-05', days: [{ date: '2026-10-05', seconds: 100 }, { date: '2026-10-11', seconds: 50 }] }
    const bars = buildBars('week', report, new Date(2026, 9, 12, 0, 30))
    assert.deepEqual(bars.map((b) => b.seconds), [100, 0, 0, 0, 0, 0, 50])
})

test('week: отчёт за другой период не используется для дат', () => {
    const report = { period: 'month', from: '2026-10-01', days: [{ date: '2026-10-05', seconds: 100 }] }
    assert.equal(buildBars('week', report, now)[0].seconds, 100) // понедельник по now
})

test('month: недели Пн–Вс, крайние неполные', () => {
    const report = { period: 'month', from: '2026-10-01', days: [{ date: '2026-10-04', seconds: 10 }, { date: '2026-10-05', seconds: 20 }] }
    const bars = buildBars('month', report, now)
    assert.deepEqual(bars.map((b) => b.label), ['1–4', '5–11', '12–18', '19–25', '26–31'])
    assert.deepEqual(bars.slice(0, 2).map((b) => b.seconds), [10, 20])
})

test('year: дни суммируются по месяцам', () => {
    const report = { period: 'year', from: '2026-01-01', days: [{ date: '2026-02-01', seconds: 5 }, { date: '2026-02-28', seconds: 7 }] }
    const bars = buildBars('year', report, now)
    assert.equal(bars.length, 12)
    assert.equal(bars[1].seconds, 12)
})
