// Секунды -> { hours: 91, minutes: 30 } для крупной цифры с мелкими минутами.
// Округляем сразу до минут, иначе 7199 с превращались в «1ч 60м»
export function splitHours(seconds) {
    const totalMinutes = Math.round((Number(seconds) || 0) / 60)
    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
    }
}

// Секунды -> "3ч 25м"
export function fmt(seconds) {
    const { hours, minutes } = splitHours(seconds)
    return hours ? `${hours}ч ${minutes}м` : `${minutes}м`
}

// Разница в секундах -> "+1ч 20м" / "−45м" / "±0м"
export function fmtDiff(seconds) {
    const s = Number(seconds) || 0
    const sign = s > 0 ? '+' : s < 0 ? '−' : '±'
    return sign + fmt(Math.abs(s))
}
