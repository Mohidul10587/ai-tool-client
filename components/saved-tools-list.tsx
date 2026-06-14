"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedTools, toggleSavedTool, type SavedTool } from "@/lib/saved-tools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Trash2 } from "lucide-react";

export function SavedToolsList() {
  const [tools, setTools] = useState<SavedTool[]>([]);

  useEffect(() => { setTools(getSavedTools()); }, []);

  function handleRemove(e: React.MouseEvent, tool: SavedTool) {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedTool(tool);
    setTools(getSavedTools());
  }

  if (tools.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bookmark size={16} />Saved Tools</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No saved tools yet.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Bookmark size={16} />Saved Tools ({tools.length})</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/ai/${tool.slug}`}
            className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors group"
          >
            <div className="size-8 shrink-0 rounded-md bg-muted overflow-hidden border">
              {tool.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tool.logo_url} alt={tool.name} className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-xs font-medium">{tool.name?.[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tool.name}</p>
              <p className="text-xs text-muted-foreground">{tool.subcategory_snapshot} · {tool.pricing}</p>
            </div>
            <button
              onClick={(e) => handleRemove(e, tool)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-destructive transition-all"
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
