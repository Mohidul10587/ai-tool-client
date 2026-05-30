"use client";

import { cn } from "@/lib/utils";
import type { ChatTool } from "@/lib/chat-tools-data";

interface ToolCardProps {
  tool: ChatTool;
  votes: number;
  userVote: "up" | "down" | null;
  onVote: (direction: "up" | "down") => void;
}

function formatVotes(votes: number): string {
  if (votes >= 1000) {
    return (votes / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return votes.toString();
}

export function ToolCard({ tool, votes, userVote, onVote }: ToolCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow">
      {/* Tool Icon */}
      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
        {tool.initial}
      </div>

      {/* Tool Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground">{tool.name}</h3>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
            {tool.category}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-primary text-primary-foreground">
            {tool.pricing}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {tool.description}
        </p>
      </div>

      {/* Voting Section */}
      <div className="flex flex-col items-center shrink-0 border border-border rounded-lg p-1">
        {/* Upvote Triangle */}
        <button
          onClick={() => onVote("up")}
          className="p-1.5 transition-colors hover:bg-muted rounded"
          aria-label="Upvote"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            className={cn(
              "transition-colors",
              userVote === "up" ? "fill-foreground" : "fill-muted-foreground"
            )}
          >
            <path d="M7 0L14 8H0L7 0Z" />
          </svg>
        </button>

        {/* Vote Count */}
        <span className="text-sm font-semibold text-foreground py-0.5">
          {formatVotes(votes)}
        </span>

        {/* Downvote Triangle */}
        <button
          onClick={() => onVote("down")}
          className="p-1.5 transition-colors hover:bg-muted rounded"
          aria-label="Downvote"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            className={cn(
              "transition-colors",
              userVote === "down" ? "fill-foreground" : "fill-muted-foreground"
            )}
          >
            <path d="M7 8L0 0H14L7 8Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
