import { createAdminClient } from "@/lib/supabase/admin";

export type SiteSettings = {
  site_title: string;
  site_description: string;
  site_keywords: string;
  logo_url: string;
  favicon_url: string;
  og_image_url: string;
  twitter_handle: string;
  google_verification: string;
  footer_text: string;
  social_twitter: string;
  social_facebook: string;
  social_linkedin: string;
  social_email: string;
};

const DEFAULTS: SiteSettings = {
  site_title: "AI Directory - Discover the Best AI Tools",
  site_description: "Discover, compare, and find the best AI tools for your workflow.",
  site_keywords: "AI tools, artificial intelligence, AI directory",
  logo_url: "",
  favicon_url: "",
  og_image_url: "",
  twitter_handle: "@aidirectory",
  google_verification: "",
  footer_text: "© 2026 AI Directory. All rights reserved.",
  social_twitter: "",
  social_facebook: "",
  social_linkedin: "",
  social_email: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("site_settings").select("key, value");
    if (error || !data) return DEFAULTS;
    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
    return { ...DEFAULTS, ...map } as SiteSettings;
  } catch {
    return DEFAULTS;
  }
}
