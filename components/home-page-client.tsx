"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, MessageSquare, Image, Code, Video, Music, FileText,
  Briefcase, Megaphone, PenTool, Database, Bot, TrendingUp, Globe,
  Mic, GraduationCap, DollarSign, Headphones, Layers, Users, Cpu,
  Mail, Calendar, BookOpen, Sparkles, Shield, Box, Gamepad2, Wallet,
  Clock, UserCheck, Heart, Scale, Building, ChevronDown, ChevronUp,
  ExternalLink, Presentation,
} from "lucide-react";
import type { Category } from "@/types/mega-menu";
import { FeaturedAdsSidebar } from "@/components/featured-ads-sidebar";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: Layers, Chat: MessageSquare, Image, Writing: FileText, Code,
  Video, Productivity: Briefcase, Marketing: Megaphone, Audio: Music,
  Search, Design: PenTool, Data: Database, Automation: Bot, SEO: TrendingUp,
  Translation: Globe, Voice: Mic, Education: GraduationCap, Sales: DollarSign,
  Support: Headphones, Agents: Users, Models: Cpu, Music, Email: Mail,
  Meetings: Calendar, Presentations: Presentation, Research: BookOpen,
  Prompts: Sparkles, Security: Shield, "3D": Box, Gaming: Gamepad2,
  Finance: Wallet, Scheduling: Clock, HR: UserCheck, Healthcare: Heart,
  Legal: Scale, Property: Building,
};

const COLORS = [
  "bg-rose-50", "bg-sky-50", "bg-amber-50", "bg-emerald-50", "bg-violet-50",
  "bg-pink-50", "bg-cyan-50", "bg-orange-50", "bg-lime-50", "bg-indigo-50",
];

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

// ── Vote Buttons ─────────────────────────────────────────────────────────────
function VoteButtons() {
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const up = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setVotes((v) => voted === "up" ? v - 1 : voted === "down" ? v + 2 : v + 1);
    setVoted((v) => v === "up" ? null : "up");
  };
  const down = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setVotes((v) => voted === "down" ? v + 1 : voted === "up" ? v - 2 : v - 1);
    setVoted((v) => v === "down" ? null : "down");
  };

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

