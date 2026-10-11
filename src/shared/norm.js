// Норма списанного времени за рабочий день: не меньше 6ч 45м, полный день — 8ч
export const DAY_NORM_SECONDS = 6 * 3600 + 45 * 60
export const FULL_DAY_SECONDS = 8 * 3600

// Оценка дня (или среднего за день) относительно нормы
export function normStatus(seconds) {
    if (seconds >= FULL_DAY_SECONDS) return 'full'
    if (seconds >= DAY_NORM_SECONDS) return 'ok'
    return 'below'
}
