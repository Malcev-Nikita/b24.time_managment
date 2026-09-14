export default function ContentHeaderItem4({ report }) {
    return (
        <div className="bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] p-6">
            <div className="text-[12.5px] tracking-widest uppercase text-[#a0917f] font-semibold">
                Задач в работе
            </div>

            <div className="font-mono text-[34px] font-bold tracking-[-0.02em] mt-3.5 text-[#2a241f]">
                {report ? report.tasks.length : '…'}
            </div>

            <div className="mt-2.5 text-[13.5px] text-[#8b7c6e]">
                {report ? `из них в работе: ${report.inProgress}` : 'затрекано время'}
            </div>
        </div>
    )
}