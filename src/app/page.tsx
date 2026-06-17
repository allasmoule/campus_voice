import HeroSection from "@/components/home/HeroSection";
import CategoryBar from "@/components/home/CategoryBar";
import TrendingStories from "@/components/home/TrendingStories";
import NewsletterBar from "@/components/home/NewsletterBar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryBar />
      <TrendingStories />
      <NewsletterBar />
    </>
  );
}
