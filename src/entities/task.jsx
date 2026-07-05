import { fmt } from "@/shared/format";

export default function Task({ task, number, color, width, userId }) {
    return (
        <a
            href={`https://addu.bitrix24.ru/company/personal/user/${userId || 0}/tasks/task/view/${task.taskId}/`}
            target="_blank"
            className="grid grid-cols-[40px_1fr_130px_88px_120px] items-center py-3.25 px-5 no-underline rounded-xl transition-colors border-b border-[#f0e7db] last:border-b-0"
        >
            <span className="font-mono text-[13px] text-[#b3a38f]">{number}</span>

            <div className="min-w-0 pr-4">
                <div className="text-[15px] font-medium text-[#2a241f] truncate">{task.title}</div>
            </div>

            <div className="pr-4">
                <div className="h-1.75 rounded-sm bg-[#ede3d7] overflow-hidden">
                    <div
                        className="h-full rounded-sm origin-left animate-grow-w"
                        style={{ width: `${width}%`, backgroundColor: color }}
                    ></div>
                </div>
            </div>

            <span className="text-right font-mono text-[13.5px] text-[#8b7c6e]">{task.entries}</span>
            <span className="text-right font-mono text-[15px] font-bold text-[#2a241f]">{fmt(task.seconds)}</span>
        </a>
    )
}
