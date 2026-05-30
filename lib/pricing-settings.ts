import { createAdminClient } from "@/lib/supabase/admin";

export type PricingItem = {
  key: string;
  title: string;
  subtitle: string;
  price: string;
};

export type PricingSettings = Record<string, PricingItem>;

const DEFAULTS: PricingSettings = {
  premium_listing:  { key: "premium_listing",  title: "Premium Listing",  subtitle: "one-time", price: "9" },
  featured_spot:    { key: "featured_spot",    title: "Featured Spot",    subtitle: "/ month",  price: "89" },
  submission_60:    { key: "submission_60",    title: "60 Directories",   subtitle: "one-time", price: "149" },
  submission_110:   { key: "submission_110",   title: "110 Directories",  subtitle: "one-time", price: "249" },
  public_review:    { key: "public_review",    title: "Public Review",    subtitle: "one-time", price: "199" },
};

export async function getPricingSettings(): Promise<PricingSettings> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("pricing_settings").select("key, title, subtitle, price");
    if (error || !data) return DEFAULTS;
    const map: PricingSettings = { ...DEFAULTS };
    for (const row of data) map[row.key] = row;
    return map;
  } catch {
    return DEFAULTS;
  }
}
