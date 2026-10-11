import { test } from 'node:test'
import assert from 'node:assert/strict'
import { aggregate, entriesUntil, summarize } from './report.js'

const entry = (TASK_ID, SECONDS, CREATED_DATE) => ({ TASK_ID: String(TASK_ID), SECONDS: String(SECONDS), CREATED_DATE })

const items = [
    entry(1, 3600, '2026-10-05T09:15:00+03:00'),
    entry(1, 1800, '2026-10-05T23:50:00+03:00'), // поздний вечер — день по поясу портала, не сервера
    entry(2, 600, '2026-10-06T10:00:00+03:00'),
]

test('summarize: итог и среднее по дням с записями', () => {
    assert.deepEqual(summarize(items), { totalSeconds: 6000, workedDays: 2, avgSeconds: 3000 })
    assert.deepEqual(summarize([]), { totalSeconds: 0, workedDays: 0, avgSeconds: 0 })
})

test('aggregate: задачи по убыванию времени, дни по убыванию даты', () => {
    const r = aggregate(items, { period: 'week', titles: new Map([[1, 'Первая']]) })

    assert.equal(r.entries, 3)
    assert.deepEqual(r.tasks.map((t) => [t.taskId, t.seconds, t.entries, t.title]), [
        [1, 5400, 2, 'Первая'],
        [2, 600, 1, 'Задача #2'],
    ])
    assert.deepEqual(r.days, [
        { date: '2026-10-06', seconds: 600 },
        { date: '2026-10-05', seconds: 5400 },
    ])
    assert.equal(r.hours, undefined)
})

test('aggregate: часы — только для «сегодня»', () => {
    const r = aggregate(items, { period: 'today' })
    assert.deepEqual(r.hours, [
        { hour: 9, seconds: 3600 },
        { hour: 10, seconds: 600 },
        { hour: 23, seconds: 1800 },
    ])
})

test('aggregate: задачи в работе без записей попадают в список', () => {
    const inProgress = new Map([[2, 'Вторая'], [7, 'Новая']])
    const r = aggregate(items, { period: 'week', inProgress })

    assert.equal(r.inProgress, 2)
    assert.deepEqual(r.tasks.map((t) => [t.taskId, t.seconds, t.inProgress, t.title]), [
        [1, 5400, false, 'Задача #1'],
        [2, 600, true, 'Вторая'],
        [7, 0, true, 'Новая'],
    ])
})

test('entriesUntil: обрезка по времени включительно', () => {
    assert.equal(entriesUntil(items, '2026-10-05T23:50:00').length, 2)
    assert.equal(entriesUntil(items, '2026-10-05T23:49:59').length, 1)
})
