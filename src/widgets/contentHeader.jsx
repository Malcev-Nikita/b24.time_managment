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

export default function ContentHeader() {
    const dispatch = useDispatch()
    const filterId = useSelector((state) => state.filter.filterId)
    const { report, reportLoading } = useSelector((state) => state.time)

    useEffect(() => {
        dispatch(getTimeReport(filterSlugById(filterId)))
    }, [dispatch, filterId])

    const total = splitHours(report?.totalSeconds)

    return (
        <section className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 ${reportLoading ? 'opacity-60' : ''}`}>
            <ContentHeaderItem1 report={report} total={total} />

            <ContentHeaderItem2 report={report} />

            <ContentHeaderItem3 report={report} />

            <ContentHeaderItem4 report={report} />
        </section>
    )
}