import { fmt } from "@/shared/format";

// Столбик графика: подпись значения над полосой (если передана), полоса, подпись периода снизу.
// При наведении на колонку — подсказка «период · время».
// norm — высота линии нормы в процентах; отрезки соседних колонок складываются в одну линию
export default function Bar({ label, name, value, seconds, height, peak, minor, norm }) {
    const color = seconds ? (peak ? '#bf5b3b' : '#dcb07e') : '#e7dccd'

    return (
        // hover:z-10 поднимает подсказку над соседними колонками
        <div className={`group relative hover:z-10 flex-1 h-full flex flex-col items-center gap-2 min-w-0 ${value != null ? 'pt-5' : ''}`}>
            {/* Область построения одной высоты у всех колонок — от неё считаются проценты полосы и нормы */}
            <div className="relative w-full flex-1 min-h-0">
                {norm != null && (
                    <div
                        className="absolute -left-1 -right-1 sm:-left-1.75 sm:-right-1.75 border-t border-dashed border-[#8b7c6e]/45"
                        style={{ bottom: `${norm}%` }}
                    ></div>
                )}

                {value != null && seconds > 0 && (
                    <div
                        className="absolute left-1/2 -translate-x-1/2 mb-1.5 font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap"
                        style={{ bottom: `${height}%` }}
                    >
                        {value}
                    </div>
                )}

                {/* Высота — на обёртке без анимации: transform у анимированной полосы запер бы подсказку в своём слое */}
                <div className="absolute bottom-0 inset-x-0 min-h-0.75" style={{ height: `${height}%` }}>
                    <div
                        className="h-full rounded-t-[7px] rounded-b-sm origin-bottom animate-rise-in transition-[filter] group-hover:brightness-95"
                        style={{ backgroundColor: color }}
                    ></div>

                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#2a241f] px-2.5 py-1.5 font-mono text-xs text-[#fbf7f2] opacity-0 shadow-[0_4px_14px_rgba(42,36,31,0.18)] transition-opacity group-hover:opacity-100">
                        {name} · {fmt(seconds)}
                    </div>
                </div>
            </div>

            <div className={`text-xs text-[#8b7c6e] whitespace-nowrap ${peak ? 'font-bold' : 'font-normal'} ${minor ? 'invisible sm:visible' : ''}`}>
                {label || ' '}
            </div>
        </div>
    )
}
