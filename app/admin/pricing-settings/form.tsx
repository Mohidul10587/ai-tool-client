"use client";

import { useState } from "react";
import { savePricingSettings } from "@/lib/pricing-settings-actions";
import type { PricingSettings } from "@/lib/pricing-settings";

const LABELS: Record<string, string> = {
  premium_listing: "Premium Listing",
  featured_spot:   "Featured Spot",
  submission_60:   "Submission Service – 60 Directories",
  submission_110:  "Submission Service – 110 Directories",
  public_review:   "Public Review",
};

export default function PricingSettingsForm({ settings }: { settings: PricingSettings }) {
  const [items, setItems] = useState(
    Object.values(settings).map((item) => ({ ...item }))
  );
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: string, field: string, value: string) =>
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await savePricingSettings(items);
    setStatus(result);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status?.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{status.error}</p>
      )}
      {status?.success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-600">Saved. Changes are live.</p>
      )}

      {items.map((item) => (
        <div key={item.key} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">{LABELS[item.key] ?? item.key}</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input
                value={item.title}
                onChange={(e) => update(item.key, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
              <input
                value={item.subtitle}
                onChange={(e) => update(item.key, "subtitle", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              <input
                value={item.price}
                onChange={(e) => update(item.key, "price", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save Pricing"}
      </button>
    </form>
  );
}
