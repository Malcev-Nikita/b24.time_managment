export default function Share({ title, color, percent }) {
    return (
        <div className="flex items-center gap-2.5 text-[13.5px]">
            <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: color }}></span>
            <span className="text-[#4a4038] truncate flex-1">{title}</span>
            <span className="font-mono text-[#8b7c6e] text-[12.5px]">{percent}%</span>
        </div>
    )
}
