import { sampleStories } from "@/lib/sample-stories";
import { CATEGORIES } from "@/lib/constants";
import CategoryStoriesClient from "@/components/categories/CategoryStoriesClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };
  return { title: cat.name, description: cat.description };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const initialStories = sampleStories.filter(
    (s) => s.status === "PUBLISHED" && s.category.toLowerCase().replace(/\s+/g, "-") === category
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-3"
          style={{ backgroundColor: cat.color }}
        >
          {cat.name}
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{cat.name}</h1>
        <p className="text-gray-600">{cat.description}</p>
      </div>

      <AdTop page="category" />

      <CategoryStoriesClient categorySlug={category} initialSampleStories={initialStories} />

      <AdMid page="category" />
      <AdBottom page="category" />
    </main>
  );
}
