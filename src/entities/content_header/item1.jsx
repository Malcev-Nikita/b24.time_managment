export default function ContentHeaderItem1({ report, total }) {
    return (
        <div className="bg-[#bf5b3b] text-[#fbede4] rounded-[20px] py-6.5 px-7 relative overflow-hidden shadow-[0_8px_26px_rgba(191,91,59,0.28)]">
            <div className="absolute -right-7.5 -top-7.5 w-35 h-35 rounded-full bg-white/8"></div>

            <div className="text-[12.5px] tracking-[0.12em] uppercase opacity-82 font-semibold">
                Всего за период
            </div>

            <div className="font-mono text-[52px] font-bold tracking-[-0.03em] mt-2.5 leading-none">
                {report ? (
                    <>
                        {total.hours}ч<span className="text-2xl opacity-75 ml-1"> {total.minutes}м</span>
                    </>
                ) : '…'}
            </div>

            <div className="mt-3 text-sm opacity-85">
                {report ? `${report.entries} записей учёта` : ' '}
            </div>
        </div>
    )
}