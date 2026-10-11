// Сборка сводки из записей учёта времени — чистые функции без запросов.
// Без импортов, чтобы их можно было гонять в node --test

// CREATED_DATE приходит в ISO с поясом портала: "2026-07-05T12:34:56+03:00".
// День и час берём срезом строки — new Date() сдвинул бы их в пояс сервера
const dayOf = (entry) => String(entry.CREATED_DATE).slice(0, 10)
const hourOf = (entry) => Number(String(entry.CREATED_DATE).slice(11, 13))

// Итог, число рабочих дней и среднее за рабочий день — по дням, где есть хотя бы одна запись
export function summarize(items) {
    let totalSeconds = 0
    const days = new Set()
    for (const i of items) {
        totalSeconds += Number(i.SECONDS) || 0
        days.add(dayOf(i))
    }
    return {
        totalSeconds,
        workedDays: days.size,
        avgSeconds: days.size ? Math.round(totalSeconds / days.size) : 0,
    }
}

// Записи до момента to включительно: to — "2026-07-02T14:05:09" в том же поясе, что и записи
export function entriesUntil(items, to) {
    return items.filter((i) => String(i.CREATED_DATE).slice(0, 19) <= to)
}

// items — записи за период, inProgress — Map(id -> title) задач в работе,
// titles — Map(id -> title) остальных задач
export function aggregate(items, { period, inProgress = new Map(), titles = new Map() }) {
    const byTask = new Map()
    const byDay = new Map()
    const byHour = new Map()

    for (const i of items) {
        const sec = Number(i.SECONDS) || 0

        const taskId = Number(i.TASK_ID)
        const t = byTask.get(taskId) || { taskId, seconds: 0, entries: 0 }
        t.seconds += sec
        t.entries += 1
        byTask.set(taskId, t)

        const day = dayOf(i)
        byDay.set(day, (byDay.get(day) || 0) + sec)

        const hour = hourOf(i)
        byHour.set(hour, (byHour.get(hour) || 0) + sec)
    }

    // Задачи в работе попадают в список, даже если за период по ним ещё нет записей.
    // Время идущего таймера не учитывается: REST его не отдаёт, запись появляется после паузы
    for (const taskId of inProgress.keys())
        if (!byTask.has(taskId)) byTask.set(taskId, { taskId, seconds: 0, entries: 0 })

    const tasks = [...byTask.values()]
        .map((t) => ({
            ...t,
            title: inProgress.get(t.taskId) || titles.get(t.taskId) || `Задача #${t.taskId}`,
            inProgress: inProgress.has(t.taskId),
        }))
        .sort((a, b) => b.seconds - a.seconds)

    const days = [...byDay.entries()]
        .map(([date, seconds]) => ({ date, seconds }))
        .sort((a, b) => b.date.localeCompare(a.date))

    // Почасовая разбивка имеет смысл только для "сегодня"
    const hours = period === 'today'
        ? [...byHour.entries()]
            .map(([hour, seconds]) => ({ hour, seconds }))
            .sort((a, b) => a.hour - b.hour)
        : undefined

    return {
        ...summarize(items),
        entries: items.length,
        inProgress: inProgress.size,
        tasks,
        days,
        hours,
    }
}
