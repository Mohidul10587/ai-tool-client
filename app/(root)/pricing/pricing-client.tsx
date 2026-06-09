"use client";

import { useState, useRef } from "react";
import {
  Check,
  Sparkles,
  Flame,
  Globe,
  Star,
  Send,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitFeaturedAd } from "@/lib/featured-ads-actions";
import { submitSubmissionService } from "@/lib/submission-service-actions";
import { submitPublicReview } from "@/lib/public-review-actions";
import { submitTool } from "@/lib/submission-actions";
import type { PricingSettings } from "@/lib/pricing-settings";
import Footer2 from "@/components/footer2";

const testimonials = [
  {
    quote:
      "The Featured Spot on ABC was a game-changer for us. We saw a 400% increase in sign-ups within the first week. Shipon personally helped us optimize our listing for maximum impact.",
    name: "David Kumar",
    role: "Founder of VoxFlow",
    rating: 5,
  },
  {
    quote:
      "The submission service was incredible. ABC handled everything and my domain rating went from 5 to 28 in two months. Worth every penny for the time it saved me.",
    name: "Jessica Lane",
    role: "CEO of NeuralOps",
    rating: 5,
  },
  {
    quote:
      "The public review on ABC is driving consistent traffic to our site. The 1000+ word article is well-researched and ranks #3 for our main keyword. The do-follow backlink has been invaluable for our SEO strategy.",
    name: "Marcus Chen",
    role: "Co-founder of SynapseAI",
    rating: 5,
  },
];

type ModalType = "premium" | "featured" | "submission" | "review" | null;

