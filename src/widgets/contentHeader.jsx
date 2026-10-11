'use client'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimeReport } from "@/store/time/time.slice";
import { filterSlugById } from "@/shared/filters";
import { splitHours } from "@/shared/format";
import ContentHeaderItem1 from "@/entities/content_header/item1";
import ContentHeaderItem2 from "@/entities/content_header/item2";
import ContentHeaderItem3 from "@/entities/content_header/item3";
import ContentHeaderItem4 from "@/entities/content_header/item4";

// Единственное место, где загружается отчёт: при старте, смене фильтра и по кнопке «Обновить»
export default function ContentHeader() {
    const dispatch = useDispatch()
    const filterId = useSelector((state) => state.filter.filterId)
    const reloadKey = useSelector((state) => state.time.reloadKey)
    const { report, reportLoading } = useSelector((state) => state.time)

    useEffect(() => {
        const request = dispatch(getTimeReport(filterSlugById(filterId)))
        // Фильтр сменили раньше, чем пришёл ответ, — прежний запрос больше не нужен
        return () => request.abort()
    }, [dispatch, filterId, reloadKey])

    const total = splitHours(report?.totalSeconds)

    return (
        <section className={`grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 sm:gap-4 ${reportLoading ? 'opacity-60' : ''}`}>
            <ContentHeaderItem1 report={report} total={total} />

            <ContentHeaderItem2 report={report} />

            <ContentHeaderItem3 report={report} />

            <ContentHeaderItem4 report={report} />
        </section>
    )
}
