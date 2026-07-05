'use client'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimeReport } from "@/store/time/time.slice";
import { filterSlugById } from "@/shared/filters";
import Task from "@/entities/task";

// Цвета полос по позиции задачи — от самой объёмной к остальным
const BAR_COLORS = ['#b24a2c', '#c8663b', '#d5813f', '#dfa24f', '#c79a6e', '#a9835f']

export default function Tasks() {
    const dispatch = useDispatch()
    const filterId = useSelector((state) => state.filter.filterId)
    const { report, reportLoading } = useSelector((state) => state.time)
    const userId = useSelector((state) => state.profile.profileInfo?.ID)

    useEffect(() => {
        dispatch(getTimeReport(filterSlugById(filterId)))
    }, [dispatch, filterId])

    const tasks = report?.tasks || []
    const maxSeconds = tasks[0]?.seconds || 0 // задачи отсортированы по убыванию времени

    return (
        <section className={`bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] pt-2 px-2 pb-3 ${reportLoading ? 'opacity-60' : ''}`}>
            <div className="grid grid-cols-[40px_1fr_130px_88px_120px] items-center pt-4 px-5 pb-3 text-xs tracking-[0.08em] uppercase text-[#a99a88] font-semibold">
                <span>№</span>
                <span>Задача</span>
                <span>Доля</span>
                <span className="text-right">Записей</span>
                <span className="text-right">Время</span>
            </div>

            {tasks.map((item, index) => {
                return (
                    <Task
                        key={item.taskId}
                        task={item}
                        number={String(index + 1).padStart(2, '0')}
                        color={BAR_COLORS[Math.min(index, BAR_COLORS.length - 1)]}
                        width={maxSeconds ? (item.seconds / maxSeconds) * 100 : 0}
                        userId={userId}
                    />
                )
            })}

            {!report && !reportLoading && (
                <p className="py-3.25 px-5 text-[15px] text-[#a99a88]">Не удалось загрузить задачи</p>
            )}

            {report && !tasks.length && (
                <p className="py-3.25 px-5 text-[15px] text-[#a99a88]">Нет записей за период</p>
            )}
        </section>
    )
}
