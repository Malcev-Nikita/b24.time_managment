// Столбики графика из сводки. Чистая функция — импорт относительный,
// чтобы модуль грузился и в node --test, где алиаса @/ нет
import { parseYmd, periodStart, ymd } from '../shared/dates.js'

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export function buildBars(slug, report, now = new Date()) {
    // Начало периода берём из отчёта: сервер и браузер могут жить в разных поясах,
    // и на границе суток столбики иначе съехали бы на день
    const start = report?.period === slug && report.from ? parseYmd(report.from) : periodStart(slug, now)

    if (slug === 'today') {
        const byHour = new Map((report?.hours || []).map((h) => [h.hour, h.seconds]))
        return Array.from({ length: 24 }, (_, hour) => ({
            key: hour,
            label: String(hour),
            name: `${hour}:00`,
            seconds: byHour.get(hour) || 0,
            // На узком экране 24 подписи не помещаются — оставляем каждую третью
            minor: hour % 3 !== 0,
        }))
    }

    const byDay = new Map((report?.days || []).map((d) => [d.date, d.seconds]))

    if (slug === 'week') {
        return DAY_LABELS.map((label, i) => {
            const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
            return { key: label, label, name: label, seconds: byDay.get(ymd(d)) || 0 }
        })
    }

    if (slug === 'month') {
        // Недели месяца (Пн–Вс), первая и последняя могут быть неполными
        const year = start.getFullYear()
        const month = start.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const weeks = []
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            if (day === 1 || date.getDay() === 1) weeks.push({ start: day, end: day, seconds: 0 })
            const week = weeks[weeks.length - 1]
            week.end = day
            week.seconds += byDay.get(ymd(date)) || 0
        }
        return weeks.map((w) => ({
            key: w.start,
            label: `${w.start}–${w.end}`,
            name: `${w.start}–${w.end}`,
            seconds: w.seconds,
        }))
    }

    // year — суммируем дни по месяцам ("2026-07-05" -> месяц 6)
    const byMonth = new Map()
    for (const [date, seconds] of byDay) {
        const month = Number(date.slice(5, 7)) - 1
        byMonth.set(month, (byMonth.get(month) || 0) + seconds)
    }
    return MONTH_LABELS.map((label, month) => ({
        key: label,
        label,
        name: label,
        seconds: byMonth.get(month) || 0,
    }))
}
