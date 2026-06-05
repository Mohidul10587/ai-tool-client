"use client";

import { MobileMarquee } from "@/components/mobile-marquee";

type Ad = { id: number; url: string; description: string; tool_name: string };

export function FeaturedAdsSidebar({ ads }: { ads: Ad[] }) {
  const topAds = ads.slice(0, 10);
  const bottomAds = ads.slice(10, 20);

  return (
    <div className="lg:hidden">
      <div className="fixed top-[52px] left-0 right-0 z-30 border-b border-black/10 bg-white px-2 py-1.5">
        <MobileMarquee ads={topAds} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white px-2 py-1.5">
        <MobileMarquee ads={bottomAds} />
      </div>
    </div>
  );
}
