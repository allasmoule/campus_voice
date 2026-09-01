"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareButtons from "@/components/ui/ShareButtons";
import StoryReactions from "@/components/stories/StoryReactions";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";
import type { SubmittedStory } from "@/components/stories/SubmittedStoryCard";

import { sampleStories } from "@/lib/sample-stories";

export default function ViewStoryClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const [story, setStory] = useState<SubmittedStory | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");

  useEffect(() => {
    if (!slug) {
      setStatus("not-found");
      return;
    }
    let cancelled = false;
    fetch(`/backend/stories.php?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.story) {
          setStory(data.story);
          setStatus("ready");
        } else {
          const fallback = sampleStories.find((s) => s.slug === slug);
          if (fallback) {
            setStory({
              slug: fallback.slug,
              title: fallback.title,
              excerpt: fallback.excerpt,
              content: fallback.content,
              imageUrl: fallback.imageUrl,
              category: fallback.category,
              categoryColor: fallback.categoryColor,
              readTime: fallback.readTime,
              createdAt: fallback.createdAt,
            });
            setStatus("ready");
          } else {
            setStatus("not-found");
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = sampleStories.find((s) => s.slug === slug);
        if (fallback) {
          setStory({
            slug: fallback.slug,
            title: fallback.title,
            excerpt: fallback.excerpt,
            content: fallback.content,
            imageUrl: fallback.imageUrl,
            category: fallback.category,
            categoryColor: fallback.categoryColor,
            readTime: fallback.readTime,
            createdAt: fallback.createdAt,
          });
          setStatus("ready");
        } else {
          setStatus("not-found");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!story) return;
    document.title = `${story.title} | TheCampusVoice`;

    const shareImageUrl = story.imageUrl || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&h=630&fit=crop";
    const shareUrl = `https://thecampusvoice.info/stories/view?slug=${encodeURIComponent(story.slug)}`;

    const setMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        if (isName) el.name = property;
        else el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", story.excerpt, true);
    setMeta("og:title", story.title);
    setMeta("og:description", story.excerpt);
    setMeta("og:image", shareImageUrl);
    setMeta("og:url", shareUrl);
    setMeta("og:type", "article");
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", story.title, true);
    setMeta("twitter:description", story.excerpt, true);
    setMeta("twitter:image", shareImageUrl, true);
  }, [story]);

  if (status === "loading") {
    return <main className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading story…</main>;
  }

  if (status === "not-found" || !story) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Story Not Found</h1>
        <Link href="/stories" className="text-blue-700 hover:underline text-sm">
          ← Back to Stories
        </Link>
      </main>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: story.excerpt,
    image: story.imageUrl ? [story.imageUrl] : [],
    datePublished: story.createdAt,
    author: {
      "@type": "Organization",
      name: "TheCampusVoice Community",
    },
    publisher: {
      "@type": "Organization",
      name: "TheCampusVoice",
      url: "https://thecampusvoice.info",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ReadingProgress />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/stories" className="text-blue-700 hover:underline text-sm mb-6 inline-block">
          ← Back to Stories
        </Link>

        <span
          className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4"
          style={{ backgroundColor: story.categoryColor }}
        >
          {story.category}
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{story.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {new Date(story.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{story.readTime} min read</span>
          </div>
          <ShareButtons title={story.title} slug={`view?slug=${encodeURIComponent(story.slug)}`} />
        </div>

        {story.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.imageUrl} alt={story.title} className="w-full h-72 object-cover rounded-xl mb-8" />
        )}

        <AdTop page="story" />

        <article
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: story.content ?? "" }}
        />

        <AdMid page="story" />

        <StoryReactions slug={story.slug} />

        <div className="mt-6 pt-4 flex items-center justify-between">
          <ShareButtons title={story.title} slug={`view?slug=${encodeURIComponent(story.slug)}`} />
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl text-center">
          <p className="text-gray-700 mb-3">Have a similar experience to share?</p>
          <Link
            href="/submit"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Share Your Story Anonymously
          </Link>
        </div>

        <AdBottom page="story" />
      </main>
    </>
  );
}
