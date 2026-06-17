"use client";

import { useMemo } from "react";

type AdFormat = "banner" | "rectangle" | "leaderboard";

const bannerAds = [
  {
    bg: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
    title: "Earn Your Degree Online",
    desc: "Flexible programs from top universities. Start today.",
    cta: "Apply Now",
    ctaBg: "#f59e0b",
    icon: "🎓",
  },
  {
    bg: "linear-gradient(135deg, #065f46 0%, #059669 100%)",
    title: "Scholarships Available",
    desc: "$10,000+ awards for undergrad & grad students.",
    cta: "Check Eligibility",
    ctaBg: "#fbbf24",
    icon: "💰",
  },
  {
    bg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    title: "Study Abroad Programs",
    desc: "Explore 200+ programs in 50 countries.",
    cta: "Explore",
    ctaBg: "#f97316",
    icon: "✈️",
  },
  {
    bg: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
    title: "Campus Mental Health",
    desc: "Free counseling resources for students & faculty.",
    cta: "Get Support",
    ctaBg: "#fbbf24",
    icon: "❤️",
  },
];

const rectangleAds = [
  {
    bg: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)",
    title: "Master's in\nHigher Education",
    subtitle: "100% Online · AACSB Accredited",
    cta: "Request Info",
    ctaBg: "#2563eb",
    logo: "🏛️ StateU Online",
  },
  {
    bg: "linear-gradient(180deg, #1e1b4b 0%, #4338ca 100%)",
    title: "Write Your\nDissertation Faster",
    subtitle: "AI-powered research tools for grad students",
    cta: "Try Free",
    ctaBg: "#8b5cf6",
    logo: "📚 ScholarAI",
  },
  {
    bg: "linear-gradient(180deg, #14532d 0%, #15803d 100%)",
    title: "Teach Online\nEarn More",
    subtitle: "Join 50,000+ instructors worldwide",
    cta: "Start Teaching",
    ctaBg: "#eab308",
    logo: "👩‍🏫 EduPlatform",
  },
];

function BannerAd({ ad }: { ad: (typeof bannerAds)[0] }) {
  return (
    <div
      className="w-full h-full rounded-lg flex items-center justify-between px-6 cursor-pointer hover:opacity-95 transition-opacity"
      style={{ background: ad.bg }}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{ad.icon}</span>
        <div>
          <div className="text-white font-bold text-sm">{ad.title}</div>
          <div className="text-white/70 text-xs">{ad.desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 whitespace-nowrap"
          style={{ backgroundColor: ad.ctaBg }}
        >
          {ad.cta}
        </span>
        <span className="text-[9px] text-white/40">Ad</span>
      </div>
    </div>
  );
}

function RectangleAd({ ad }: { ad: (typeof rectangleAds)[0] }) {
  return (
    <div
      className="w-full h-full rounded-lg flex flex-col items-center justify-center text-center px-6 cursor-pointer hover:opacity-95 transition-opacity"
      style={{ background: ad.bg }}
    >
      <div className="text-[10px] text-white/50 mb-3">{ad.logo}</div>
      <div className="text-white font-bold text-lg leading-tight whitespace-pre-line">{ad.title}</div>
      <div className="text-white/60 text-xs mt-2">{ad.subtitle}</div>
      <span
        className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: ad.ctaBg }}
      >
        {ad.cta}
      </span>
      <span className="text-[8px] text-white/30 mt-3">Sponsored</span>
    </div>
  );
}

const formatStyles: Record<AdFormat, { width: string; height: string }> = {
  banner: { width: "100%", height: "90px" },
  rectangle: { width: "300px", height: "250px" },
  leaderboard: { width: "100%", height: "90px" },
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
        className="relative overflow-hidden rounded-lg"
        style={{ width: style.width, maxWidth: "100%", height: style.height }}
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
