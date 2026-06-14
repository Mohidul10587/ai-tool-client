const KEY = "saved_tools";

export type SavedTool = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  pricing?: string | null;
  subcategory_snapshot?: string | null;
  saved_at: number;
};

export function toggleSavedTool(tool: Omit<SavedTool, "saved_at">): boolean {
  try {
    const existing: SavedTool[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const idx = existing.findIndex((t) => t.id === tool.id);
    if (idx !== -1) {
      existing.splice(idx, 1);
      localStorage.setItem(KEY, JSON.stringify(existing));
      return false; // removed
    } else {
      existing.unshift({ ...tool, saved_at: Date.now() });
      localStorage.setItem(KEY, JSON.stringify(existing));
      return true; // saved
    }
  } catch {
    return false;
  }
}

export function isToolSaved(id: string): boolean {
  try {
    const existing: SavedTool[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return existing.some((t) => t.id === id);
  } catch {
    return false;
  }
}

export function getSavedTools(): SavedTool[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
