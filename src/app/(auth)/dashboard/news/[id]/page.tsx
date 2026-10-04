import { ArticleView } from "@/components/dashboard/pages/NewsViews";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleView id={id} />;
}
