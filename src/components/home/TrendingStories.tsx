"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StoryCard from "@/components/stories/StoryCard";
import { sampleStories } from "@/lib/sample-stories";
import type { Story } from "@/types/story";

export default function TrendingStories() {
  const [stories, setStories] = useState<Story[]>(sampleStories.slice(0, 4));

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/stories.php")
      .then((res) => (res.ok ? res.json() : { stories: [] }))
      .then((data) => {
        if (cancelled || !data.stories || !Array.isArray(data.stories) || data.stories.length === 0) return;
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
        const filteredSample = sampleStories.filter((s) => !dbSlugs.has(s.slug));
        const combined = [...dbStories, ...filteredSample].slice(0, 4);
        setStories(combined);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Trending on Campus
          </h2>
          <Link
            href="/stories"
            className="text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            View all stories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger">
          {stories.map((story, idx) => (
            <StoryCard key={`${story.slug}-${idx}`} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