export default function PricingClient({
  isLoggedIn = false,
  pricing,
}: {
  isLoggedIn?: boolean;
  pricing: PricingSettings;
}) {
  const p = pricing;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toolUrl, setToolUrl] = useState("");
  const [toolName, setToolName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"60" | "110">("60");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setActiveModal(null);
    setToolUrl("");
    setToolName("");
    setShortDescription("");
    setSelectedPlan("60");
    setSubmitMessage(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  const handleFeaturedSubmit = async () => {
    if (!toolUrl || !toolName || !shortDescription) return;
    setSubmitting(true);
    let logo_url: string | undefined;
    if (logoFile) {
      const fd = new FormData();
      fd.append("file", logoFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setSubmitMessage(json.error ?? "Logo upload failed");
        setSubmitting(false);
        return;
      }
      logo_url = json.url;
    }
    const result = await submitFeaturedAd({
      url: toolUrl,
      tool_name: toolName,
      description: shortDescription,
      logo_url,
    });
    setSubmitting(false);
    if (result.error) {
      setSubmitMessage(result.error);
    } else {
      setSubmitMessage("Submitted! Awaiting admin approval.");
    }
  };

  const handleSubmissionServiceSubmit = async () => {
    if (!toolUrl || !toolName) return;
    setSubmitting(true);
    const result = await submitSubmissionService(
      toolUrl,
      selectedPlan,
      toolName
    );
    setSubmitting(false);
    if (result.error) {
      setSubmitMessage(result.error);
    } else {
      setSubmitMessage("Submitted! Awaiting admin approval.");
    }
  };

  const handlePublicReviewSubmit = async () => {
    if (!toolUrl || !toolName) return;
    setSubmitting(true);
    const result = await submitPublicReview(toolUrl, toolName);
    setSubmitting(false);
    if (result.error) {
      setSubmitMessage(result.error);
    } else {
      setSubmitMessage("Submitted! Awaiting admin approval.");
    }
  };

  const handlePremiumSubmit = async () => {
    if (!toolUrl || !toolName) return;
    setSubmitting(true);
    const result = await submitTool(toolUrl, toolName);
    setSubmitting(false);
    if (result.error) {
      setSubmitMessage(result.error);
    } else {
      setSubmitMessage("Submitted! Awaiting admin approval.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Submit Your AI Tool
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Get your product in front of thousands of early adopters,
              investors, and tech enthusiasts.
            </p>
          </div>

          {/* Pricing Cards - Side by Side */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Premium Listing Card */}
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {p.premium_listing.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${p.premium_listing.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {p.premium_listing.subtitle}
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-sm text-gray-700">
                      200+ word detailed content about your tool
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Permanent do-follow backlink
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Guaranteed review within 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Standard directory placement
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-sm text-gray-700">
                      SEO-optimized tool page
                    </span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("premium")}
                className="mt-8 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>

            {/* Featured Spot Card */}
            <div className="relative flex flex-col rounded-xl border-2 border-emerald-500 bg-white p-8 shadow-sm">
              {/* Premium Badge */}
              <div className="absolute -top-3 left-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  Premium
                </span>
              </div>

              <div className="flex-1">
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  {p.featured_spot.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${p.featured_spot.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {p.featured_spot.subtitle}
                  </span>
                </div>

                {/* Scarcity Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  <Flame className="h-3.5 w-3.5" />
                  Only 20 Spots Available (3 Left)
                </div>

                {/* Where you'll be featured */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900">
                    Featured placement on:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">Homepage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">
                        Category pages
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-gray-700">
                        All content pages
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Explanation */}
                <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                  <p className="text-sm text-gray-700">
                    Your tool appears in rotating sponsor slots on desktop
                    sidebars and mobile banners across all ABC pages. Sponsors
                    rotate every 10 seconds for fair visibility among all
                    advertisers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("featured")}
                className="mt-8 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Additional Services Section */}
          <div className="mt-20">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Additional Services
              </h2>
              <p className="mt-2 text-gray-600">
                Expand your reach and get actionable insights
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Submission Service Card */}
              <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Submission Service
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    We handle the heavy lifting so you can focus on building
                  </p>

                  {/* Pricing Options - Horizontal Layout */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        ${p.submission_60.price}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {p.submission_60.title}
                      </p>
                    </div>
                    <div className="relative rounded-lg border-2 border-emerald-500 bg-emerald-50 p-4 text-center">
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                        SAVE MORE
                      </span>
                      <p className="text-2xl font-bold text-gray-900">
                        ${p.submission_110.price}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {p.submission_110.title}
                      </p>
                    </div>
                  </div>

                  {/* Features in 2-column grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Manual submissions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Top platforms included
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Submission report
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Boost your DR
                      </span>
                    </div>
                  </div>

                  {/* Testimonial - Different style */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm italic text-gray-600">
                      {`"Saved me countless hours. My domain rating jumped from 8 to 32 in just 6 weeks after ABC submitted to all those directories for me."`}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-900">
                        Alex T.
                      </span>
                      <span className="text-xs text-gray-500">
                        - Founder, TaskFlow
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("submission")}
                  className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Get Started
                </button>
              </div>

              {/* Public Review Card */}
              <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Public Review
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Professional 1000+ word article with permanent do-follow
                    backlink
                  </p>

                  {/* Pricing */}
                  <div className="mt-6 rounded-lg border-2 border-emerald-500 bg-emerald-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {p.public_review.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.public_review.subtitle}
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${p.public_review.price}
                      </span>
                    </div>
                  </div>

                  {/* What's included */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-900">
                      What you get:
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">
                          1000+ words of expert product review
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">
                          Permanent do-follow backlink to your site
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">
                          Published on ABC with high domain authority
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">
                          Ranks for your brand name and keywords
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span className="text-sm text-gray-700">
                          SEO-optimized for maximum visibility
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("review")}
                  className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-20">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                What Our Customers Say About ABC
              </h2>
              <p className="mt-2 text-gray-600">
                Join hundreds of founders who trust Shipon and the ABC team
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex text-amber-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm text-gray-700">{`"${testimonial.quote}"`}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer2 />
        </div>

        {/* Premium Listing Modal */}
        <Dialog
          open={activeModal === "premium"}
          onOpenChange={(v) => {
            if (!v) closeModal();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{p.premium_listing.title}</DialogTitle>
              <DialogDescription>
                Just provide your AI tool URL and we will take care of the rest.
                Our team will write compelling 200+ word content about your
                tool, optimize it for SEO, and publish it within 24 hours.
              </DialogDescription>
            </DialogHeader>
            {submitMessage ? (
              <div className="py-4 text-center space-y-2">
                <p
                  className={`text-sm font-medium ${
                    submitMessage.includes("Submitted")
                      ? "text-emerald-600"
                      : "text-destructive"
                  }`}
                >
                  {submitMessage}
                </p>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="premium-name">Tool Name</Label>
                  <Input
                    id="premium-name"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="My AI Tool"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="premium-url">Your AI Tool URL</Label>
                  <Input
                    id="premium-url"
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://your-ai-tool.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  <strong>Total:</strong> ${p.premium_listing.price} (
                  {p.premium_listing.subtitle})
                </p>
                <Button
                  className="w-full"
                  onClick={handlePremiumSubmit}
                  disabled={submitting || !toolUrl || !toolName}
                >
                  {submitting ? "Submitting…" : "Pay & Submit"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Featured Spot Modal */}
        <Dialog
          open={activeModal === "featured"}
          onOpenChange={(v) => {
            if (!v) closeModal();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{p.featured_spot.title}</DialogTitle>
              <DialogDescription>
                Your AI tool will be displayed in rotating sponsor slots across
                all ABC pages. Each slot rotates every 10 seconds ensuring fair
                visibility for all sponsors.
              </DialogDescription>
            </DialogHeader>
            {submitMessage ? (
              <div className="py-4 text-center space-y-2">
                <p
                  className={`text-sm font-medium ${
                    submitMessage.includes("Submitted")
                      ? "text-emerald-600"
                      : "text-destructive"
                  }`}
                >
                  {submitMessage}
                </p>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="featured-name">Tool Name</Label>
                  <Input
                    id="featured-name"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="My AI Tool"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="featured-url">Your AI Tool URL</Label>
                  <Input
                    id="featured-url"
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://your-ai-tool.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="featured-desc">
                    Short Description{" "}
                    <span className="text-xs text-muted-foreground">
                      (max 40 characters)
                    </span>
                  </Label>
                  <Input
                    id="featured-desc"
                    value={shortDescription}
                    onChange={(e) =>
                      setShortDescription(e.target.value.slice(0, 40))
                    }
                    placeholder="AI-powered productivity tool"
                    maxLength={40}
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {shortDescription.length}/40
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Tool Logo</Label>
                  {logoPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-12 w-12 rounded object-contain border p-1"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Recommended: 200×200 px · PNG or SVG with transparent
                    background · max 2MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </Button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  {logoFile && (
                    <p className="text-xs text-muted-foreground">
                      {logoFile.name} — will upload on submit
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  <strong>Total:</strong> ${p.featured_spot.price}{" "}
                  {p.featured_spot.subtitle} (billed monthly)
                </p>
                <Button
                  className="w-full"
                  onClick={handleFeaturedSubmit}
                  disabled={
                    submitting || !toolUrl || !toolName || !shortDescription
                  }
                >
                  {submitting ? "Submitting…" : "Submit for Review"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Submission Service Modal */}
        <Dialog
          open={activeModal === "submission"}
          onOpenChange={(v) => {
            if (!v) closeModal();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submission Service</DialogTitle>
              <DialogDescription>
                We manually submit your AI tool to high-quality directories to
                boost your domain rating and increase visibility. You will
                receive a detailed submission report once completed.
              </DialogDescription>
            </DialogHeader>
            {submitMessage ? (
              <div className="py-4 text-center space-y-2">
                <p
                  className={`text-sm font-medium ${
                    submitMessage.includes("Submitted")
                      ? "text-emerald-600"
                      : "text-destructive"
                  }`}
                >
                  {submitMessage}
                </p>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Choose Your Plan</Label>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("60")}
                      className={`rounded-lg border-2 p-4 text-center transition-colors ${
                        selectedPlan === "60"
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-xl font-bold text-gray-900">
                        ${p.submission_60.price}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {p.submission_60.title}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("110")}
                      className={`relative rounded-lg border-2 p-4 text-center transition-colors ${
                        selectedPlan === "110"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                        SAVE MORE
                      </span>
                      <p className="text-xl font-bold text-gray-900">
                        ${p.submission_110.price}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {p.submission_110.title}
                      </p>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="submission-name">Tool Name</Label>
                  <Input
                    id="submission-name"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="My AI Tool"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="submission-url">Your AI Tool URL</Label>
                  <Input
                    id="submission-url"
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://your-ai-tool.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  <strong>Total:</strong> $
                  {selectedPlan === "60"
                    ? p.submission_60.price
                    : p.submission_110.price}{" "}
                  (one-time payment)
                </p>
                <Button
                  className="w-full"
                  onClick={handleSubmissionServiceSubmit}
                  disabled={submitting || !toolUrl || !toolName}
                >
                  {submitting ? "Submitting…" : "Submit for Review"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Public Review Modal */}
        <Dialog
          open={activeModal === "review"}
          onOpenChange={(v) => {
            if (!v) closeModal();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{p.public_review.title}</DialogTitle>
              <DialogDescription>
                Our team will write a detailed 1000+ word SEO-optimized review
                of your AI tool, published on ABC with a permanent do-follow
                backlink to help you rank higher in search results.
              </DialogDescription>
            </DialogHeader>
            {submitMessage ? (
              <div className="py-4 text-center space-y-2">
                <p
                  className={`text-sm font-medium ${
                    submitMessage.includes("Submitted")
                      ? "text-emerald-600"
                      : "text-destructive"
                  }`}
                >
                  {submitMessage}
                </p>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="review-name">Tool Name</Label>
                  <Input
                    id="review-name"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="My AI Tool"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="review-url">Your AI Tool URL</Label>
                  <Input
                    id="review-url"
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://your-ai-tool.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  <strong>Total:</strong> ${p.public_review.price} (
                  {p.public_review.subtitle})
                </p>
                <Button
                  className="w-full"
                  onClick={handlePublicReviewSubmit}
                  disabled={submitting || !toolUrl || !toolName}
                >
                  {submitting ? "Submitting…" : "Submit for Review"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
