"use client";

import { useState } from "react";
import { updateUserSubmissionServiceRequest, deleteUserSubmissionServiceRequest } from "@/lib/submission-service-actions";
import { UserEditModal } from "@/components/user-edit-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Request = { id: number; url: string; tool_name: string; plan: string; price_paid: string; status: string; rejection_note: string | null; submitted_at: string };

const statusVariant = (s: string) =>
  s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

export function DashboardSubmissionServiceClient({ requests: initial }: { requests: Request[] }) {
  const [requests, setRequests] = useState(initial);
  const [editing, setEditing] = useState<Request | null>(null);
  const [deleting, setDeleting] = useState<Request | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    await deleteUserSubmissionServiceRequest(deleting.id);
    setRequests((prev) => prev.filter((r) => r.id !== deleting.id));
    setDeleting(null);
    setDeleteLoading(false);
  }

  if (!requests.length) return <p className="text-sm text-muted-foreground py-8 text-center">No requests yet.</p>;

  return (
    <>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="rounded-lg border p-4 flex items-start justify-between gap-4 bg-white">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{req.tool_name}</span>
                <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                <Badge variant="outline">{req.plan} directories</Badge>
                {req.price_paid && <Badge variant="outline">${req.price_paid}</Badge>}
              </div>
              <a href={req.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground underline truncate block max-w-sm">{req.url}</a>
              <p className="text-xs text-muted-foreground">Submitted {new Date(req.submitted_at).toLocaleDateString()}</p>
              {req.status === "rejected" && req.rejection_note && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md"><span className="font-semibold">Note: </span>{req.rejection_note}</p>
              )}
              {req.status === "approved" && (
                <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">Your request has been approved. We will begin submissions shortly.</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setEditing(req)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleting(req)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <UserEditModal item={editing} onClose={() => setEditing(null)} onSave={(id, data) => updateUserSubmissionServiceRequest(id, data)} />
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
