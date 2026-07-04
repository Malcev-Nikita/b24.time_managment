'use client'

import { useSelector } from "react-redux";

export default function ReportError() {
    const { reportError } = useSelector((state) => state.time)

    if (!reportError) return null

    return (
        <p className="mb-4 text-sm text-[#bf5b3b]">Ошибка загрузки: {reportError}</p>
    )
}