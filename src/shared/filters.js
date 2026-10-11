import { parseYmd, periodStart } from "@/shared/dates"

// prev — с чем сравниваем в карточке итога: «+2ч к прошлой неделе»
export const FILTERS = [
    { id: 1, slug: 'today', name: 'Сегодня', prev: 'ко вчера' },
    { id: 2, slug: 'week', name: 'Неделя', prev: 'к прошлой неделе' },
    { id: 3, slug: 'month', name: 'Месяц', prev: 'к прошлому месяцу' },
    { id: 4, slug: 'year', name: 'Год', prev: 'к прошлому году' },
]

export function filterById(id) {
    return FILTERS.find((f) => f.id == id) ?? FILTERS[0]
}

export function filterSlugById(id) {
    return filterById(id).slug
}

// ?period=week -> 2; неизвестный или пустой — «Сегодня»
export function filterIdBySlug(slug) {
    return FILTERS.find((f) => f.slug === slug)?.id ?? FILTERS[0].id
}

// Подпись выбранного периода для шапки: "Сегодня, 4 июля", "Неделя, с 30 июня"...
// from — начало периода из отчёта (посчитано на сервере); пока отчёта нет — считаем сами
export function periodLabel(id, from) {
    const slug = filterSlugById(id)
    const start = from ? parseYmd(from) : periodStart(slug)

    switch (slug) {
        case 'today':
            return `Сегодня, ${start.toLocaleString('ru', { day: 'numeric', month: 'long' })}`
        case 'week':
            return `Неделя, с ${start.toLocaleString('ru', { day: 'numeric', month: 'long' })}`
        case 'month': {
            const label = start.toLocaleString('ru', { month: 'long', year: 'numeric' })
            return label[0].toUpperCase() + label.slice(1)
        }
        default:
            return `${start.getFullYear()} год`
    }
}
