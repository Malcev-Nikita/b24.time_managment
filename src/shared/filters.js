export const FILTERS = [
    { id: 1, slug: 'today', name: 'Сегодня' },
    { id: 2, slug: 'week', name: 'Неделя' },
    { id: 3, slug: 'month', name: 'Месяц' },
    { id: 4, slug: 'year', name: 'Год' },
]

export function filterSlugById(id) {
    return FILTERS.find((f) => f.id == id)?.slug ?? 'today'
}

// Подпись выбранного периода для шапки: "Сегодня, 4 июля", "Неделя, с 30 июня"...
export function periodLabel(id) {
    const now = new Date()

    switch (filterSlugById(id)) {
        case 'today':
            return `Сегодня, ${now.toLocaleString('ru', { day: 'numeric', month: 'long' })}`
        case 'week': {
            const monday = new Date(now)
            monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
            return `Неделя, с ${monday.toLocaleString('ru', { day: 'numeric', month: 'long' })}`
        }
        case 'month': {
            const label = now.toLocaleString('ru', { month: 'long', year: 'numeric' })
            return label[0].toUpperCase() + label.slice(1)
        }
        default:
            return `${now.getFullYear()} год`
    }
}
