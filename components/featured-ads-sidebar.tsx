"use client";

import { useState, useEffect, useRef } from "react";

type Ad = {
  id: number;
  url: string;
  description: string;
  tool_name: string;
  logo_url?: string | null;
};

const COLORS = [
  "bg-rose-50",
  "bg-sky-50",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-violet-50",
  "bg-pink-50",
  "bg-cyan-50",
  "bg-orange-50",
  "bg-lime-50",
  "bg-indigo-50",
];

function AdCard({
  currentAd,
  nextAd,
  isFlipping,
  flipDelay,
  colorIndex,
}: {
  currentAd: Ad | null;
  nextAd: Ad | null;
  isFlipping: boolean;
  flipDelay: number;
  colorIndex: number;
}) {
  const [displayed, setDisplayed] = useState<Ad | null>(currentAd);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isFlipping && nextAd) {
      const t1 = setTimeout(() => setAnimating(true), flipDelay);
      const t2 = setTimeout(() => setDisplayed(nextAd), flipDelay + 400);
      const t3 = setTimeout(() => setAnimating(false), flipDelay + 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isFlipping, nextAd, flipDelay]);

  useEffect(() => {
    if (!isFlipping) setDisplayed(currentAd);
  }, [currentAd, isFlipping]);

  if (!displayed)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-black/10 bg-gray-50 p-3">
        <div className="h-8 w-8 rounded-lg bg-black/5" />
        <p className="mt-1 text-[10px] text-black/20">Ad spot</p>
      </div>
    );

  const initials =
    (displayed.tool_name || displayed.description)
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "AD";

  return (
    <a
      href={displayed.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-black/10 px-3 py-2 transition-all hover:border-black/20 hover:shadow-md ${
        COLORS[colorIndex % COLORS.length]
      }`}
      style={{
        animation: animating ? "flip 0.8s ease-in-out forwards" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="text-center" style={{ backfaceVisibility: "hidden" }}>
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/60 overflow-hidden">
          {displayed.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayed.logo_url}
              alt={displayed.tool_name}
              className="h-7 w-7 rounded object-contain"
            />
          ) : (
            <span className="text-[9px] font-bold text-black/70">{initials}</span>
          )}
        </div>
        <div className="mt-1.5 text-xs font-bold text-black line-clamp-1">
          {displayed.tool_name || displayed.description}
        </div>
        <div className="mt-0.5 text-[10px] text-black/60 line-clamp-1">
          {displayed.description}
        </div>
      </div>
    </a>
  );
}

function AdColumn({ ads, startIndex }: { ads: Ad[]; startIndex: number }) {
  const [page, setPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(ads.length / pageSize));

  const currentSlice = ads.slice(page * pageSize, page * pageSize + pageSize);
  const nextPage = (page + 1) % totalPages;
  const nextSlice = ads.slice(nextPage * pageSize, nextPage * pageSize + pageSize);

  useEffect(() => {
    if (ads.length <= pageSize) return;
    const t = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setPage((p) => (p + 1) % totalPages);
        setIsFlipping(false);
      }, 1500);
    }, 10000);
    return () => clearInterval(t);
  }, [ads.length, totalPages]);

  return (
    <div className="flex h-full flex-col gap-2 py-2">
      {Array.from({ length: pageSize }, (_, i) => (
        <div key={i} className="flex-1 min-h-[60px]">
          <AdCard
            currentAd={currentSlice[i] ?? null}
            nextAd={nextSlice[i] ?? null}
            isFlipping={isFlipping}
            flipDelay={150 * i}
            colorIndex={startIndex + i}
          />
        </div>
      ))}
    </div>
  );
}

function MobileMarquee({ ads }: { ads: Ad[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (!ads.length) return null;
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
            className={`flex shrink-0 items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 ${
              COLORS[i % COLORS.length]
            }`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-black/10 overflow-hidden">
              {ad.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.logo_url}
                  alt={ad.tool_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[9px] font-bold text-black/70">
                  {(ad.tool_name || ad.description)
                    .split(" ")
                    .filter((w) => /^[a-zA-Z]/.test(w))
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("") || "AD"}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap text-xs font-semibold text-black">
              {ad.tool_name || ad.description}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function FeaturedAdsSidebar({ ads }: { ads: Ad[] }) {
  const leftAds = ads.filter((_, i) => i % 2 === 0);
  const rightAds = ads.filter((_, i) => i % 2 === 1);

  return (
    <>
      {/* Mobile: top + bottom marquee */}
      <div className="lg:hidden">
        <div className="fixed top-[52px] left-0 right-0 z-30 border-b border-black/10 bg-white px-2 py-1.5">
          <MobileMarquee ads={ads.slice(0, 10)} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white px-2 py-1.5">
          <MobileMarquee ads={ads.slice(10, 20)} />
        </div>
      </div>

      {/* Desktop: left + right fixed sidebars */}
      <div className="hidden lg:block">
        <div className="fixed left-2 top-[52px] w-48 h-[calc(100vh-52px)] xl:left-3 xl:w-52">
          <AdColumn ads={leftAds} startIndex={0} />
        </div>
        <div className="fixed right-2 top-[52px] w-48 h-[calc(100vh-52px)] xl:right-3 xl:w-52">
          <AdColumn ads={rightAds} startIndex={10} />
        </div>
      </div>
    </>
  );
}
