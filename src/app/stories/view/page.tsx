import { Suspense } from "react";
import ViewStoryClient from "./ViewStoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Read Story",
  description: "Read real, anonymous stories from students, faculty, and staff in higher education on TheCampusVoice.",
};

export default function ViewStoryPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading story…</main>
      }
    >
      <ViewStoryClient />
    </Suspense>
  );
}
