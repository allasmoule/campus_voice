"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  initialLikes?: number;
  initialDislikes?: number;
}

export default function StoryReactions({ slug, initialLikes = 0, initialDislikes = 0 }: Props) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load vote status from localStorage & live counts from database
  useEffect(() => {
    if (!slug) return;

    // Load local stored vote
    try {
      const stored = localStorage.getItem(`cv_vote_${slug}`);
      if (stored === "like" || stored === "dislike") {
        setUserVote(stored);
      }
    } catch {}

    // Fetch live counts from DB
    let cancelled = false;
    fetch(`/backend/reactions.php?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          if (typeof data.likes === "number") setLikes(data.likes);
          if (typeof data.dislikes === "number") setDislikes(data.dislikes);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sendReaction = async (type: "like" | "dislike", delta: number) => {
    try {
      const res = await fetch("/backend/reactions.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, type, delta }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === "number") setLikes(data.likes);
        if (typeof data.dislikes === "number") setDislikes(data.dislikes);
      }
    } catch {}
  };

  const handleVote = async (targetVote: "like" | "dislike") => {
    if (isSubmitting || !slug) return;
    setIsSubmitting(true);

    let newVote: "like" | "dislike" | null = targetVote;

    if (userVote === targetVote) {
      // Toggle off
      newVote = null;
      setLikes((prev) => (targetVote === "like" ? Math.max(0, prev - 1) : prev));
      setDislikes((prev) => (targetVote === "dislike" ? Math.max(0, prev - 1) : prev));
      await sendReaction(targetVote, -1);
    } else if (userVote !== null) {
      // Switch vote (e.g. from dislike to like)
      const prevVote = userVote;
      if (targetVote === "like") {
        setLikes((prev) => prev + 1);
        setDislikes((prev) => Math.max(0, prev - 1));
      } else {
        setDislikes((prev) => prev + 1);
        setLikes((prev) => Math.max(0, prev - 1));
      }
      await sendReaction(prevVote, -1);
      await sendReaction(targetVote, 1);
    } else {
      // New vote
      if (targetVote === "like") {
        setLikes((prev) => prev + 1);
      } else {
        setDislikes((prev) => prev + 1);
      }
      await sendReaction(targetVote, 1);
    }

    setUserVote(newVote);
    try {
      if (newVote) {
        localStorage.setItem(`cv_vote_${slug}`, newVote);
      } else {
        localStorage.removeItem(`cv_vote_${slug}`);
      }
    } catch {}

    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center gap-4 py-4 my-6 border-y border-gray-100">
      <span className="text-sm font-semibold text-gray-700">Was this story helpful?</span>
      
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          type="button"
          onClick={() => handleVote("like")}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${
            userVote === "like"
              ? "bg-blue-600 text-white ring-2 ring-blue-300 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
          }`}
          title="Like this story"
        >
          <span className="text-base">👍</span>
          <span>{likes}</span>
        </button>

        {/* Dislike Button */}
        <button
          type="button"
          onClick={() => handleVote("dislike")}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${
            userVote === "dislike"
              ? "bg-rose-600 text-white ring-2 ring-rose-300 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
          }`}
          title="Dislike this story"
        >
          <span className="text-base">👎</span>
          <span>{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
