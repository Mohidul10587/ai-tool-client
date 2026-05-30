"use client";

import { useState } from "react";
import { updateSubmissionUrl, deleteUserSubmission } from "@/lib/submission-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  url: string;
  name?: string;
  category_snapshot?: string;
  subcategory_snapshot?: string;
  pricing?: string;
  overview?: string;
  status: "pending" | "published" | "rejected";
  submitted_at: string;
  updated_at: string;
};

const statusVariant = (s: string) =>
  s === "published" ? "default" : s === "rejected" ? "destructive" : "secondary";

export function UserSubmissionsList({ submissions }: { submissions: Submission[] }) {
  const [viewing, setViewing] = useState<Submission | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Submission | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSaveUrl() {
    if (!viewing) return;
    setSaving(true);
    setError(null);
    const result = await updateSubmissionUrl(viewing.id, editUrl, editName);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setViewing(null);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    await deleteUserSubmission(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    router.refresh();
  }

  if (submissions.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">You haven&apos;t submitted any tools yet.</p>;
  }

  return (
    <>
      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{s.name ?? "Untitled"}</span>
                <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
                {s.category_snapshot && <Badge variant="outline">{s.category_snapshot}</Badge>}
                {s.pricing && <Badge variant="outline">{s.pricing}</Badge>}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline truncate block max-w-sm">
                {s.url}
              </a>
              <p className="text-xs text-muted-foreground">
                Submitted {new Date(s.submitted_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => { setViewing(s); setEditUrl(s.url); setEditName(s.name ?? ""); setError(null); }}>
                View
              </Button>
              <Button size="sm" variant="destructive" disabled={deleteLoading}
                onClick={() => setDeleting(s)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.name ?? "Submission Details"}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={statusVariant(viewing.status)}>{viewing.status}</Badge>
                {viewing.category_snapshot && <Badge variant="outline">{viewing.category_snapshot}</Badge>}
                {viewing.pricing && <Badge variant="outline">{viewing.pricing}</Badge>}
              </div>

              {viewing.overview && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Overview</p>
                  <p className="text-sm leading-relaxed">{viewing.overview}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p>{new Date(viewing.submitted_at).toLocaleString()}</p>
              </div>

              {viewing.status === "rejected" && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  This submission was rejected. You can update the URL and resubmit for review.
                </p>
              )}

              {/* Editable fields */}
              <div className="space-y-3 pt-2 border-t">
                <div className="space-y-1">
                  <p className="text-xs font-medium">Tool Name <span className="text-muted-foreground">(editable)</span></p>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="My AI Tool" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Official URL <span className="text-muted-foreground">(editable)</span></p>
                  <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} type="url" />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button size="sm" onClick={handleSaveUrl} disabled={saving || (editUrl === viewing.url && editName === (viewing.name ?? ""))}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
                {(editUrl !== viewing.url || editName !== (viewing.name ?? "")) && (
                  <p className="text-xs text-muted-foreground">Saving will reset status to <strong>pending</strong> for re-review.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleting}
        description={`Delete "${deleting?.name ?? deleting?.url}"? This cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
