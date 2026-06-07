"use client";

import { useState, useRef } from "react";
import { updateFeaturedAdStatus, updateFeaturedAd, deleteFeaturedAd } from "@/lib/featured-ads-actions";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";

type Ad = {
  id: number;
  url: string;
  description: string;
  tool_name: string;
  logo_url?: string | null;
  price_paid: string;
  status: string;
  rejection_message: string | null;
  submitted_at: string;
  user_id: string;
};

const BG = ["bg-rose-100","bg-sky-100","bg-amber-100","bg-emerald-100","bg-violet-100"];

async function uploadLogo(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export default function AdminFeaturedAdsClient({ ads: initial }: { ads: Ad[] }) {
  const [ads, setAds] = useState(initial);
  const [editAd, setEditAd] = useState<Ad | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editToolName, setEditToolName] = useState("");
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string>("");
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectMsg, setRejectMsg] = useState("");
  const [loading, setLoading] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const refresh = (updated: Ad) =>
    setAds((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const openEdit = (ad: Ad) => {
    setEditAd(ad);
    setEditUrl(ad.url);
    setEditDesc(ad.description);
    setEditToolName(ad.tool_name);
    setEditLogoFile(null);
    setEditLogoPreview(ad.logo_url ?? "");
  };

  const handleApprove = async (ad: Ad) => {
    setLoading(ad.id);
    await updateFeaturedAdStatus(ad.id, "approved");
    refresh({ ...ad, status: "approved", rejection_message: null });
    setLoading(null);
  };

  const handleReject = async (ad: Ad) => {
    setLoading(ad.id);
    await updateFeaturedAdStatus(ad.id, "rejected", rejectMsg);
    refresh({ ...ad, status: "rejected", rejection_message: rejectMsg });
    setRejectId(null);
    setRejectMsg("");
    setLoading(null);
  };

  const handleEdit = async () => {
    if (!editAd) return;
    setLoading(editAd.id);
    let logo_url = editAd.logo_url ?? undefined;
    if (editLogoFile) {
      try { logo_url = await uploadLogo(editLogoFile); } catch { setLoading(null); return; }
    }
    await updateFeaturedAd(editAd.id, { url: editUrl, description: editDesc, tool_name: editToolName, logo_url });
    refresh({ ...editAd, url: editUrl, description: editDesc, tool_name: editToolName, logo_url });
    setEditAd(null);
    setLoading(null);
  };

  const handleDelete = async (id: number) => {
    setLoading(id);
    await deleteFeaturedAd(id);
    setAds((prev) => prev.filter((a) => a.id !== id));
    setConfirmDeleteId(null);
    setLoading(null);
  };

  const statusColor = (s: string) =>
    s === "approved" ? "text-emerald-600" : s === "rejected" ? "text-red-500" : "text-amber-500";

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Featured Ad Requests</h1>
      {!ads.length && <p className="text-gray-500">No requests yet.</p>}
      <div className="space-y-4">
        {ads.map((ad, i) => (
          <div key={ad.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Logo */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black/70 ${BG[i % BG.length]}`}>
                  {ad.logo_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={ad.logo_url} alt={ad.tool_name} className="h-8 w-8 rounded object-contain" />
                    : (ad.tool_name.slice(0, 2).toUpperCase() || "AD")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{ad.tool_name}</p>
                  <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{ad.url}</a>
                  <p className="mt-1 text-sm text-gray-700">{ad.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(ad.submitted_at).toLocaleDateString()} ·{" "}
                    <span className={`font-medium ${statusColor(ad.status)}`}>{ad.status}</span>
                    {ad.price_paid && <span className="ml-2 font-semibold text-gray-900">${ad.price_paid}</span>}
                  </p>
                  {ad.status === "rejected" && ad.rejection_message && (
                    <p className="mt-1 text-xs text-red-500">Reason: {ad.rejection_message}</p>
                  )}
                  {rejectId === ad.id && (
                    <div className="mt-3 flex gap-2">
                      <input value={rejectMsg} onChange={(e) => setRejectMsg(e.target.value)} placeholder="Rejection reason (optional)" className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400" />
                      <button onClick={() => handleReject(ad)} disabled={loading === ad.id} className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50">Confirm</button>
                      <button onClick={() => setRejectId(null)} className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {ad.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(ad)} disabled={loading === ad.id} title="Approve" className="rounded-lg bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 disabled:opacity-50"><Check className="h-4 w-4" /></button>
                    <button onClick={() => { setRejectId(ad.id); setRejectMsg(""); }} disabled={loading === ad.id} title="Reject" className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600 disabled:opacity-50"><X className="h-4 w-4" /></button>
                  </>
                )}
                <button onClick={() => openEdit(ad)} title="Edit" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setConfirmDeleteId(ad.id)} disabled={loading === ad.id} title="Delete" className="rounded-lg border border-gray-200 p-1.5 text-red-400 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editAd} onOpenChange={(v) => { if (!v) setEditAd(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Featured Ad</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="fa-name">Tool Name</Label>
              <Input id="fa-name" value={editToolName} onChange={(e) => setEditToolName(e.target.value)} placeholder="Tool Name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fa-url">URL</Label>
              <Input id="fa-url" type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fa-desc">Description <span className="text-xs text-muted-foreground">(max 40 chars)</span></Label>
              <Input id="fa-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value.slice(0, 40))} maxLength={40} placeholder="Short description" />
              <p className="text-right text-xs text-muted-foreground">{editDesc.length}/40</p>
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              {editLogoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editLogoPreview} alt="preview" className="h-10 w-10 rounded object-contain border p-0.5" />
              )}
              <p className="text-xs text-muted-foreground">Recommended: 200×200 px · PNG/SVG · max 2MB</p>
              <Button type="button" variant="outline" size="sm" onClick={() => logoRef.current?.click()}>
                {editLogoPreview ? "Change Logo" : "Upload Logo"}
              </Button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                setEditLogoFile(f);
                setEditLogoPreview(URL.createObjectURL(f));
              }} />
              {editLogoFile && <p className="text-xs text-muted-foreground">{editLogoFile.name} — will upload on save</p>}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleEdit} disabled={!!loading}>Save</Button>
              <Button variant="outline" className="flex-1" onClick={() => setEditAd(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this ad?"
        description="This will permanently delete this featured ad and cannot be undone."
        loading={loading === confirmDeleteId}
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
