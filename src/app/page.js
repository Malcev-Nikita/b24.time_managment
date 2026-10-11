import StoreProvider from "@/store/store-provide";
import { filterIdBySlug } from "@/shared/filters";
import ReportError from "@/shared/reportError";
import Content from "@/windows/content";
import ContentHeader from "@/widgets/contentHeader";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";

// Стор живёт здесь, а не в layout: только page получает searchParams,
// а период из адреса (?period=week) нужен стору с самого начала
export default async function Home({ searchParams }) {
  const { period } = await searchParams;

  return (
    <StoreProvider filterId={filterIdBySlug(period)}>
      <Header />

      <div className="flex flex-col gap-4">
        <ReportError />

        <ContentHeader />

        <Content />
      </div>

      <Footer />
    </StoreProvider>
  );
}
