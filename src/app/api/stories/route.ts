import { NextResponse } from "next/server";
import { sampleStories } from "@/lib/sample-stories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let stories = sampleStories.filter((s) => s.status === "PUBLISHED");

  if (category) {
    stories = stories.filter(
      (s) => s.category.toLowerCase().replace(/\s+/g, "-") === category
    );
  }

  return NextResponse.json(stories);
}
