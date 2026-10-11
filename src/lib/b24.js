// Серверная работа с REST Битрикс24. Только для route handlers —
// вебхук из env не должен попадать в клиентский код.

import { periodStart, previousRange, ymd, ymdhms } from '@/shared/dates'
import { aggregate, entriesUntil, summarize } from './report'

const B24_WEBHOOK = process.env.B24_WEBHOOK

// Вызов метода REST Битрикс24
export async function b24(method, params = {}) {
    if (!B24_WEBHOOK) throw new Error('не задан B24_WEBHOOK в .env.local')

    const res = await fetch(B24_WEBHOOK + method, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    })
    // При сбоях портал может ответить HTML-страницей — не падаем на разборе JSON
    const data = await res.json().catch(() => null)
    if (!data) throw new Error(`${method}: портал ответил ${res.status} ${res.statusText}`)
    if (data.error) throw new Error(`${method}: ${data.error} — ${data.error_description}`)
    return data
}

// Адрес портала для ссылок на задачи: https://xxx.bitrix24.ru
export function portalUrl() {
    return B24_WEBHOOK ? new URL(B24_WEBHOOK).origin : null
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

export const PERIODS = ['today', 'week', 'month', 'year']

// id пользователя, которому принадлежит вебхук. Не меняется, пока не сменили вебхук, —
// запоминаем, чтобы не тратить на profile запрос при каждом отчёте
let currentUserId = null
export async function getCurrentUserId() {
    if (!currentUserId) {
        const data = await b24('profile')
        currentUserId = Number(data.result.ID)
    }
    return currentUserId
}

// Все записи учёта времени пользователя за дни [from, to] (с обходом пагинации)
async function getMyElapsed(userId, from, to) {
    const FILTER = { USER_ID: userId, '>=CREATED_DATE': ymd(from) }
    if (to) {
        const next = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)
        FILTER['<CREATED_DATE'] = ymd(next)
    }
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

// Задачи в статусе «Выполняется» с включённым учётом времени, где пользователь
// исполнитель или соисполнитель -> Map(id -> title).
// Два запроса вместо ::SUBFILTER-1 с ::LOGIC OR — такой подфильтр теряет часть задач
async function getMyTasksInProgress(userId) {
    const base = { REAL_STATUS: 3, ALLOW_TIME_TRACKING: 'Y' }
    const lists = await Promise.all(
        [{ RESPONSIBLE_ID: userId }, { ACCOMPLICE: userId }].map((role) =>
            b24AllPages(
                'tasks.task.list',
                { filter: { ...base, ...role }, select: ['ID', 'TITLE'] },
                (result) => result.tasks
            )
        )
    )
    const tasks = new Map()
    for (const t of lists.flat()) tasks.set(Number(t.id), t.title)
    return tasks
}

// Тот же отрезок прошлого периода — для сравнения «+2ч к прошлой неделе».
// Записи берём по дням, а последний день обрезаем по текущему времени
async function getPrevious(userId, period, now) {
    const { from, to } = previousRange(period, now)
    const items = entriesUntil(await getMyElapsed(userId, from, to), ymdhms(to))
    return { from: ymd(from), to: ymdhms(to), ...summarize(items) }
}

// Сводка: записи -> итог, разбивка по задачам и по дням, сравнение с прошлым периодом
export async function buildReport(userId, period) {
    const now = new Date()
    const from = periodStart(period, now)
    const [items, inProgress, previous] = await Promise.all([
        getMyElapsed(userId, from),
        getMyTasksInProgress(userId),
        getPrevious(userId, period, now),
    ])

    const ids = [...new Set(items.map((i) => Number(i.TASK_ID)))].filter((id) => !inProgress.has(id))
    const titles = await getTaskTitles(ids)

    return {
        period,
        from: ymd(from),
        userId,
        portal: portalUrl(),
        ...aggregate(items, { period, inProgress, titles }),
        previous,
    }
}
