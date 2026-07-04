import { useDispatch } from "react-redux";
import { setFilterId } from "@/store/filter/filter.slice";

export default function FilterItem({ item, active }) {
    const dispatch = useDispatch();

    let classNameVal = "";

    if (active) {
        classNameVal = "border-none cursor-pointer font-[inherit] text-sm font-semibold px-4 py-2 rounded-[10px] transition-all duration-180 text-[#fbede4] bg-[#bf5b3b] shadow-[0_2px_8px_rgba(191,91,59,0.3)]";
    }
    else {
        classNameVal = "border-none cursor-pointer font-[inherit] text-sm font-semibold px-4 py-2 rounded-[10px] transition-all duration-180 text-[#8b7c6e] bg-transparent";
    }

    return (
        <button className={classNameVal} onClick={() => dispatch(setFilterId(item.id))}>
            {item.name}
        </button>
    )
}