import Shares from "@/widgets/shares";
import Tasks from "@/widgets/tasks";

export default function Content() {
    return (
        <div>
            <section className="grid grid-cols-[1.35fr_1fr] gap-4 mb-4">
                <div className="bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] pt-6 px-6.5 pb-5">
                    <div className="flex items-baseline justify-between mb-5.5">
                        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">По дням недели</h2>
                        <span className="text-[13px] text-[#a0917f]">пик · Чт</span>
                    </div>

                    <div className="flex items-end gap-3.5 h-47.5">

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">3ч 30м</div>
                            <div className="w-full max-w-11.5 h-[79.2453%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#dcb07e] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Пн</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">4ч 10м</div>
                            <div className="w-full max-w-11.5 h-[94.3396%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#dcb07e] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Вт</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">3ч 25м</div>
                            <div className="w-full max-w-11.5 h-[77.3585%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#dcb07e] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Ср</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">4ч 25м</div>
                            <div className="w-full max-w-11.5 h-full min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#bf5b3b] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-bold">Чт</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap">2ч 20м</div>
                            <div className="w-full max-w-11.5 h-[52.8302%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#dcb07e] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Пт</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap opacity-35"></div>
                            <div className="w-full max-w-11.5 h-[1.5%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#e7dccd] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Сб</div>
                        </div>

                        <div className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0">
                            <div className="font-mono text-[11px] text-[#9a8b7c] whitespace-nowrap opacity-35"></div>
                            <div className="w-full max-w-11.5 h-[1.5%] min-h-0.75 rounded-t-[7px] rounded-b-sm bg-[#e7dccd] origin-bottom animate-rise-in"></div>
                            <div className="text-xs text-[#8b7c6e] whitespace-nowrap font-normal">Вс</div>
                        </div>
                    </div>
                </div>

                <Shares />
            </section>

            <Tasks />
        </div>
    )
}