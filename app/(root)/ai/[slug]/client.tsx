"use client";

import { useState, useEffect, useTransition } from "react";
import {
  ExternalLink,
  Sparkles,
  Zap,
  Layers,
  Palette,
  Wand2,
  Image as ImageIcon,
  Send,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addComment,
  deleteComment,
  type CommentRow,
} from "@/lib/comment-actions";
import { FeaturedAdsSidebar } from "@/components/featured-ads-sidebar";
import { Sidebar } from "@/components/sidebar";

type Ad = { id: number; url: string; description: string };

type Tool = {
  id: string;
  name: string | null;
  slug: string | null;
  overview: string | null;
  subcategory_snapshot: string | null;
  pricing: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  url: string | null;
  key_features: { title: string; description: string }[] | null;
  use_cases: { title: string; audience: string; description: string }[] | null;
  pricing_info: {
    model: string;
    paidFrom: string;
    billingFrequency: string;
    freeTrial?: string;
  } | null;
  pros: string[] | null;
  cons: string[] | null;
  platform: string | null;
  short_description: string | null;
  detail_description: string | null;
};

const COLORS = [
  "bg-rose-50",
  "bg-sky-50",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-violet-50",
  "bg-pink-50",
  "bg-cyan-50",
  "bg-orange-50",
  "bg-lime-50",
  "bg-indigo-50",
];

const FEATURE_ICONS = [
  <Sparkles className="h-5 w-5" />,
  <Zap className="h-5 w-5" />,
  <Layers className="h-5 w-5" />,
  <Palette className="h-5 w-5" />,
  <Wand2 className="h-5 w-5" />,
  <ImageIcon className="h-5 w-5" />,
];

