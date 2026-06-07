"use client";

import { MobileMarquee } from "@/components/mobile-marquee";

type Ad = {
  id: number;
  url: string;
  description: string;
  tool_name: string;
  logo_url?: string | null;
};

export function MobileMarqueeAds({ ads }: { ads: Ad[] }) {
  if (!ads.length) return null;

  return (
    <div className="lg:hidden">
      <div className="fixed top-13 left-0 right-0 z-30 border-b border-black/10 bg-white px-2 py-1.5">
        <MobileMarquee ads={ads} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white px-2 py-1.5">
        <MobileMarquee ads={[...ads].reverse()} />
      </div>
    </div>
  );
}
