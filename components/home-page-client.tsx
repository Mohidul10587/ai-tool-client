"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Image,
  Code,
  Video,
  Music,
  FileText,
  Briefcase,
  Megaphone,
  PenTool,
  Database,
  Bot,
  TrendingUp,
  Globe,
  Mic,
  GraduationCap,
  DollarSign,
  Headphones,
  Layers,
  Users,
  Cpu,
  Mail,
  Calendar,
  BookOpen,
  Sparkles,
  Shield,
  Box,
  Gamepad2,
  Wallet,
  Clock,
  UserCheck,
  Heart,
  Scale,
  Building,
  ChevronDown,
  ChevronUp,
  Presentation,
} from "lucide-react";
import type { Category } from "@/types/mega-menu";
import { ToolRow } from "@/components/tool-row";
import type { ToolRowData } from "@/components/tool-row";
import { FeaturedAdsSidebar } from "@/components/featured-ads-sidebar";
import { Sidebar } from "@/components/sidebar";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: Layers,
  Chat: MessageSquare,
  Image,
  Writing: FileText,
  Code,
  Video,
  Productivity: Briefcase,
  Marketing: Megaphone,
  Audio: Music,
  Search,
  Design: PenTool,
  Data: Database,
  Automation: Bot,
  SEO: TrendingUp,
  Translation: Globe,
  Voice: Mic,
  Education: GraduationCap,
  Sales: DollarSign,
  Support: Headphones,
  Agents: Users,
  Models: Cpu,
  Music,
  Email: Mail,
  Meetings: Calendar,
  Presentations: Presentation,
  Research: BookOpen,
  Prompts: Sparkles,
  Security: Shield,
  "3D": Box,
  Gaming: Gamepad2,
  Finance: Wallet,
  Scheduling: Clock,
  HR: UserCheck,
  Healthcare: Heart,
  Legal: Scale,
  Property: Building,
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

type Ad = { id: number; url: string; description: string; tool_name: string };

// ── Main Component ────────────────────────────────────────────────────────────
export function HomePageClient({
  tools,
  categories,
  selectedSubcategory,
  featuredAds = [],
}: {
  tools: ToolRowData[];
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
      const matchSearch =
        !search ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.overview?.toLowerCase().includes(search.toLowerCase());
      const matchSubcat =
        !activeSubcat ||
        categories.some((c) =>
          c.subcategories?.some(
            (s) => s.slug === activeSubcat && t.subcategory_snapshot === s.name
          )
        );
      const matchPricing =
        !pricingFilter || t.pricing?.toLowerCase() === pricingFilter;
      return matchSearch && matchSubcat && matchPricing;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return 0; // already ordered by updated_at from server
      return 0;
    });

  const visible = filtered.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-white relative px-4">
      <FeaturedAdsSidebar ads={featuredAds} />

      <div className="pb-16 lg:pb-12 flex">
        <div className="hidden lg:block">
          <Sidebar ads={featuredAds.slice(0, 10)} />
        </div>

        <main className="flex-1 pt-10 lg:pt-0 max-w-4xl mx-auto">
          {/* Hero */}
          <section className="px-4 pb-4 pt-4 text-center">
            <h1 className="text-xl font-bold tracking-tight text-black md:text-2xl">
              Discover the Best AI Tools
            </h1>
            <p className="mx-auto mt-1.5 max-w-lg text-xs text-black/60 md:text-sm">
              Explore thousands of AI-powered tools to supercharge your
              productivity, creativity, and workflow.
            </p>
            <div className="mx-auto mt-3 max-w-sm flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDisplayCount(50);
                  }}
                  className="w-full rounded-lg border border-black/10 bg-black/5 py-1.5 pl-8 pr-3 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none"
                />
              </div>
              <button className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/80">
                Search
              </button>
            </div>
          </section>

          {/* Category chips */}
          <section className="px-4 pb-4">
            <div className="flex flex-wrap justify-center gap-1.5">
              {visibleCats.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setActiveSubcat(cat.slug);
                      setDisplayCount(50);
                    }}
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
                  {showAllCats ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            )}
          </section>

          {/* Tools list */}
          <section className="px-4 pb-16">
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
                  {f === "newest"
                    ? "Newest"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {visible.length === 0 ? (
                <p className="py-12 text-center text-sm text-black/40">
                  No tools found
                </p>
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

        <div className="hidden lg:block">
          <Sidebar ads={featuredAds.slice(10, 20)} />
        </div>
      </div>
    </div>
  );
}
