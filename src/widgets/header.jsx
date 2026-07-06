'use client'

import Image from "next/image"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfileInfo } from "@/store/profile/profile.slice"
import { getTimeReport } from "@/store/time/time.slice"
import { FILTERS, filterSlugById, periodLabel } from "@/shared/filters"
import FilterItem from "@/entities/filterItem"

export default function Header() {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profile.profileInfo)
    const filterId = useSelector((state) => state.filter.filterId)
    const isLoading = useSelector((state) => state.profile.profileInfoLoading || state.time.reportLoading)

    function refreshAll() {
        dispatch(getProfileInfo())
        dispatch(getTimeReport(filterSlugById(filterId)))
    }

    useEffect(() => {
        dispatch(getProfileInfo())
    }, [dispatch])

    return (
        <header className="flex items-end justify-between gap-6 wrap-normal mb-7">
            <div>
                <div className="flex items-center gap-3 mb-2.5">
                    <button type="button" onClick={refreshAll} title="Обновить данные" className="w-8.5 h-8.5 cursor-pointer rounded-[10px] bg-[#bf5b3b] flex items-center justify-center shadow-[0_2px_8px_rgba(191,91,59,0.35)]">
                        <div className={`w-3.25 h-3.25 ${isLoading ? 'animate-spin' : ''}`}>
                            <Image className="w-full h-full" src="/icons/reload.svg" alt="Обновить" width={13} height={13} />
                        </div>
                    </button>

                    <span className="text-[13px] text-[#98897b] leading-[0.14em] uppercase font-semibold">
                        Учёт времени
                    </span>
                </div>

                <h1 className="m-0 text-[34px] font-bold tracking-[-0.02em] leading-[1.05] text-[#2a241f]">
                    Моё затреканное время
                </h1>

                <p className="mt-2 text-[#8b7c6e] text-[15px]">
                    {profile ? `${profile.LAST_NAME} ${profile.NAME}` : '…'} · {periodLabel(filterId)}
                </p>
            </div>

            <nav className="inline-flex bg-[#fbf7f2] border border-[#e4d9cc] rounded-[13px] p-1 gap-0.5 shadow-[0_1px_2px_rgba(42,36,31,0.04)]">
                {FILTERS.map((item) => {
                    return (
                        <FilterItem key={item.id} item={item} active={filterId == item.id} />
                    )
                })}
            </nav>
        </header>
    )
}
