const KEY = "recently_viewed";
const MAX = 20;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export type RecentTool = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  pricing?: string | null;
  subcategory_snapshot?: string | null;
  viewed_at: number;
};

export function recordView(tool: Omit<RecentTool, "viewed_at">) {
  try {
    const now = Date.now();
    const cutoff = now - SEVEN_DAYS;
    const existing: RecentTool[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const filtered = existing.filter((t) => t.id !== tool.id && t.viewed_at > cutoff);
    const updated = [{ ...tool, viewed_at: now }, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export function getRecentlyViewed(): RecentTool[] {
  try {
    const cutoff = Date.now() - SEVEN_DAYS;
    const data: RecentTool[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return data.filter((t) => t.viewed_at > cutoff);
  } catch {
    return [];
  }
}
