"use client";

import { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import type { Story } from "@/types/story";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

interface Props {
  initialSampleStories: Story[];
}

export default function AllStoriesClient({ initialSampleStories }: Props) {
  const [allStories, setAllStories] = useState<Story[]>(initialSampleStories);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/stories.php")
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

        const dbSlugs = new Set(dbStories.map((s) => s.slug));
        const filteredSample = initialSampleStories.filter((s) => !dbSlugs.has(s.slug));
        setAllStories([...dbStories, ...filteredSample]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [initialSampleStories]);

  const firstHalf = allStories.slice(0, Math.ceil(allStories.length / 2));
  const secondHalf = allStories.slice(Math.ceil(allStories.length / 2));

  return (
    <>
      <AdTop page="stories" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firstHalf.map((story, idx) => (
            <StoryCard key={`${story.slug}-${idx}`} story={story} />
          ))}
        </div>
      </div>

      <AdMid page="stories" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondHalf.map((story, idx) => (
            <StoryCard key={`${story.slug}-${idx}`} story={story} />
          ))}
        </div>
      </div>

      <AdBottom page="stories" />
    </>
  );
}
