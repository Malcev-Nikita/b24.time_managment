import ReportError from "@/shared/reportError";
import Content from "@/windows/content";
import ContentHeader from "@/widgets/contentHeader";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <ReportError />

      <ContentHeader />

      <Content />
    </div>
  );
}
