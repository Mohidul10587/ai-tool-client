"use client";

import { useState } from "react";
import { updateSubmissionServiceStatus, updateSubmissionServiceRequest } from "@/lib/submission-service-actions";
import { Check, X, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Request = {
  id: number;
  url: string;
  tool_name: string;
  plan: string;
  price_paid: string;
  status: string;
  rejection_note: string | null;
  submitted_at: string;
  user_id: string;
};

export default function AdminSubmissionServiceClient({ requests: initial }: { requests: Request[] }) {
  const [requests, setRequests] = useState(initial);
  const [editReq, setEditReq] = useState<Request | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editToolName, setEditToolName] = useState("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [loading, setLoading] = useState<number | null>(null);

  const refresh = (updated: Request) =>
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const openEdit = (req: Request) => {
    setEditReq(req);
    setEditUrl(req.url);
    setEditToolName(req.tool_name);
  };

  const handleApprove = async (req: Request) => {
    setLoading(req.id);
    await updateSubmissionServiceStatus(req.id, "approved");
    refresh({ ...req, status: "approved", rejection_note: null });
    setLoading(null);
  };

  const handleReject = async (req: Request) => {
    setLoading(req.id);
    await updateSubmissionServiceStatus(req.id, "rejected", rejectNote);
    refresh({ ...req, status: "rejected", rejection_note: rejectNote });
    setRejectId(null);
    setRejectNote("");
    setLoading(null);
  };

  const handleEdit = async () => {
    if (!editReq) return;
    setLoading(editReq.id);
    await updateSubmissionServiceRequest(editReq.id, { url: editUrl, tool_name: editToolName });
    refresh({ ...editReq, url: editUrl, tool_name: editToolName });
    setEditReq(null);
    setLoading(null);
  };

  const statusColor = (s: string) =>
    s === "approved" ? "text-emerald-600" : s === "rejected" ? "text-red-500" : "text-amber-500";

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Submission Service Requests</h1>
      {!requests.length && <p className="text-gray-500">No requests yet.</p>}
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900">{req.tool_name}</p>
                <a href={req.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{req.url}</a>
                <p className="mt-1 text-xs text-gray-500">
                  Plan: <span className="font-medium text-gray-700">{req.plan} directories</span>
                  {req.price_paid && <span className="ml-2 font-semibold text-gray-900">${req.price_paid}</span>}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(req.submitted_at).toLocaleDateString()} ·{" "}
                  <span className={`font-medium ${statusColor(req.status)}`}>{req.status}</span>
                </p>
                {req.status === "rejected" && req.rejection_note && (
                  <p className="mt-1 text-xs text-red-500">Note: {req.rejection_note}</p>
                )}
                {rejectId === req.id && (
                  <div className="mt-3 flex gap-2">
                    <input value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Rejection note (optional)" className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400" />
                    <button onClick={() => handleReject(req)} disabled={loading === req.id} className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50">Confirm</button>
                    <button onClick={() => setRejectId(null)} className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {req.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(req)} disabled={loading === req.id} title="Approve" className="rounded-lg bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 disabled:opacity-50"><Check className="h-4 w-4" /></button>
                    <button onClick={() => { setRejectId(req.id); setRejectNote(""); }} disabled={loading === req.id} title="Reject" className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600 disabled:opacity-50"><X className="h-4 w-4" /></button>
                  </>
                )}
                <button onClick={() => openEdit(req)} title="Edit" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><Pencil className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editReq} onOpenChange={(v) => { if (!v) setEditReq(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Submission Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="ss-name">Tool Name</Label>
              <Input id="ss-name" value={editToolName} onChange={(e) => setEditToolName(e.target.value)} placeholder="Tool Name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ss-url">URL</Label>
              <Input id="ss-url" type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleEdit} disabled={!!loading}>Save</Button>
              <Button variant="outline" className="flex-1" onClick={() => setEditReq(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
