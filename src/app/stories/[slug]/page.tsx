import { sampleStories } from "@/lib/sample-stories";
import type { Metadata } from "next";
import SingleStoryClient from "@/components/stories/SingleStoryClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = sampleStories.find((s) => s.slug === slug);
  if (!story) return { title: "Story" };
  return { title: story.title, description: story.excerpt };
}

export function generateStaticParams() {
  return sampleStories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const initialStory = sampleStories.find((s) => s.slug === slug && s.status === "PUBLISHED") || null;

  return (
    <SingleStoryClient
      slug={slug}
      initialStory={initialStory}
      sampleStories={sampleStories}
    />
  );
}
