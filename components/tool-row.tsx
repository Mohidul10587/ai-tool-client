"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Bookmark } from "lucide-react";
import { voteOnTool } from "@/lib/vote-actions";
import { toggleSavedTool, isToolSaved } from "@/lib/saved-tools";
import { createClient } from "@/lib/supabase/client";

export type ToolRowData = {
  id: string;
  name: string | null;
  slug: string | null;
  overview: string | null;
  subcategory_snapshot: string | null;
  pricing: string | null;
  logo_url: string | null;
  upvotes?: number;
  downvotes?: number;
  userVote?: 1 | -1 | null;
  url: string | null;
};

function VoteButtons({
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
  const fmt = (n: number) =>
    Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

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
        className={`p-1.5 transition-all hover:bg-black/10 disabled:opacity-50 ${
          userVote === 1 ? "text-black" : "text-black/40"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <polygon points="12,4 22,18 2,18" />
        </svg>
      </button>
      <span className="text-xs font-bold text-black">{fmt(score)}</span>
      <button
        onClick={(e) => handleVote(e, -1)}
        disabled={pending}
        aria-label="Downvote"
        className={`p-1.5 transition-all hover:bg-black/10 disabled:opacity-50 ${
          userVote === -1 ? "text-black" : "text-black/40"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <polygon points="12,20 2,6 22,6" />
        </svg>
      </button>
    </div>
  );
}

export function ToolRow({ tool }: { tool: ToolRowData }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isToolSaved(tool.id));
  }, [tool.id]);

  async function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const isSaved = toggleSavedTool({
      id: tool.id, name: tool.name ?? "", slug: tool.slug ?? "",
      logo_url: tool.logo_url, pricing: tool.pricing,
      subcategory_snapshot: tool.subcategory_snapshot,
    });
    setSaved(isSaved);
  }
  return (
    <div className="group relative">
      <Link
        href={`/ai/${tool.slug}`}
        className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-2.5 transition-all hover:border-black/20 hover:bg-black/5 md:gap-4 md:p-3"
      >
        {tool.logo_url ? (
          <img
            src={tool.logo_url}
            alt={tool.name ?? ""}
            className="h-10 w-10 shrink-0 rounded-lg object-cover md:h-12 md:w-12"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white md:h-12 md:w-12 md:text-base">
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
          <p className="mt-0.5 line-clamp-2 text-xs text-black/60 md:mt-1 md:line-clamp-1">
            {tool.overview}
          </p>
        </div>

        <VoteButtons
          toolId={tool.id}
          initialUpvotes={tool.upvotes ?? 0}
          initialDownvotes={tool.downvotes ?? 0}
          initialUserVote={tool.userVote ?? null}
        />
      </Link>
      <Link
        href={tool.url ?? "#"}
        aria-label="Open in new tab"
        className="absolute right-16 top-1/2 -translate-y-1/2 hidden shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 p-2 opacity-0 transition-all hover:bg-black hover:text-white group-hover:opacity-100 md:flex"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      <button
        onClick={handleBookmark}
        aria-label={saved ? "Remove bookmark" : "Save tool"}
        className={`absolute right-28 top-1/2 -translate-y-1/2 hidden shrink-0 items-center justify-center rounded-lg border p-2 opacity-0 transition-all group-hover:opacity-100 md:flex ${
          saved
            ? "border-black bg-black text-white"
            : "border-black/10 bg-black/5 hover:bg-black hover:text-white"
        }`}
      >
        <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
