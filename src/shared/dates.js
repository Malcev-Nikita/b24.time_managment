// Календарные даты без часовых поясов: строка "2026-07-02" <-> локальная Date.
// Без импортов — модуль используется и на сервере, и на клиенте, и в тестах

// Date -> "2026-07-02"
export function ymd(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// "2026-07-02" -> Date на полночь по локальному времени (new Date(str) дал бы UTC)
export function parseYmd(str) {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d)
}

// Date -> "2026-07-02T14:05:09" — для сравнения с CREATED_DATE срезом строки
export function ymdhms(date) {
    const t = [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')
    return `${ymd(date)}T${t}`
}

function addDays(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

// Понедельник недели, в которую входит date
export function mondayOf(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return addDays(d, -((d.getDay() + 6) % 7))
}

// Начало периода
export function periodStart(period, now = new Date()) {
    if (period === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (period === 'week') return mondayOf(now)
    if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
    return new Date(now.getFullYear(), 0, 1) // year — с 1 января
}

// Тот же отрезок прошлого периода: { from, to } — to включительно, с точностью до секунды.
// Неделя с понедельника по четверг 14:00 -> прошлая неделя с понедельника по четверг 14:00.
// Если в прошлом месяце дней меньше (31 марта -> февраль), отрезок кончается последним днём
export function previousRange(period, now = new Date()) {
    const start = periodStart(period, now)
    const hms = [now.getHours(), now.getMinutes(), now.getSeconds()]
    let from, lastDay

    if (period === 'today') {
        from = addDays(start, -1)
        lastDay = from
    } else if (period === 'week') {
        from = addDays(start, -7)
        lastDay = addDays(now, -7)
    } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const daysInPrev = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
        lastDay = new Date(now.getFullYear(), now.getMonth() - 1, Math.min(now.getDate(), daysInPrev))
    } else {
        from = new Date(now.getFullYear() - 1, 0, 1)
        const daysInMonth = new Date(now.getFullYear() - 1, now.getMonth() + 1, 0).getDate()
        lastDay = new Date(now.getFullYear() - 1, now.getMonth(), Math.min(now.getDate(), daysInMonth))
    }

    const to = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate(), ...hms)
    return { from, to }
}
