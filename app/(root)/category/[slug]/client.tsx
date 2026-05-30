"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedAdsSidebar } from "@/components/featured-ads-sidebar";

type Tool = {
  id: string;
  name: string | null;
  slug: string | null;
  overview: string | null;
  subcategory_snapshot: string | null;
  pricing: string | null;
  logo_url: string | null;
};

type Ad = { id: number; url: string; description: string };

function VoteButtons() {
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const up = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setVotes((v) => voted === "up" ? v - 1 : voted === "down" ? v + 2 : v + 1); setVoted((v) => v === "up" ? null : "up"); };
  const down = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setVotes((v) => voted === "down" ? v + 1 : voted === "up" ? v - 2 : v - 1); setVoted((v) => v === "down" ? null : "down"); };
  return (
    <div className="flex shrink-0 flex-col items-center rounded-lg border border-black/20 bg-black/5">
      <button onClick={up} className={`p-1.5 transition-all hover:bg-black/10 ${voted === "up" ? "text-black" : "text-black/40"}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><polygon points="12,4 22,18 2,18" /></svg>
      </button>
      <span className="text-xs font-bold text-black">{votes >= 1000 ? `${(votes / 1000).toFixed(1)}k` : votes}</span>
      <button onClick={down} className={`p-1.5 transition-all hover:bg-black/10 ${voted === "down" ? "text-black" : "text-black/40"}`}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><polygon points="12,20 2,6 22,6" /></svg>
      </button>
    </div>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex items-center gap-3 rounded-lg border border-black/10 bg-white p-2.5 transition-all hover:border-black/20 hover:bg-black/5 md:gap-4 md:p-3"
    >
      {tool.logo_url ? (
        <img src={tool.logo_url} alt={tool.name ?? ""} className="h-10 w-10 shrink-0 rounded-lg object-cover md:h-12 md:w-12" />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white md:h-12 md:w-12">
          {tool.name?.charAt(0) ?? "?"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h4 className="text-sm font-semibold text-black">{tool.name}</h4>
          {tool.subcategory_snapshot && (
            <span className="hidden rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-black/70 md:inline-block">
              {tool.subcategory_snapshot}
            </span>
          )}
          {tool.pricing && (
            <span className="hidden rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-white md:inline-block">
              {tool.pricing}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-black/60 md:mt-1 md:line-clamp-1">{tool.overview}</p>
      </div>
      <VoteButtons />
    </Link>
  );
}

export function CategoryPageClient({
  subcategoryName,
  tools,
  featuredAds,
}: {
  subcategoryName: string;
  tools: Tool[];
  featuredAds: Ad[];
}) {
  const [displayCount, setDisplayCount] = useState(50);

  return (
    <div className="min-h-screen bg-background">
      <FeaturedAdsSidebar ads={featuredAds} />
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-0">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">{subcategoryName}</h1>
          <p className="text-lg text-muted-foreground">{tools.length} AI tools for {subcategoryName}</p>
        </div>
        <div className="flex flex-col gap-3">
          {tools.slice(0, displayCount).map((tool) => (
            <ToolRow key={tool.id} tool={tool} />
          ))}
        </div>
        {displayCount < tools.length && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => setDisplayCount((c) => c + 20)}>
              Load More Tools
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
