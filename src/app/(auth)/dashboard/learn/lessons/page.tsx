import { LessonsView } from "@/components/dashboard/pages/LearnViews";

export default async function LessonsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <LessonsView initialCategory={category} />;
}
