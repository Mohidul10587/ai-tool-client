import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes = [
    { url: "/", priority: 1 },
    { url: "/pricing", priority: 0.8 },
    { url: "/categories", priority: 0.8 },
    { url: "/faq", priority: 0.6 },
    { url: "/contact", priority: 0.6 },
    { url: "/privacy", priority: 0.4 },
    { url: "/terms", priority: 0.4 },
    { url: "/cookie-policy", priority: 0.4 },
    { url: "/dmca", priority: 0.4 },
    { url: "/disclaimer", priority: 0.4 },
    { url: "/sitemap-page", priority: 0.3 },
  ].map(({ url, priority }) => ({
    url: `${base}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const admin = createAdminClient();
  const { data: tools } = await admin
    .from("tool_submissions")
    .select("slug, updated_at")
    .eq("status", "approved");

  const toolRoutes: MetadataRoute.Sitemap = (tools ?? []).map((tool) => ({
    url: `${base}/ai/${tool.slug}`,
    lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...toolRoutes];
}
