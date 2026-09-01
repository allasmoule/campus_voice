"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sampleStories } from "@/lib/sample-stories";
import type { Story } from "@/types/story";

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [allStories, setAllStories] = useState<Story[]>(sampleStories);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";

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
          setAllStories([...dbStories, ...filteredSample]);
        })
        .catch(() => {});

      return () => {
        cancelled = true;
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results =
    query.trim().length > 1
      ? allStories.filter(
          (s) =>
            s.status === "PUBLISHED" &&
            (s.title.toLowerCase().includes(query.toLowerCase()) ||
              s.excerpt.toLowerCase().includes(query.toLowerCase()) ||
              s.category.toLowerCase().includes(query.toLowerCase()))
        )
      : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
          <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search stories, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <button onClick={onClose} className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5">
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.trim().length > 1 && results.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-500">No stories found for &ldquo;{query}&rdquo;</p>
          )}
          {results.map((story) => (
            <Link
              key={story.id || story.slug}
              href={`/stories/view?slug=${encodeURIComponent(story.slug)}`}
              onClick={onClose}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src={story.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop"} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{story.title}</p>
                <p className="text-xs text-gray-500">{story.category} · {story.readTime} min read</p>
              </div>
            </Link>
          ))}
          {query.trim().length <= 1 && (
            <div className="px-5 py-6 text-center text-sm text-gray-400">
              Type to search stories...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
