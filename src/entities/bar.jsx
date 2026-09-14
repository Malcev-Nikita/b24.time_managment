import { fmt } from "@/shared/format";

// Столбик графика: подпись значения сверху (если передана), полоса, подпись периода снизу.
// При наведении на колонку — подсказка «период · время»
export default function Bar({ label, name, value, seconds, height, peak }) {
    const color = seconds ? (peak ? '#bf5b3b' : '#dcb07e') : '#e7dccd'

    return (
        // hover:z-10 поднимает подсказку над соседними колонками
        <div className="group relative hover:z-10 flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
            {value != null && (
                <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">
                    {seconds ? value : ''}
                </div>
            )}

            {/* Высота — на обёртке без анимации: transform у анимированной полосы запер бы подсказку в своём слое */}
            <div className="relative w-full min-w-4 min-h-0.75" style={{ height: `${height}%` }}>
                <div
                    className="h-full rounded-t-[7px] rounded-b-sm origin-bottom animate-rise-in transition-[filter] group-hover:brightness-95"
                    style={{ backgroundColor: color }}
                ></div>

                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#2a241f] px-2.5 py-1.5 font-mono text-xs text-[#fbf7f2] opacity-0 shadow-[0_4px_14px_rgba(42,36,31,0.18)] transition-opacity group-hover:opacity-100">
                    {name} · {fmt(seconds)}
                </div>
            </div>

            <div className={`text-xs text-[#8b7c6e] whitespace-nowrap ${peak ? 'font-bold' : 'font-normal'}`}>
                {label || ' '}
            </div>
        </div>
    )
}
