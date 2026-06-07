"use client";

import { useState, useRef } from "react";
import { updateUserFeaturedAd, deleteUserFeaturedAd } from "@/lib/featured-ads-actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Ad = { id: number; url: string; description: string; tool_name: string; logo_url?: string | null; price_paid: string; status: string; rejection_message: string | null; submitted_at: string };

const BG = ["bg-rose-100","bg-sky-100","bg-amber-100","bg-emerald-100","bg-violet-100"];

const statusVariant = (s: string): "default" | "destructive" | "secondary" =>
  s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary";

async function uploadLogo(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export function DashboardFeaturedAdClient({ ads: initial }: { ads: Ad[] }) {
  const [ads, setAds] = useState(initial);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editToolName, setEditToolName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Ad | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function openEdit(ad: Ad) {
    setEditing(ad);
    setEditUrl(ad.url);
    setEditToolName(ad.tool_name);
    setEditDesc(ad.description ?? "");
    setEditLogoFile(null);
    setEditLogoPreview(ad.logo_url ?? "");
    setSaveError(null);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    let logo_url = editing.logo_url ?? undefined;
    if (editLogoFile) {
      try { logo_url = await uploadLogo(editLogoFile); } catch (e: any) { setSaveError(e.message); setSaving(false); return; }
    }
    const result = await updateUserFeaturedAd(editing.id, { url: editUrl, tool_name: editToolName, description: editDesc, logo_url });
    setSaving(false);
    if (result.error) { setSaveError(result.error); return; }
    setAds(prev => prev.map(a => a.id === editing.id ? { ...a, url: editUrl, tool_name: editToolName, description: editDesc, logo_url: logo_url ?? a.logo_url, status: "pending" } : a));
    setEditing(null);
    router.refresh();
  }

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
        {ads.map((ad, i) => (
          <div key={ad.id} className="rounded-lg border p-4 flex items-start justify-between gap-4 bg-white">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Logo */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black/70 ${BG[i % BG.length]}`}>
                {ad.logo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={ad.logo_url} alt={ad.tool_name} className="h-8 w-8 rounded object-contain" />
                  : ad.tool_name.slice(0, 2).toUpperCase() || "AD"}
              </div>
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
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(ad)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleting(ad)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => { if (!v) setEditing(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Featured Ad</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label>Tool Name</Label>
              <Input value={editToolName} onChange={(e) => setEditToolName(e.target.value)} placeholder="My AI Tool" />
            </div>
            <div className="space-y-1">
              <Label>URL</Label>
              <Input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <Label>Short Description <span className="text-xs text-muted-foreground">(max 40 chars)</span></Label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value.slice(0, 40))} maxLength={40} />
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
            {saveError && <p className="text-xs text-destructive">{saveError}</p>}
            <p className="text-xs text-muted-foreground">Saving will reset status to <strong>pending</strong> for re-review.</p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
