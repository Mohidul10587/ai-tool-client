"use client";

import { useState } from "react";
import { updateSubmission } from "@/lib/submission-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  url: string;
  status: "pending" | "published" | "rejected";
  submitted_at: string;
  name?: string;
  slug?: string;
  category_id?: number;
  subcategory_id?: number;
  category_snapshot?: string;
  subcategory_snapshot?: string;
  pricing?: string;
  overview?: string;
  logo_url?: string;
  hero_image_url?: string;
  platform?: string;
  pricing_info?: { model?: string; paidFrom?: string; billingFrequency?: string; freeTrial?: string };
  key_features?: { title: string; description: string }[];
  use_cases?: { title: string; audience: string; description: string }[];
  pros?: string[];
  cons?: string[];
};

export function SubmissionEditor({ submissions }: { submissions: Submission[] }) {
  const [editing, setEditing] = useState<Submission | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave(status: "pending" | "published" | "rejected") {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const result = await updateSubmission(editing.id, {
      name: editing.name,
      slug: editing.slug,
      category_id: editing.category_id,
      subcategory_id: editing.subcategory_id,
      category_snapshot: editing.category_snapshot,
      subcategory_snapshot: editing.subcategory_snapshot,
      pricing: editing.pricing,
      overview: editing.overview,
      logo_url: editing.logo_url,
      hero_image_url: editing.hero_image_url,
      platform: editing.platform,
      pricing_info: editing.pricing_info,
      pros: editing.pros,
      cons: editing.cons,
      status,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setEditing(null);
      router.refresh();
    }
  }

  function field(label: string, value: string | undefined, key: keyof Submission) {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Input
          value={value ?? ""}
          onChange={(e) => setEditing((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
        />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No submissions yet.
              </TableCell>
            </TableRow>
          )}
          {submissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="max-w-xs truncate">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline text-sm">
                  {s.url}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={s.status === "published" ? "default" : s.status === "rejected" ? "destructive" : "secondary"}>
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(s.submitted_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => { setEditing(s); setError(null); }}>
                  Edit & Publish
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Submitted URL</Label>
                <p className="text-sm font-medium break-all">{editing.url}</p>
              </div>

              {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                {field("Tool Name", editing.name, "name")}
                {field("Slug (URL path)", editing.slug, "slug")}
                {field("Logo URL", editing.logo_url, "logo_url")}
                {field("Hero Image URL", editing.hero_image_url, "hero_image_url")}
                {field("Platform (e.g. Web, Discord)", editing.platform, "platform")}
              </div>

              <div className="space-y-1">
                <Label>Category (Read-only - set by admin)</Label>
                <Input
                  value={editing.category_snapshot ?? "Not assigned"}
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label>Subcategory (Read-only - set by admin)</Label>
                <Input
                  value={editing.subcategory_snapshot ?? "Not assigned"}
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label>Pricing Model</Label>
                <Select
                  value={editing.pricing ?? ""}
                  onValueChange={(v) => setEditing((p) => p ? { ...p, pricing: v } : p)}
                >
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label>Pricing Label (e.g. Paid)</Label>
                  <Input
                    value={editing.pricing_info?.model ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, pricing_info: { ...p.pricing_info, model: e.target.value } } : p)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Paid From (e.g. $9/mo)</Label>
                  <Input
                    value={editing.pricing_info?.paidFrom ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, pricing_info: { ...p.pricing_info, paidFrom: e.target.value } } : p)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Billing Frequency</Label>
                  <Input
                    value={editing.pricing_info?.billingFrequency ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, pricing_info: { ...p.pricing_info, billingFrequency: e.target.value } } : p)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Free Trial</Label>
                  <Input
                    value={editing.pricing_info?.freeTrial ?? ""}
                    onChange={(e) => setEditing((p) => p ? { ...p, pricing_info: { ...p.pricing_info, freeTrial: e.target.value } } : p)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Overview</Label>
                <Textarea
                  rows={4}
                  value={editing.overview ?? ""}
                  onChange={(e) => setEditing((p) => p ? { ...p, overview: e.target.value } : p)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Key Features</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditing((p) => p ? { ...p, key_features: [...(p.key_features ?? []), { title: "", description: "" }] } : p)}>+ Add</Button>
                </div>
                {(editing.key_features ?? []).map((f, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start">
                    <Input placeholder="Title" value={f.title} onChange={(e) => setEditing((p) => { if (!p) return p; const kf = [...(p.key_features ?? [])]; kf[i] = { ...kf[i], title: e.target.value }; return { ...p, key_features: kf }; })} />
                    <Input placeholder="Description" value={f.description} onChange={(e) => setEditing((p) => { if (!p) return p; const kf = [...(p.key_features ?? [])]; kf[i] = { ...kf[i], description: e.target.value }; return { ...p, key_features: kf }; })} />
                    <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => setEditing((p) => p ? { ...p, key_features: (p.key_features ?? []).filter((_, j) => j !== i) } : p)}>✕</Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Use Cases</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditing((p) => p ? { ...p, use_cases: [...(p.use_cases ?? []), { title: "", audience: "", description: "" }] } : p)}>+ Add</Button>
                </div>
                {(editing.use_cases ?? []).map((u, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 items-start">
                    <Input placeholder="Title" value={u.title} onChange={(e) => setEditing((p) => { if (!p) return p; const uc = [...(p.use_cases ?? [])]; uc[i] = { ...uc[i], title: e.target.value }; return { ...p, use_cases: uc }; })} />
                    <Input placeholder="Audience" value={u.audience} onChange={(e) => setEditing((p) => { if (!p) return p; const uc = [...(p.use_cases ?? [])]; uc[i] = { ...uc[i], audience: e.target.value }; return { ...p, use_cases: uc }; })} />
                    <Input placeholder="Description" value={u.description} onChange={(e) => setEditing((p) => { if (!p) return p; const uc = [...(p.use_cases ?? [])]; uc[i] = { ...uc[i], description: e.target.value }; return { ...p, use_cases: uc }; })} />
                    <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => setEditing((p) => p ? { ...p, use_cases: (p.use_cases ?? []).filter((_, j) => j !== i) } : p)}>✕</Button>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <Label>Pros (one per line)</Label>
                <Textarea
                  rows={3}
                  value={(editing.pros ?? []).join("\n")}
                  onChange={(e) => setEditing((p) => p ? { ...p, pros: e.target.value.split("\n").filter(Boolean) } : p)}
                />
              </div>

              <div className="space-y-1">
                <Label>Cons (one per line)</Label>
                <Textarea
                  rows={3}
                  value={(editing.cons ?? []).join("\n")}
                  onChange={(e) => setEditing((p) => p ? { ...p, cons: e.target.value.split("\n").filter(Boolean) } : p)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleSave("published")} disabled={saving} className="flex-1">
                  {saving ? "Saving…" : "Save & Publish"}
                </Button>
                <Button variant="outline" onClick={() => handleSave("pending")} disabled={saving}>
                  Save as Draft
                </Button>
                <Button variant="destructive" onClick={() => handleSave("rejected")} disabled={saving}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
