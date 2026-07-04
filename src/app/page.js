import ReportError from "@/shared/reportError";
import ContentHeader from "@/widgets/contentHeader";

export default function Home() {
  return (
    <div className="gap-4">
      <ReportError />

      <ContentHeader />
    </div>
  );
}