// ── Featured Ads Sidebar ─────────────────────────────────────────────────────
function AdSpot({ ads }: { ads: Ad[] }) {
  const [idx, setIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(() => {
      setFlipping(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ads.length);
        setFlipping(false);
      }, 400);
    }, 10000);
    return () => clearInterval(t);
  }, [ads.length]);

  if (!ads.length)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-black/10 bg-gray-50 px-3 py-2">
        <div className="h-8 w-8 rounded-lg bg-black/10 text-[9px] font-medium text-black/30 flex items-center justify-center">
          Logo
        </div>
        <div className="mt-1.5 text-[10px] text-black/20">Ad Spot</div>
      </div>
    );

  const ad = ads[idx];
  const color = COLORS[ad.id % COLORS.length];

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-black/10 px-3 py-2 transition-all hover:border-black/20 hover:shadow-md ${color}`}
      style={{ opacity: flipping ? 0 : 1, transition: "opacity 0.2s" }}
    >
      <div className="text-center">
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-black/10 text-[9px] font-medium text-black/50">
          Logo
        </div>
        <div className="mt-1.5 text-sm font-bold text-black line-clamp-1">
          {ad.description}
        </div>
        <div className="mt-0.5 text-[10px] text-black/60 line-clamp-1">
          {new URL(ad.url).hostname}
        </div>
      </div>
    </a>
  );
}

// ── Vote Button ──────────────────────────────────────────────────────────────
function VoteButton({
  initialVotes = 0,
  size = "default",
}: {
  initialVotes?: number;
  size?: "default" | "small";
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (e: React.MouseEvent, type: "up" | "down") => {
    e.preventDefault();
    e.stopPropagation();
    if (userVote === type) {
      setVotes(type === "up" ? votes - 1 : votes + 1);
      setUserVote(null);
    } else if (!userVote) {
      setVotes(type === "up" ? votes + 1 : votes - 1);
      setUserVote(type);
    } else {
      setVotes(type === "up" ? votes + 2 : votes - 2);
      setUserVote(type);
    }
  };

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const isSmall = size === "small";

  return (
    <div className="flex flex-col items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={(e) => handleVote(e, "up")}
        className={`transition-colors w-full flex items-center justify-center px-2 py-1 hover:bg-gray-50 ${
          userVote === "up" ? "text-black" : "text-gray-400"
        } ${isSmall ? "text-xs" : "text-sm"}`}
      >
        ▲
      </button>
      <span
        className={`font-bold text-black px-2 ${
          isSmall ? "text-xs" : "text-sm"
        }`}
      >
        {fmt(votes)}
      </span>
      <button
        onClick={(e) => handleVote(e, "down")}
        className={`transition-colors w-full flex items-center justify-center px-2 py-1 hover:bg-gray-50 ${
          userVote === "down" ? "text-black" : "text-gray-400"
        } ${isSmall ? "text-xs" : "text-sm"}`}
      >
        ▼
      </button>
    </div>
  );
}

// ── Comment ──────────────────────────────────────────────────────────────────
function CommentItem({
  comment,
  currentUserId,
  toolSlug,
  onDelete,
}: {
  comment: CommentRow;
  currentUserId: string | null;
  toolSlug: string;
  onDelete: (id: string) => void;
}) {
  const [votes, setVotes] = useState({
    up: comment.upvotes,
    down: comment.downvotes,
  });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [pending, startTransition] = useTransition();

  const handleVote = (type: "up" | "down") => {
    const newVotes = { ...votes };
    if (userVote === type) {
      newVotes[type]--;
      setUserVote(null);
    } else {
      if (userVote) newVotes[userVote]--;
      newVotes[type]++;
      setUserVote(type);
    }
    setVotes(newVotes);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteComment(comment.id, toolSlug);
      onDelete(comment.id);
    });
  };

  const profileData = Array.isArray(comment.profiles)
    ? comment.profiles[0]
    : comment.profiles;
  const name = profileData?.name ?? "User";
  const avatar = profileData?.avatar_url ?? "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const timeAgo = new Date(comment.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="flex flex-col items-center shrink-0 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => handleVote("up")}
          className={`text-xs w-full px-2 py-1.5 flex items-center justify-center hover:bg-gray-50 ${
            userVote === "up" ? "text-black" : "text-gray-400"
          }`}
        >
          ▲
        </button>
        <span className="text-xs font-medium text-black px-2">
          {votes.up - votes.down}
        </span>
        <button
          onClick={() => handleVote("down")}
          className={`text-xs w-full px-2 py-1.5 flex items-center justify-center hover:bg-gray-50 ${
            userVote === "down" ? "text-black" : "text-gray-400"
          }`}
        >
          ▼
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-black text-sm">{name}</span>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
          {currentUserId === comment.user_id && (
            <button
              onClick={handleDelete}
              disabled={pending}
              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
type CurrentUser = {
  id: string;
  name: string;
  avatar_url: string | null;
} | null;

export function ToolDetailsClient({
  tool,
  featuredAds,
  initialComments,
  currentUser,
}: {
  tool: Tool;
  featuredAds: Ad[];
  initialComments: CommentRow[];
  currentUser: CurrentUser;
}) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentRow[]>(initialComments);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const keyFeatures = tool.key_features ?? [];
  const useCases = tool.use_cases ?? [];
  const pricingInfo = tool.pricing_info;
  const pros = tool.pros ?? [];
  const cons = tool.cons ?? [];

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await addComment(tool.id, tool.slug!, newComment);
      if (result.error) {
        setError(result.error);
        return;
      }
      // Optimistically prepend with current user info
      const optimistic: CommentRow = {
        id: crypto.randomUUID(),
        user_id: currentUser!.id,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        profiles: {
          name: currentUser!.name,
          avatar_url: currentUser!.avatar_url,
        },
      };
      setComments((prev) => [optimistic, ...prev]);
      setNewComment("");
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white relative">
        <FeaturedAdsSidebar ads={featuredAds} />

        <div className="pb-16 lg:pb-12 flex">
          <div className="hidden lg:block">
            <Sidebar ads={featuredAds.slice(0, 10)} />
          </div>

          <div className="flex-1 min-w-0 px-4 py-8">
            {/* Header */}

            <div className="mb-8">
              <div className="hidden sm:flex items-start gap-4">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {tool.logo_url ? (
                    <img
                      src={tool.logo_url}
                      alt={tool.name ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {tool.name?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-black">
                      {tool.name}
                    </h1>
                    {tool.subcategory_snapshot && (
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {tool.subcategory_snapshot.toUpperCase()}
                      </span>
                    )}
                    {tool.pricing && (
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-black text-white">
                        {tool.pricing.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tool.short_description ?? tool.overview?.slice(0, 160)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <VoteButton />
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              {/* Mobile */}
              <div className="sm:hidden">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {tool.logo_url ? (
                      <img
                        src={tool.logo_url}
                        alt={tool.name ?? ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {tool.name?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-xl font-bold text-black">
                        {tool.name}
                      </h1>
                      {tool.subcategory_snapshot && (
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          {tool.subcategory_snapshot.toUpperCase()}
                        </span>
                      )}
                      {tool.pricing && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-black text-white">
                          {tool.pricing.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <VoteButton />
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              <main className="flex-1 min-w-0">
                {/* Hero image */}
                {tool.hero_image_url && (
                  <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={tool.hero_image_url}
                      alt={tool.name ?? ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Overview */}
                {tool.overview && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-black mb-3">
                      Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {tool.overview}
                    </p>
                  </section>
                )}

                {/* Detail Description */}
                {tool.detail_description && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-black mb-3">
                      Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                      {tool.detail_description}
                    </p>
                  </section>
                )}

                {/* Key Features */}
                {keyFeatures.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-black mb-4">
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {keyFeatures.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="shrink-0 mt-0.5 text-gray-600">
                            {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                          </div>
                          <div>
                            <h3 className="font-medium text-black text-sm mb-0.5">
                              {f.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {f.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Use Cases */}
                {useCases.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-black mb-4">
                      Use Cases
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {useCases.map((u, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                          <h3 className="font-semibold text-black text-sm mb-1">
                            {u.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {u.audience}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {u.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Pros & Cons */}
                {(pros.length > 0 || cons.length > 0) && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-black mb-4">
                      Pros & Cons
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-black text-sm mb-3 flex items-center gap-2">
                          <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs">
                            +
                          </span>
                          Pros
                        </h3>
                        <ul className="space-y-2">
                          {pros.map((p, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-black text-sm mb-3 flex items-center gap-2">
                          <span className="w-5 h-5 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
                            −
                          </span>
                          Cons
                        </h3>
                        <ul className="space-y-2">
                          {cons.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="text-gray-400 mt-0.5">•</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                {/* Community Discussion */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-black mb-4">
                    Community Discussion
                  </h2>
                  {currentUser ? (
                    <div className="mb-4 relative">
                      <Textarea
                        placeholder="Leave a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                            handleSubmit();
                        }}
                        className="min-h-[80px] resize-none pr-12 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={pending || !newComment.trim()}
                        className="absolute bottom-2 right-2 bg-black hover:bg-gray-800 text-white h-8 w-8 p-0"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                      {error && (
                        <p className="text-xs text-red-500 mt-1">{error}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">
                      <a
                        href="/login"
                        className="text-black font-medium underline"
                      >
                        Log in
                      </a>{" "}
                      to leave a comment.
                    </p>
                  )}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No comments yet. Be the first!
                      </p>
                    ) : (
                      comments.map((c) => (
                        <CommentItem
                          key={c.id}
                          comment={c}
                          currentUserId={currentUser?.id ?? null}
                          toolSlug={tool.slug!}
                          onDelete={(id) =>
                            setComments((prev) =>
                              prev.filter((x) => x.id !== id)
                            )
                          }
                        />
                      ))
                    )}
                  </div>
                </section>

                {/* Mobile: Pricing + Tool Info */}
                <div className="lg:hidden space-y-4">
                  {pricingInfo && <PricingCard pricingInfo={pricingInfo} />}
                  <ToolInfoCard tool={tool} />
                </div>
              </main>

              {/* Right sidebar */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-8 space-y-4">
                  {pricingInfo && <PricingCard pricingInfo={pricingInfo} />}
                  <ToolInfoCard tool={tool} />
                </div>
              </aside>
            </div>
          </div>

          <div className="hidden lg:block">
            <Sidebar ads={featuredAds.slice(10, 20)} />
          </div>
        </div>
      </div>
    </>
  );
}

function PricingCard({
  pricingInfo,
}: {
  pricingInfo: {
    model: string;
    paidFrom: string;
    billingFrequency: string;
    freeTrial?: string;
  };
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-black mb-4">Pricing</h2>
      <div className="space-y-3">
        {pricingInfo.model && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Pricing model</p>
            <p className="text-sm font-medium text-black">
              {pricingInfo.model}
            </p>
          </div>
        )}
        {pricingInfo.paidFrom && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Paid option from</p>
            <p className="text-sm font-medium text-black">
              {pricingInfo.paidFrom}
            </p>
          </div>
        )}
        {pricingInfo.billingFrequency && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Billing frequency</p>
            <p className="text-sm font-medium text-black">
              {pricingInfo.billingFrequency}
            </p>
          </div>
        )}
        {pricingInfo.freeTrial && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Free Trial</p>
            <p className="text-sm font-medium text-black">
              {pricingInfo.freeTrial}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolInfoCard({ tool }: { tool: Tool }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-black mb-4">Tool Info</h2>
      <div className="space-y-3">
        {tool.url && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Website</p>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-black hover:underline"
            >
              {new URL(tool.url).hostname}
            </a>
          </div>
        )}
        {tool.platform && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Platform</p>
            <p className="text-sm font-medium text-black">{tool.platform}</p>
          </div>
        )}
        {tool.subcategory_snapshot && (
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Category</p>
            <p className="text-sm font-medium text-black">
              {tool.subcategory_snapshot}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
