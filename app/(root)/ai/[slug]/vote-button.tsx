"use client";

import { useState, useTransition } from "react";
import { voteOnTool } from "@/lib/vote-actions";

export function VoteButton({
  toolId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
}: {
  toolId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: 1 | -1 | null;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<1 | -1 | null>(initialUserVote);
  const [pending, startTransition] = useTransition();

  const score = upvotes - downvotes;
  const fmt = (n: number) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  function handleVote(e: React.MouseEvent, vote: 1 | -1) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await voteOnTool(toolId, vote);
      if (result.error === "Login required") {
        window.location.href = "/login";
        return;
      }
      if (!result.error) {
        setUpvotes(result.upvotes);
        setDownvotes(result.downvotes);
        setUserVote(result.userVote);
      }
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-center rounded-lg border border-black/20 bg-black/5">
      <button
        onClick={(e) => handleVote(e, 1)}
        disabled={pending}
        aria-label="Upvote"
        className={`p-1.5 transition-all hover:bg-black/10 disabled:opacity-50 ${userVote === 1 ? "text-black" : "text-black/40"}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><polygon points="12,4 22,18 2,18" /></svg>
      </button>
      <span className="text-xs font-bold text-black">{fmt(score)}</span>
      <button
        onClick={(e) => handleVote(e, -1)}
        disabled={pending}
        aria-label="Downvote"
        className={`p-1.5 transition-all hover:bg-black/10 disabled:opacity-50 ${userVote === -1 ? "text-black" : "text-black/40"}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><polygon points="12,20 2,6 22,6" /></svg>
      </button>
    </div>
  );
}
