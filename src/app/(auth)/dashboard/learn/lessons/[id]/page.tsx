import { LessonView } from "@/components/dashboard/pages/LearnViews";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonView id={id} />;
}
