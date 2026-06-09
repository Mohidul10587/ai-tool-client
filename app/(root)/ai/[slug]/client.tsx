"use client";

import { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Zap,
  Layers,
  Palette,
  Wand2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedAdsSidebar } from "@/components/featured-ads-sidebar";
import { CommentsSection } from "./comments-section";
import { QASection } from "@/components/qa-section";
import Footer from "@/components/footer";
import { VoteButton } from "./vote-button";
import { PricingCard, ToolInfoCard } from "./tool-sidebar-cards";
import type { ToolDetailsClientProps } from "./types";

const FEATURE_ICONS = [
  <Sparkles className="h-5 w-5" />,
  <Zap className="h-5 w-5" />,
  <Layers className="h-5 w-5" />,
  <Palette className="h-5 w-5" />,
  <Wand2 className="h-5 w-5" />,
  <ImageIcon className="h-5 w-5" />,
];

export function ToolDetailsClient({
  tool,
  featuredAds,
  currentUser,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
}: Omit<ToolDetailsClientProps, "initialComments">) {
  const keyFeatures = tool.key_features ?? [];
  const useCases = tool.use_cases ?? [];
  const pricingInfo = tool.pricing_info;
  const pros = tool.pros ?? [];
  const cons = tool.cons ?? [];
  const qaItems = tool.qa_items ?? [];
  console.log("qaItems", tool);
  const voteProps = {
    toolId: tool.id,
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
  };

  const LogoBox = ({ size }: { size: "sm" | "md" }) => {
    const [imgError, setImgError] = useState(false);
    return (
      <div
        className={`${
          size === "md" ? "w-16 h-16" : "w-14 h-14"
        } bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-200`}
      >
        {tool.logo_url && !imgError ? (
          <img
            src={tool.logo_url}
            alt={tool.name ?? ""}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className={`text-gray-700 font-bold ${
              size === "md" ? "text-2xl" : "text-xl"
            }`}
          >
            {tool.name?.[0] || "?"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative">
      <FeaturedAdsSidebar ads={featuredAds} />
      <div className="pb-16 lg:pb-12">
        <div className="pt-10 lg:pt-0 px-4 py-8 lg:px-56 xl:px-60">
          {/* Header */}
          <div className="mb-8">
            {/* Desktop */}
            <div className="hidden sm:flex items-start gap-4">
              <LogoBox size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-black">{tool.name}</h1>
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
                <VoteButton {...voteProps} />
                {tool.url && (
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
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
                <LogoBox size="sm" />
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
                <VoteButton {...voteProps} />
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
              {tool.hero_image_url && (
                <div className="mb-8 aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={tool.hero_image_url}
                    alt={tool.name ?? ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

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

              {/* Q&A Section */}
              <QASection qaItems={qaItems} />

              {/* Community Discussion */}
              <CommentsSection
                toolId={tool.id}
                toolSlug={tool.slug!}
                currentUser={currentUser}
              />

              <div className="lg:hidden space-y-4">
                {pricingInfo && <PricingCard pricingInfo={pricingInfo} />}
                <ToolInfoCard tool={tool} />
              </div>
            </main>

            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-8 space-y-4">
                {pricingInfo && <PricingCard pricingInfo={pricingInfo} />}
                <ToolInfoCard tool={tool} />
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
