"use client";

import { cn } from "@/lib/utils";
import type { FeaturedTool } from "@/lib/chat-tools-data";

interface FeaturedToolCardProps {
  tool: FeaturedTool;
}

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer",
        tool.bgColor
      )}
    >
      <div className="w-12 h-12 rounded-full bg-white/80 border border-border flex items-center justify-center mb-3">
        <span className="text-xs text-muted-foreground">Logo</span>
      </div>
      <h4 className="font-semibold text-foreground text-sm">{tool.name}</h4>
      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
    </div>
  );
}
