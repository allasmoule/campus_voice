"use client";

import { useEffect, useRef, useState } from "react";

type AdFormat = "banner" | "rectangle" | "leaderboard";

interface AdData {
  id: number;
  adType: "image" | "video" | "code";
  title: string | null;
  description: string | null;
  brandName: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  accentColor: string;
  mediaUrl: string | null;
  customCode: string | null;
}

const formatStyles: Record<AdFormat, { width: string; height: string }> = {
  banner: { width: "100%", height: "100px" },
  rectangle: { width: "300px", height: "280px" },
  leaderboard: { width: "100%", height: "100px" },
};

/** Renders raw ad-network HTML and re-executes any <script> tags inside it — browsers
 *  never run scripts injected via innerHTML, so each one is swapped for a fresh node. */
function RawHtmlAd({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = html;
    Array.from(el.querySelectorAll("script")).forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.text = oldScript.textContent || "";
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function AdOverlay({ ad, rectangle }: { ad: AdData; rectangle: boolean }) {
  if (rectangle) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
          {ad.brandName && (
            <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{ad.brandName}</span>
          )}
          {ad.title && <div className="text-white font-bold text-lg leading-tight mt-1">{ad.title}</div>}
          {ad.description && <div className="text-white/50 text-xs mt-1">{ad.description}</div>}
        </div>
        <span className="absolute top-2.5 right-3 text-[8px] text-white/30 font-medium">Sponsored</span>
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-center px-6 sm:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ad.accentColor }} />
            {ad.brandName && (
              <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">{ad.brandName}</span>
            )}
          </div>
          {ad.title && <div className="text-white font-bold text-base sm:text-lg leading-tight">{ad.title}</div>}
          {ad.description && <div className="text-white/60 text-xs mt-0.5 hidden sm:block">{ad.description}</div>}
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className="text-[9px] text-white/30 font-medium">Ad</span>
        </div>
      </div>
    </>
  );
}

function AdMedia({ ad, rectangle }: { ad: AdData; rectangle: boolean }) {
  const content = (
    <div className="w-full h-full rounded-xl overflow-hidden cursor-pointer group relative">
      {ad.adType === "video" ? (
        <video
          src={ad.mediaUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ad.mediaUrl || undefined}
          alt={ad.title || "Advertisement"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <AdOverlay ad={ad} rectangle={rectangle} />
    </div>
  );

  if (ad.ctaUrl) {
    return (
      <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer sponsored" className="block w-full h-full">
        {content}
      </a>
    );
  }
  return content;
}

export default function AdSlot({
  format = "banner",
  className = "",
  slot,
}: {
  format?: AdFormat;
  className?: string;
  slot?: string;
}) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slot) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    fetch(`/backend/ads.php?slot=${encodeURIComponent(slot)}`)
      .then((res) => (res.ok ? res.json() : { ad: null }))
      .then((data) => {
        if (!cancelled) setAd(data.ad || null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slot]);

  if (!loaded || !ad) return null;

  const style = formatStyles[format];
  const rectangle = format === "rectangle";

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl shadow-sm"
        style={{ width: style.width, maxWidth: "728px", height: style.height }}
        data-ad-slot={slot}
      >
        {ad.adType === "code" ? <RawHtmlAd html={ad.customCode || ""} /> : <AdMedia ad={ad} rectangle={rectangle} />}
      </div>
    </div>
  );
}
