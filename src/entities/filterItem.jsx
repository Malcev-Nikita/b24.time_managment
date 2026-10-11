import { useDispatch } from "react-redux";
import { setFilterId } from "@/store/filter/filter.slice";

export default function FilterItem({ item, active }) {
    const dispatch = useDispatch();

    function select() {
        dispatch(setFilterId(item.id))
        // Период — в адресе: переживает перезагрузку, ссылкой можно поделиться.
        // replaceState Next подхватывает без перехода по странице
        window.history.replaceState(null, '', `?period=${item.slug}`)
    }

    let classNameVal = "";

    if (active) {
        classNameVal = "border-none cursor-pointer font-[inherit] text-sm font-semibold px-4 py-2 rounded-[10px] transition-all duration-180 whitespace-nowrap text-[#fbede4] bg-[#bf5b3b] shadow-[0_2px_8px_rgba(191,91,59,0.3)]";
    }
    else {
        classNameVal = "border-none cursor-pointer font-[inherit] text-sm font-semibold px-4 py-2 rounded-[10px] transition-all duration-180 whitespace-nowrap text-[#8b7c6e] bg-transparent";
    }

    return (
        <button type="button" aria-pressed={active} className={classNameVal} onClick={select}>
            {item.name}
        </button>
    )
}
