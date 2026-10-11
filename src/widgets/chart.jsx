'use client'

import { useSelector } from "react-redux";
import { filterSlugById } from "@/shared/filters";
import Bar from "@/entities/bar";
import { fmt } from "@/shared/format";
import { DAY_NORM_SECONDS } from "@/shared/norm";
import { buildBars } from "./chartBars";

const TITLES = {
    today: 'По часам',
    week: 'По дням недели',
    month: 'По неделям',
    year: 'По месяцам',
}

export default function Chart() {
    const filterId = useSelector((state) => state.filter.filterId)
    const { report, reportLoading } = useSelector((state) => state.time)

    const slug = filterSlugById(filterId)
    const bars = buildBars(slug, report)
    const maxSeconds = Math.max(...bars.map((b) => b.seconds))
    const peakBar = maxSeconds ? bars.find((b) => b.seconds === maxSeconds) : null
    // Линия нормы — только там, где столбик равен дню
    const norm = slug === 'week' ? DAY_NORM_SECONDS : null
    // Шкала не ниже нормы, чтобы линия не уходила за верх графика
    const scale = Math.max(maxSeconds, norm || 0)
    // Подписи значений показываем, только когда столбиков немного и они не наезжают друг на друга
    const showValues = bars.length <= 12

    return (
        <div className={`bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] pt-6 px-4 sm:px-6.5 pb-5 ${reportLoading ? 'opacity-60' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5.5">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{TITLES[slug]}</h2>
                <span className="text-[13px] text-[#a0917f]">
                    {norm ? `норма ${fmt(norm)} · ` : ''}
                    {peakBar ? `пик · ${peakBar.name} · ${fmt(maxSeconds)}` : '—'}
                </span>
            </div>

            <div className={`flex items-end h-47.5 ${bars.length > 12 ? 'gap-0.5 sm:gap-1' : 'gap-2 sm:gap-3.5'}`}>
                {bars.map((bar) => (
                    <Bar
                        key={bar.key}
                        label={bar.label}
                        name={bar.name}
                        value={showValues ? fmt(bar.seconds) : null}
                        seconds={bar.seconds}
                        height={scale ? (bar.seconds / scale) * 100 : 0}
                        peak={peakBar ? bar.seconds === maxSeconds : false}
                        minor={bar.minor}
                        norm={norm ? (norm / scale) * 100 : null}
                    />
                ))}
            </div>
        </div>
    )
}
