"use client";

import { useRef } from "react";

type Ad = { id: number; url: string; description: string; tool_name: string };

const COLORS = [
  "bg-rose-50", "bg-sky-50", "bg-amber-50", "bg-emerald-50", "bg-violet-50",
  "bg-pink-50", "bg-cyan-50", "bg-orange-50", "bg-lime-50", "bg-indigo-50",
];

export function MobileMarquee({ ads }: { ads: Ad[] }) {
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
            className={`flex shrink-0 items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 ${COLORS[i % COLORS.length]}`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-black/10 text-[9px] font-bold text-black/70">
              {(ad.tool_name || ad.description).split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()??"").join("") || "AD"}
            </div>
            <span className="whitespace-nowrap text-xs font-semibold text-black">{ad.tool_name || ad.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
