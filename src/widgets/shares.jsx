'use client'

import { useSelector } from "react-redux";
import Share from "@/entities/share";

// Цвета сегментов по позиции задачи, последний — для «Прочее»
const SHARE_COLORS = ['#b24a2c', '#c8663b', '#d5813f', '#dfa24f', '#c79a6e']
const OTHER_COLOR = '#c9b7a3'

// Топ-5 задач + агрегат «Прочее (N)» по остальным
function buildShares(report) {
    // Задачи в работе без записей за период долей не имеют — не раздуваем ими «Прочее»
    const tasks = (report?.tasks || []).filter((task) => task.seconds > 0)
    const totalSeconds = report?.totalSeconds || 0
    if (!totalSeconds) return []

    const top = tasks.slice(0, SHARE_COLORS.length)
    const rest = tasks.slice(SHARE_COLORS.length)

    const items = top.map((task, index) => ({
        key: task.taskId,
        title: task.title,
        seconds: task.seconds,
        color: SHARE_COLORS[index],
    }))

    if (rest.length) {
        items.push({
            key: 'other',
            title: `Прочее (${rest.length})`,
            seconds: rest.reduce((sum, task) => sum + task.seconds, 0),
            color: OTHER_COLOR,
        })
    }

    return items.map((item) => ({
        ...item,
        width: (item.seconds / totalSeconds) * 100,
        percent: Math.round((item.seconds / totalSeconds) * 100),
    }))
}

export default function Shares() {
    const { report, reportLoading } = useSelector((state) => state.time)
    const shares = buildShares(report)

    return (
        <div className={`bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] py-6 px-6.5 ${reportLoading ? 'opacity-60' : ''}`}>
            <h2 className="mb-5 text-[17px] font-semibold tracking-[-0.01em]">Доли по задачам</h2>

            <div className="flex h-3.75 rounded-lg overflow-hidden mb-5.5 bg-[#ede3d7]">
                {shares.map((share) => (
                    <div
                        key={share.key}
                        className="origin-left animate-grow-w"
                        style={{ width: `${share.width}%`, backgroundColor: share.color }}
                    ></div>
                ))}
            </div>

            <div className="flex flex-col gap-3.25">
                {shares.map((share) => (
                    <Share key={share.key} title={share.title} color={share.color} percent={share.percent} />
                ))}

                {!shares.length && (
                    <p className="text-[15px] text-[#a99a88]">{report ? 'Нет записей за период' : '…'}</p>
                )}
            </div>
        </div>
    )
}
