'use client'

import { useSelector } from "react-redux";
import { filterSlugById } from "@/shared/filters";
import Bar from "@/entities/bar";
import { fmt } from "@/shared/format";

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const TITLES = {
    today: 'По часам',
    week: 'По дням недели',
    month: 'По дням',
    year: 'По месяцам',
}

function ymd(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function buildBars(slug, report) {
    const now = new Date()

    if (slug === 'today') {
        const byHour = new Map((report?.hours || []).map((h) => [h.hour, h.seconds]))
        return Array.from({ length: 24 }, (_, hour) => ({
            key: hour,
            label: String(hour),
            name: `${hour}:00`,
            seconds: byHour.get(hour) || 0,
        }))
    }

    const byDay = new Map((report?.days || []).map((d) => [d.date, d.seconds]))

    if (slug === 'week') {
        const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
        return DAY_LABELS.map((label, i) => {
            const d = new Date(monday)
            d.setDate(monday.getDate() + i)
            return { key: label, label, name: label, seconds: byDay.get(ymd(d)) || 0 }
        })
    }

    if (slug === 'month') {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            return {
                key: day,
                label: String(day),
                name: String(day),
                seconds: byDay.get(ymd(new Date(now.getFullYear(), now.getMonth(), day))) || 0,
            }
        })
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

export default function Chart() {
    const filterId = useSelector((state) => state.filter.filterId)
    const { report, reportLoading } = useSelector((state) => state.time)

    const slug = filterSlugById(filterId)
    const bars = buildBars(slug, report)
    const maxSeconds = Math.max(...bars.map((b) => b.seconds))
    const peakBar = maxSeconds ? bars.find((b) => b.seconds === maxSeconds) : null

    return (
        <div className={`bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] pt-6 px-6.5 pb-5 ${reportLoading ? 'opacity-60' : ''}`}>
            <div className="flex items-baseline justify-between mb-5.5">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{TITLES[slug]}</h2>
                <span className="text-[13px] text-[#a0917f]">{peakBar ? `пик · ${peakBar.name} · ${fmt(maxSeconds)}` : '—'}</span>
            </div>

            <div className={`flex items-end h-47.5 ${bars.length > 12 ? 'gap-1' : 'gap-3.5'}`}>
                {bars.map((bar) => (
                    <Bar
                        key={bar.key}
                        label={bar.label}
                        seconds={bar.seconds}
                        height={maxSeconds ? (bar.seconds / maxSeconds) * 100 : 0}
                        peak={peakBar ? bar.seconds === maxSeconds : false}
                    />
                ))}
            </div>
        </div>
    )
}
