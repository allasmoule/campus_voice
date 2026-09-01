"use client";

import { useEffect, useState } from "react";
import SubmittedStoryCard, { SubmittedStory } from "./SubmittedStoryCard";

export default function PublishedStoriesGrid() {
  const [stories, setStories] = useState<SubmittedStory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend/stories.php")
      .then((res) => (res.ok ? res.json() : { stories: [] }))
      .then((data) => {
        if (!cancelled) setStories(data.stories || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || stories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <h2 className="text-lg font-bold text-gray-900 mb-6">From the Community</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <SubmittedStoryCard key={story.slug} story={story} />
        ))}
      </div>
    </div>
  );
}
