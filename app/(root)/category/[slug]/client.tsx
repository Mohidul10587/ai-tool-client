"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobileMarqueeAds } from "@/components/mobile-marquee-ads";
import { Sidebar } from "@/components/sidebar";
import { ToolRow } from "@/components/tool-row";
import type { ToolRowData } from "@/components/tool-row";

type Ad = { id: number; url: string; description: string; tool_name: string };

export function CategoryPageClient({
  subcategoryName,
  tools,
  featuredAds,
}: {
  subcategoryName: string;
  tools: ToolRowData[];
  featuredAds: Ad[];
}) {
  const [displayCount, setDisplayCount] = useState(50);

  return (
    <div className="min-h-screen bg-background">
      <MobileMarqueeAds ads={featuredAds} />

      <div className="pb-16 lg:pb-12 flex">
        <div className="hidden lg:block">
          <Sidebar ads={featuredAds.slice(0, 10)} />
        </div>

        <div className="flex-1 min-w-0 px-4 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {subcategoryName}
            </h1>
            <p className="text-lg text-muted-foreground">
              {tools.length} AI tools for {subcategoryName}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {tools.slice(0, displayCount).map((tool) => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </div>
          {displayCount < tools.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setDisplayCount((c) => c + 20)}
              >
                Load More Tools
              </Button>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <Sidebar ads={featuredAds.slice(10, 20)} />
        </div>
      </div>
    </div>
  );
}
