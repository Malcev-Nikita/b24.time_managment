// Секунды -> "3ч 25м"
export function fmt(seconds) {
    const s = Number(seconds) || 0
    const h = Math.floor(s / 3600)
    const m = Math.round((s % 3600) / 60)
    return h ? `${h}ч ${m}м` : `${m}м`
}

// Секунды -> { hours: 91, minutes: 30 } для крупной цифры с мелкими минутами
export function splitHours(seconds) {
    const s = Number(seconds) || 0
    return {
        hours: Math.floor(s / 3600),
        minutes: Math.round((s % 3600) / 60),
    }
}
