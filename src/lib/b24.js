// Серверная работа с REST Битрикс24. Только для route handlers —
// вебхук из env не должен попадать в клиентский код.

const B24_WEBHOOK = process.env.B24_WEBHOOK

// Вызов метода REST Битрикс24
export async function b24(method, params = {}) {
    const res = await fetch(B24_WEBHOOK + method, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    })
    const data = await res.json()
    if (data.error) throw new Error(`${method}: ${data.error} — ${data.error_description}`)
    return data
}

// Объект -> query string в PHP-стиле: FILTER[USER_ID]=232&SELECT[0]=ID...
function qs(obj, prefix) {
    const parts = []
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}[${k}]` : k
        if (v !== null && typeof v === 'object') parts.push(qs(v, key))
        else parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
    }
    return parts.join('&')
}

// Забирает все страницы метода: первая — обычным запросом (даёт total),
// остальные — пачками до 50 страниц за один вызов batch.
// pageParams(offset) — как задать страницу в команде batch: у новых методов это start,
// у старых task.* — PARAMS[NAV_PARAMS][iNumPage] (start внутри batch они игнорируют)
async function b24AllPages(method, params, extract, pageParams) {
    const first = await b24(method, { ...params, start: 0 })
    const items = [...extract(first.result)]
    const total = first.total || 0

    const starts = []
    for (let s = 50; s < total; s += 50) starts.push(s)

    for (let i = 0; i < starts.length; i += 50) {
        const chunk = starts.slice(i, i + 50)
        const cmd = {}
        for (const s of chunk)
            cmd['p' + s] = method + '?' + qs(pageParams ? pageParams(s) : { ...params, start: s })
        const data = await b24('batch', { halt: 0, cmd })
        const errors = Object.values(data.result.result_error || {})
        if (errors.length) throw new Error(`batch ${method}: ${JSON.stringify(errors[0])}`)
        for (const s of chunk) {
            const r = data.result.result['p' + s]
            if (r) items.push(...extract(r))
        }
    }
    return items
}

// "2026-07-02"
function ymd(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export const PERIODS = ['today', 'week', 'month', 'all']

// Начало периода (или null для "всё время")
export function periodStart(period) {
    const now = new Date()
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (period === 'today') return d
    if (period === 'week') {
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // понедельник текущей недели
        return d
    }
    if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
    return null
}

// id пользователя, которому принадлежит вебхук
export async function getCurrentUserId() {
    const data = await b24('profile')
    return Number(data.result.ID)
}

// Все записи учёта времени пользователя за период (с обходом пагинации)
async function getMyElapsed(userId, from) {
    const FILTER = { USER_ID: userId }
    if (from) FILTER['>=CREATED_DATE'] = ymd(from)
    // Позиционный порядок параметров важен для batch: ORDER, FILTER, SELECT, PARAMS
    const ORDER = { CREATED_DATE: 'desc' }
    const SELECT = ['ID', 'TASK_ID', 'SECONDS', 'CREATED_DATE']
    return b24AllPages(
        'task.elapseditem.getlist',
        { ORDER, FILTER, SELECT },
        (result) => result,
        (offset) => ({ ORDER, FILTER, SELECT, PARAMS: { NAV_PARAMS: { iNumPage: offset / 50 + 1 } } })
    )
}

// Названия задач по списку id -> Map(id -> title)
async function getTaskTitles(ids) {
    const titles = new Map()
    if (!ids.length) return titles
    const tasks = await b24AllPages(
        'tasks.task.list',
        { filter: { ID: ids }, select: ['ID', 'TITLE'] },
        (result) => result.tasks
    )
    for (const t of tasks) titles.set(Number(t.id), t.title)
    return titles
}

// Сводка: записи -> итог, разбивка по задачам и по дням
export async function buildReport(userId, period) {
    const from = periodStart(period)
    const items = await getMyElapsed(userId, from)

    const byTask = new Map()
    const byDay = new Map()
    let totalSeconds = 0

    for (const i of items) {
        const sec = Number(i.SECONDS) || 0
        totalSeconds += sec

        const taskId = Number(i.TASK_ID)
        const t = byTask.get(taskId) || { taskId, seconds: 0, entries: 0 }
        t.seconds += sec
        t.entries += 1
        byTask.set(taskId, t)

        const day = String(i.CREATED_DATE).slice(0, 10)
        byDay.set(day, (byDay.get(day) || 0) + sec)
    }

    const titles = await getTaskTitles([...byTask.keys()])

    const tasks = [...byTask.values()]
        .map((t) => ({ ...t, title: titles.get(t.taskId) || `Задача #${t.taskId}` }))
        .sort((a, b) => b.seconds - a.seconds)

    const days = [...byDay.entries()]
        .map(([date, seconds]) => ({ date, seconds }))
        .sort((a, b) => b.date.localeCompare(a.date))

    // Среднее за рабочий день — по дням, в которые есть хотя бы одна запись
    const avgSeconds = days.length ? Math.round(totalSeconds / days.length) : 0

    return {
        period,
        from: from ? ymd(from) : null,
        totalSeconds,
        avgSeconds,
        entries: items.length,
        workedDays: days.length,
        tasks,
        days,
    }
}
