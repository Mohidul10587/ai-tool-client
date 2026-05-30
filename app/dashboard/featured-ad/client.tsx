"use client";

import { useState } from "react";
import { updateUserFeaturedAd, deleteUserFeaturedAd } from "@/lib/featured-ads-actions";
import { UserEditModal } from "@/components/user-edit-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Ad = { id: number; url: string; description: string; tool_name: string; price_paid: string; status: string; rejection_message: string | null; submitted_at: string };

const statusVariant = (s: string) =>
  s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

export function DashboardFeaturedAdClient({ ads: initial }: { ads: Ad[] }) {
  const [ads, setAds] = useState(initial);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [deleting, setDeleting] = useState<Ad | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    await deleteUserFeaturedAd(deleting.id);
    setAds((prev) => prev.filter((a) => a.id !== deleting.id));
    setDeleting(null);
    setDeleteLoading(false);
  }

  if (!ads.length) return <p className="text-sm text-muted-foreground py-8 text-center">No requests yet.</p>;

  return (
    <>
      <div className="space-y-3">
        {ads.map((ad) => (
          <div key={ad.id} className="rounded-lg border p-4 flex items-start justify-between gap-4 bg-white">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{ad.tool_name}</span>
                <Badge variant={statusVariant(ad.status)}>{ad.status}</Badge>
                {ad.price_paid && <Badge variant="outline">${ad.price_paid}</Badge>}
              </div>
              <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground underline truncate block max-w-sm">{ad.url}</a>
              {ad.description && <p className="text-xs text-muted-foreground">{ad.description}</p>}
              <p className="text-xs text-muted-foreground">Submitted {new Date(ad.submitted_at).toLocaleDateString()}</p>
              {ad.status === "rejected" && ad.rejection_message && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md"><span className="font-semibold">Reason: </span>{ad.rejection_message}</p>
              )}
              {ad.status === "approved" && (
                <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">Your ad is live and showing on the site.</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setEditing(ad)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleting(ad)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <UserEditModal
        item={editing}
        onClose={() => setEditing(null)}
        onSave={(id, data) => updateUserFeaturedAd(id, data)}
        extraFields={[{ key: "description", label: "Short Description", maxLength: 40 }]}
      />
      <ConfirmDialog
        open={!!deleting}
        description={`Delete "${deleting?.tool_name}"? This cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
