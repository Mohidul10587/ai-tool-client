"use client";

import { useState, useEffect } from "react";

type Ad = {
  id: number;
  url: string;
  description: string;
  tool_name: string;
  logo_url?: string;
};

const BG_COLORS = [
  "bg-rose-100",
  "bg-sky-100",
  "bg-amber-100",
  "bg-emerald-100",
  "bg-violet-100",
  "bg-pink-100",
  "bg-cyan-100",
  "bg-orange-100",
  "bg-lime-100",
  "bg-indigo-100",
];

function AdCard({ ad, index }: { ad: Ad; index: number }) {
  const initials = (ad.tool_name || ad.description)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      title={ad.tool_name || ad.description}
      className={`group flex flex-col items-center gap-1.5 rounded-xl border border-black/10 p-3 text-center transition-all hover:border-black/20 hover:shadow-sm w-full ${
        BG_COLORS[index % BG_COLORS.length]
      }`}
    >
      {/* Logo */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black/70 bg-white/60">
        {ad.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.logo_url}
            alt={ad.tool_name}
            className="h-8 w-8 rounded object-contain"
          />
        ) : (
          initials || "AD"
        )}
      </div>
      {/* Name */}
      <p className="w-full truncate text-[11px] font-semibold text-black leading-tight">
        {ad.tool_name || new URL(ad.url).hostname.replace("www.", "")}
      </p>
      {/* Short Description — desktop only */}
      <p className="hidden lg:block w-full truncate text-[10px] text-black/50 leading-tight">
        {ad.description}
      </p>
    </a>
  );
}

function AdSpot({ ads, index }: { ads: Ad[]; index: number }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ads.length);
        setVisible(true);
      }, 300);
    }, 8000);
    return () => clearInterval(t);
  }, [ads.length]);

  if (!ads.length) {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-black/10 bg-gray-50 p-3 text-center w-full">
        <div className="h-10 w-10 rounded-lg bg-black/5" />
        <p className="text-[10px] text-black/20">Ad spot</p>
      </div>
    );
  }

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s" }}>
      <AdCard ad={ads[idx]} index={index} />
    </div>
  );
}

export function Sidebar({ ads }: { ads: Ad[] }) {
  const slots = Array.from({ length: 10 }, (_, i) =>
    ads.filter((_, j) => j % 10 === i)
  );

  return (
    <div className="flex w-37 md:w-45 flex-col gap-2 px-2 py-4">
      {slots.map((slotAds, i) => (
        <AdSpot key={i} ads={slotAds} index={i} />
      ))}
    </div>
  );
}
