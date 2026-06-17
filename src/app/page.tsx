import HeroSection from "@/components/home/HeroSection";
import CategoryBar from "@/components/home/CategoryBar";
import TrendingStories from "@/components/home/TrendingStories";
import EditorsPicks from "@/components/home/EditorsPicks";
import VoicesSection from "@/components/home/VoicesSection";
import SurveyCallout from "@/components/home/SurveyCallout";
import ImpactStats from "@/components/home/ImpactStats";
import ShareStoryCTA from "@/components/home/ShareStoryCTA";
import NewsletterBar from "@/components/home/NewsletterBar";
import AdSlot from "@/components/ads/AdSlot";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryBar />
      <AdSlot format="leaderboard" className="py-4 bg-white" slot="home-top" />
      <TrendingStories />
      <EditorsPicks />
      <AdSlot format="banner" className="py-4 bg-white" slot="home-mid" />
      <VoicesSection />
      <SurveyCallout />
      <ImpactStats />
      <ShareStoryCTA />
      <AdSlot format="leaderboard" className="py-4 bg-white" slot="home-bottom" />
      <NewsletterBar />
    </>
  );
}
