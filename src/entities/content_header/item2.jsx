import { fmt } from "@/shared/format";
import { DAY_NORM_SECONDS, FULL_DAY_SECONDS, normStatus } from "@/shared/norm";

// Подпись к среднему: сколько не хватает до нормы, в норме или полный день
function normNote(avgSeconds) {
    switch (normStatus(avgSeconds)) {
        case 'full':
            return { text: `полный день · ${fmt(FULL_DAY_SECONDS)}`, color: 'text-[#5f7d4a]' }
        case 'ok':
            return { text: `в норме · до ${fmt(FULL_DAY_SECONDS)} ещё ${fmt(FULL_DAY_SECONDS - avgSeconds)}`, color: 'text-[#8b7c6e]' }
        default:
            return { text: `до нормы ${fmt(DAY_NORM_SECONDS - avgSeconds)}`, color: 'text-[#bf5b3b]' }
    }
}

export default function ContentHeaderItem2({ report }) {
    // Пока за период нет ни одной записи, сравнивать с нормой нечего
    const note = report?.workedDays ? normNote(report.avgSeconds) : null

    return (
        <div className="bg-[#fbf7f2] border border-[#e9e0d4] rounded-[20px] p-5 sm:p-6">
            <div className="text-[12.5px] tracking-widest uppercase text-[#a0917f] font-semibold">
                В среднем / день
            </div>

            <div className="font-mono text-[28px] sm:text-[34px] font-bold tracking-[-0.02em] mt-3.5 text-[#2a241f]">
                {report ? fmt(report.avgSeconds) : '…'}
            </div>

            <div className="mt-2.5 text-[13.5px] text-[#8b7c6e]">
                по рабочим дням · норма от {fmt(DAY_NORM_SECONDS)}
            </div>

            {note && (
                <div className={`mt-0.5 text-[13.5px] font-semibold ${note.color}`}>{note.text}</div>
            )}
        </div>
    )
}
