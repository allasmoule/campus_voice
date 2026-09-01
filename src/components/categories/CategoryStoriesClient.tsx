"use client";

import { useEffect, useState } from "react";
import StoryCard from "@/components/stories/StoryCard";
import type { Story } from "@/types/story";
import Link from "next/link";

interface Props {
  categorySlug: string;
  initialSampleStories: Story[];
}

export default function CategoryStoriesClient({ categorySlug, initialSampleStories }: Props) {
  const [stories, setStories] = useState<Story[]>(initialSampleStories);

  useEffect(() => {
    let cancelled = false;
    fetch(`/backend/stories.php?category=${encodeURIComponent(categorySlug)}`)
      .then((res) => (res.ok ? res.json() : { stories: [] }))
      .then((data) => {
        if (cancelled || !data.stories || !Array.isArray(data.stories)) return;
        const dbStories: Story[] = data.stories.map((s: any) => ({
          id: String(s.id || s.slug),
          title: s.title,
          slug: s.slug,
          excerpt: s.excerpt,
          content: s.content,
          category: s.category,
          categoryColor: s.categoryColor || "#1D4ED8",
          imageUrl: s.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
          readTime: Number(s.readTime) || 3,
          createdAt: s.createdAt,
          status: "PUBLISHED",
        }));

        // Merge DB stories (at the top) with static sample stories (excluding duplicates by slug)
        const dbSlugs = new Set(dbStories.map((s) => s.slug));
        const filteredSample = initialSampleStories.filter((s) => !dbSlugs.has(s.slug));
        setStories([...dbStories, ...filteredSample]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [categorySlug, initialSampleStories]);

  if (stories.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-4">No stories in this category yet.</p>
        <Link href="/submit" className="text-blue-700 hover:underline">
          Be the first to share →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story, idx) => (
        <StoryCard key={`${story.slug}-${idx}`} story={story} />
      ))}
    </div>
  );
}
