"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSubmission, deleteSubmission } from "@/lib/submission-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmissionEditModal } from "@/components/submission-edit-modal";

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
  short_description?: string;
  detail_description?: string;
};

const FILTERS = ["all", "pending", "published", "rejected"] as const;
const statusVariant = (s: string) =>
  s === "published" ? "default" : s === "rejected" ? "destructive" : "secondary";

export function AdminSubmissionsList({
  submissions,
  activeFilter,
}: {
  submissions: Submission[];
  activeFilter: string;
}) {
  const [editing, setEditing] = useState<Submission | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function setFilter(f: string) {
    router.push(`/admin/submissions?status=${f}`);
  }

  async function handleSave(status: Submission["status"]) {
    if (!editing) return;
    setSaving(true);
    setError(null);
    const result = await updateSubmission(editing.id, {
      url: editing.url,
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
      key_features: editing.key_features,
      use_cases: editing.use_cases,
      pros: editing.pros?.filter(Boolean),
      cons: editing.cons?.filter(Boolean),
      short_description: editing.short_description,
      detail_description: editing.detail_description,
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

  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this tool? This cannot be undone.")) return;
    setDeleting(id);
    await deleteSubmission(id);
    setDeleting(null);
    router.refresh();
  }

  async function quickStatus(id: string, status: Submission["status"]) {
    await updateSubmission(id, { status });
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={activeFilter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {submissions.length} result{submissions.length !== 1 ? "s" : ""}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tool / URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No submissions.
              </TableCell>
            </TableRow>
          )}
          {submissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <p className="font-medium text-sm">{s.name ?? "—"}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground underline truncate block max-w-xs">
                  {s.url}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(s.submitted_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline"
                    onClick={() => { setEditing(s); setError(null); }}>
                    Edit
                  </Button>
                  {s.status === "published" ? (
                    <Button size="sm" variant="secondary"
                      onClick={() => quickStatus(s.id, "pending")}>
                      Unpublish
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => quickStatus(s.id, "published")}>
                      Publish
                    </Button>
                  )}
                  <Button size="sm" variant="destructive"
                    disabled={deleting === s.id}
                    onClick={() => handleDelete(s.id)}>
                    {deleting === s.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SubmissionEditModal
        editing={editing}
        saving={saving}
        error={error}
        onClose={() => setEditing(null)}
        onChange={setEditing}
        onSave={handleSave}
      />
    </>
  );
}