// ── Tool Row ─────────────────────────────────────────────────────────────────
function ToolRow({ tool }: { tool: Tool }) {
  const pricingLabel = tool.pricing ? tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1) : null;

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex items-center gap-3 rounded-lg border border-black/10 bg-white p-2.5 transition-all hover:border-black/20 hover:bg-black/5 md:gap-4 md:p-3"
    >
      {tool.logo_url ? (
        <img src={tool.logo_url} alt={tool.name ?? ""} className="h-10 w-10 shrink-0 rounded-lg object-cover md:h-12 md:w-12" />
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
          {pricingLabel && (
            <span className="hidden rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-white md:inline-block">
              {pricingLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-black/60 md:mt-1 md:line-clamp-1">{tool.overview}</p>
      </div>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/tool/${tool.slug}`, "_blank"); }}
        className="hidden shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 p-2 opacity-0 transition-all hover:bg-black hover:text-white group-hover:opacity-100 md:flex"
      >
        <ExternalLink className="h-4 w-4" />
      </button>
      <VoteButtons />
    </Link>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function HomePageClient({
  tools,
  categories,
  selectedSubcategory,
  featuredAds = [],
}: {
  tools: Tool[];
  categories: Category[];
  selectedSubcategory?: string;
  featuredAds?: Ad[];
}) {
  const [search, setSearch] = useState("");
  const [activeSubcat, setActiveSubcat] = useState(selectedSubcategory ?? "");
  const [pricingFilter, setPricingFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showAllCats, setShowAllCats] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);

  // Build flat subcategory list with icons
  const subcats = [
    { slug: "", name: "All", icon: Layers },
    ...categories.flatMap((c) =>
      (c.subcategories ?? []).map((s) => ({
        slug: s.slug,
        name: s.name,
        icon: CATEGORY_ICONS[s.name] ?? Layers,
      }))
    ),
  ];

  const visibleCats = showAllCats ? subcats : subcats.slice(0, 20);

  const filtered = tools
    .filter((t) => {
      const matchSearch = !search ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.overview?.toLowerCase().includes(search.toLowerCase());
      const matchSubcat = !activeSubcat ||
        categories.some((c) =>
          c.subcategories?.some((s) => s.slug === activeSubcat && t.subcategory_snapshot === s.name)
        );
      const matchPricing = !pricingFilter || t.pricing?.toLowerCase() === pricingFilter;
      return matchSearch && matchSubcat && matchPricing;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return 0; // already ordered by updated_at from server
      return 0;
    });

  const visible = filtered.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-white">
      <FeaturedAdsSidebar ads={featuredAds} />

      <div className="pb-12 lg:pb-12 pb-16">
        <main className="pt-10 lg:pt-0">
          {/* Hero */}
          <section className="px-4 pb-4 pt-4 text-center lg:px-56 xl:px-60">
            <h1 className="text-xl font-bold tracking-tight text-black md:text-2xl">
              Discover the Best AI Tools
            </h1>
            <p className="mx-auto mt-1.5 max-w-lg text-xs text-black/60 md:text-sm">
              Explore thousands of AI-powered tools to supercharge your productivity, creativity, and workflow.
            </p>
            <div className="mx-auto mt-3 max-w-sm flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setDisplayCount(50); }}
                  className="w-full rounded-lg border border-black/10 bg-black/5 py-1.5 pl-8 pr-3 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none"
                />
              </div>
              <button className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/80">
                Search
              </button>
            </div>
          </section>

          {/* Category chips */}
          <section className="px-4 pb-4 lg:px-56 xl:px-60">
            <div className="flex flex-wrap justify-center gap-1.5">
              {visibleCats.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => { setActiveSubcat(cat.slug); setDisplayCount(50); }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      activeSubcat === cat.slug
                        ? "bg-black text-white"
                        : "border border-black/10 bg-black/5 text-black/70 hover:border-black/20 hover:text-black"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
            {subcats.length > 20 && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowAllCats((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full border border-black/20 bg-black/5 px-3 py-1.5 text-xs font-medium text-black/70 hover:bg-black/10 hover:text-black"
                >
                  {showAllCats ? <><span>Show less</span><ChevronUp className="h-3 w-3" /></> : <><span>Show more</span><ChevronDown className="h-3 w-3" /></>}
                </button>
              </div>
            )}
          </section>

          {/* Tools list */}
          <section className="px-4 pb-16 lg:px-56 xl:px-60">
            {/* Sort/filter row */}
            <div className="mb-3 flex justify-end gap-1.5 flex-wrap">
              {["newest", "free", "freemium", "paid"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    if (["free", "freemium", "paid"].includes(f)) {
                      setPricingFilter(pricingFilter === f ? null : f);
                      setSortBy("newest");
                    } else {
                      setSortBy(f);
                      setPricingFilter(null);
                    }
                    setDisplayCount(50);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all capitalize ${
                    (f === sortBy && !pricingFilter) || pricingFilter === f
                      ? "bg-black text-white"
                      : "border border-black/10 bg-black/5 text-black/70 hover:border-black/20 hover:text-black"
                  }`}
                >
                  {f === "newest" ? "Newest" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {visible.length === 0 ? (
                <p className="py-12 text-center text-sm text-black/40">No tools found</p>
              ) : (
                visible.map((tool) => <ToolRow key={tool.id} tool={tool} />)
              )}
            </div>

            {displayCount < filtered.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setDisplayCount((c) => c + 20)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/5 px-5 py-2 text-sm font-medium text-black hover:bg-black/10"
                >
                  Load More Tools
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
