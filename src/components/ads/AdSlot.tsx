"use client";

import { useMemo } from "react";
import Image from "next/image";

type AdFormat = "banner" | "rectangle" | "leaderboard";

const bannerAds = [
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&h=300&fit=crop",
    title: "Earn Your Degree Online",
    desc: "Flexible programs from top universities — start your journey today.",
    cta: "Apply Now →",
    brand: "EduFlex University",
    accent: "#2563eb",
  },
  {
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&h=300&fit=crop",
    title: "Scholarships Up to $25,000",
    desc: "Merit & need-based awards for undergrad and graduate students.",
    cta: "Check Eligibility →",
    brand: "ScholarPath",
    accent: "#059669",
  },
  {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=300&fit=crop",
    title: "Study Abroad This Summer",
    desc: "200+ programs in 50 countries. Credits transfer seamlessly.",
    cta: "Explore Programs →",
    brand: "GlobalCampus",
    accent: "#7c3aed",
  },
  {
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&h=300&fit=crop",
    title: "Your Mental Health Matters",
    desc: "Free 24/7 counseling & wellness resources for students.",
    cta: "Get Support →",
    brand: "CampusCare",
    accent: "#dc2626",
  },
];

const rectangleAds = [
  {
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=500&fit=crop",
    title: "Master's in Higher Education",
    subtitle: "100% Online · AACSB Accredited",
    cta: "Request Info",
    brand: "StateU Online",
    accent: "#1e40af",
  },
  {
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=500&fit=crop",
    title: "Write Your Dissertation Faster",
    subtitle: "AI-powered research tools for grad students",
    cta: "Try Free",
    brand: "ScholarAI",
    accent: "#7c3aed",
  },
  {
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=500&fit=crop",
    title: "Teach Online, Earn More",
    subtitle: "Join 50,000+ instructors worldwide",
    cta: "Start Teaching",
    brand: "EduPlatform",
    accent: "#059669",
  },
];

function BannerAd({ ad }: { ad: (typeof bannerAds)[0] }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden cursor-pointer group relative">
      <Image
        src={ad.image}
        alt={ad.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 728px"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-center px-6 sm:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: ad.accent }}
            />
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">
              {ad.brand}
            </span>
          </div>
          <div className="text-white font-bold text-base sm:text-lg leading-tight">
            {ad.title}
          </div>
          <div className="text-white/60 text-xs mt-0.5 hidden sm:block">
            {ad.desc}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap transition-all duration-200 group-hover:brightness-110"
            style={{ backgroundColor: ad.accent }}
          >
            {ad.cta}
          </span>
          <span className="text-[9px] text-white/30 font-medium">Ad</span>
        </div>
      </div>
    </div>
  );
}

function RectangleAd({ ad }: { ad: (typeof rectangleAds)[0] }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden cursor-pointer group relative">
      <Image
        src={ad.image}
        alt={ad.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="300px"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
        <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
          {ad.brand}
        </span>
        <div className="text-white font-bold text-lg leading-tight mt-1">
          {ad.title}
        </div>
        <div className="text-white/50 text-xs mt-1">{ad.subtitle}</div>
        <span
          className="inline-block mt-3 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 group-hover:brightness-110"
          style={{ backgroundColor: ad.accent }}
        >
          {ad.cta}
        </span>
      </div>
      <span className="absolute top-2.5 right-3 text-[8px] text-white/30 font-medium">
        Sponsored
      </span>
    </div>
  );
}

const formatStyles: Record<AdFormat, { width: string; height: string }> = {
  banner: { width: "100%", height: "100px" },
  rectangle: { width: "300px", height: "280px" },
  leaderboard: { width: "100%", height: "100px" },
};

export default function AdSlot({
  format = "banner",
  className = "",
  slot,
}: {
  format?: AdFormat;
  className?: string;
  slot?: string;
}) {
  const style = formatStyles[format];

  const ad = useMemo(() => {
    if (format === "rectangle") {
      return rectangleAds[Math.floor(Math.random() * rectangleAds.length)];
    }
    return bannerAds[Math.floor(Math.random() * bannerAds.length)];
  }, [format]);

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl shadow-sm"
        style={{ width: style.width, maxWidth: "728px", height: style.height }}
        data-ad-slot={slot}
      >
        {format === "rectangle" ? (
          <RectangleAd ad={ad as (typeof rectangleAds)[0]} />
        ) : (
          <BannerAd ad={ad as (typeof bannerAds)[0]} />
        )}
      </div>
    </div>
  );
}
