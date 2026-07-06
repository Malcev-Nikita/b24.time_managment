import Chart from "@/widgets/chart";
import Shares from "@/widgets/shares";
import Tasks from "@/widgets/tasks";

export default function Content() {
    return (
        <div>
            <section className="grid grid-cols-[1.75fr_1fr] gap-4 mb-4">
                <Chart />

                <Shares />
            </section>

            <Tasks />
        </div>
    )
}
