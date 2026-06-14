"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentlyViewed, type RecentTool } from "@/lib/recently-viewed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function RecentlyViewed() {
  const [tools, setTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    setTools(getRecentlyViewed());
  }, []);

  if (tools.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={16} />Recently Viewed</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No tools viewed in the last 7 days.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={16} />Recently Viewed</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/ai/${tool.slug}`}
            className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
          >
            <div className="size-8 shrink-0 rounded-md bg-muted overflow-hidden border">
              {tool.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tool.logo_url} alt={tool.name} className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-xs font-medium">
                  {tool.name?.[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tool.name}</p>
              <p className="text-xs text-muted-foreground">{tool.subcategory_snapshot} · {tool.pricing}</p>
            </div>
            <p className="text-xs text-muted-foreground shrink-0">
              {new Date(tool.viewed_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
