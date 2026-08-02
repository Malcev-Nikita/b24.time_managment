// Столбик графика: подпись значения сверху (если передана), полоса, подпись периода снизу
export default function Bar({ label, value, seconds, height, peak }) {
    const color = seconds ? (peak ? '#bf5b3b' : '#dcb07e') : '#e7dccd'

    return (
        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
            {value != null && (
                <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">
                    {seconds ? value : ''}
                </div>
            )}
            <div
                className="w-full min-w-4 min-h-0.75 rounded-t-[7px] rounded-b-sm origin-bottom animate-rise-in"
                style={{ height: `${height}%`, backgroundColor: color }}
            ></div>

            <div className={`text-xs text-[#8b7c6e] whitespace-nowrap ${peak ? 'font-bold' : 'font-normal'}`}>
                {label || ' '}
            </div>
        </div>
    )
}
