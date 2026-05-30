"use client";

import { useState, useEffect, useRef } from "react";

type Ad = { id: number; url: string; description: string; tool_name: string };

const COLORS = [
  "bg-rose-50", "bg-sky-50", "bg-amber-50", "bg-emerald-50", "bg-violet-50",
  "bg-pink-50", "bg-cyan-50", "bg-orange-50", "bg-lime-50", "bg-indigo-50",
];

function AdSpot({ ads, slotIndex }: { ads: Ad[]; slotIndex: number }) {
  const [idx, setIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(() => {
      setFlipping(true);
      setTimeout(() => { setIdx((i) => (i + 1) % ads.length); setFlipping(false); }, 400);
    }, 10000);
    return () => clearInterval(t);
  }, [ads.length]);

  if (!ads.length) return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-black/10 bg-gray-50 px-3 py-2">
      <div className="h-8 w-8 rounded-lg bg-black/10 text-[9px] font-medium text-black/30 flex items-center justify-center">AD</div>
      <div className="mt-1.5 text-[10px] text-black/20">Ad Spot</div>
    </div>
  );

  const ad = ads[idx];

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-black/10 px-3 py-2 transition-all hover:border-black/20 hover:shadow-md ${COLORS[slotIndex % COLORS.length]}`}
      style={{ opacity: flipping ? 0 : 1, transition: "opacity 0.2s" }}
    >
      <div className="text-center">
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-black/10 text-[9px] font-bold text-black/70 leading-tight overflow-hidden">
          {ad.tool_name ? ad.tool_name.slice(0, 2).toUpperCase() : "AD"}
        </div>
        <div className="mt-1.5 text-xs font-bold text-black line-clamp-1">{ad.tool_name || ad.description}</div>
        <div className="mt-0.5 text-sm font-semibold text-black line-clamp-1">{ad.description}</div>
        <div className="mt-0.5 text-[10px] text-black/60 line-clamp-1">{new URL(ad.url).hostname}</div>
      </div>
    </a>
  );
}

function MobileMarquee({ ads }: { ads: Ad[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!ads.length) return null;

  // Duplicate for seamless loop
  const items = [...ads, ...ads];

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-2 animate-marquee"
        style={{ width: "max-content" }}
      >
        {items.map((ad, i) => (
          <a
            key={i}
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`flex shrink-0 items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 ${COLORS[i % COLORS.length]}`}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black/10 text-[9px] font-bold text-black/70">
              {ad.tool_name ? ad.tool_name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <span className="whitespace-nowrap text-xs font-semibold text-black">{ad.tool_name || ad.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function FeaturedAdsSidebar({ ads }: { ads: Ad[] }) {
  const slots = Array.from({ length: 10 }, (_, i) => ads.filter((_, j) => j % 10 === i));
  const topAds = ads.slice(0, 10);
  const bottomAds = ads.slice(10, 20);

  return (
    <>
      {/* Mobile: top + bottom marquee */}
      <div className="lg:hidden">
        <div className="fixed top-[52px] left-0 right-0 z-30 border-b border-black/10 bg-white px-2 py-1.5">
          <MobileMarquee ads={topAds} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white px-2 py-1.5">
          <MobileMarquee ads={bottomAds} />
        </div>
      </div>

      {/* Desktop: left + right sidebars */}
      <div className="hidden lg:block">
        <div className="fixed left-2 top-[52px] flex h-[calc(100vh-52px)] w-48 flex-col gap-2 py-2 xl:left-3 xl:w-52">
          {slots.slice(0, 5).map((slotAds, i) => (
            <div key={i} className="flex-1"><AdSpot ads={slotAds} slotIndex={i} /></div>
          ))}
        </div>
        <div className="fixed right-2 top-[52px] flex h-[calc(100vh-52px)] w-48 flex-col gap-2 py-2 xl:right-3 xl:w-52">
          {slots.slice(5, 10).map((slotAds, i) => (
            <div key={i} className="flex-1"><AdSpot ads={slotAds} slotIndex={i + 5} /></div>
          ))}
        </div>
      </div>
    </>
  );
}
