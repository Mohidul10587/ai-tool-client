"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/mega-menu";

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
  pricing_info?: {
    model?: string;
    paidFrom?: string;
    billingFrequency?: string;
    freeTrial?: string;
  };
  key_features?: { title: string; description: string }[];
  use_cases?: { title: string; audience: string; description: string }[];
  pros?: string[];
  cons?: string[];
  tags?: string[];
  short_description?: string;
  detail_description?: string;
};

interface Props {
  editing: Submission | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onChange: (updated: Submission) => void;
  onSave: (
    status: Submission["status"],
    overrides?: Partial<Submission>
  ) => void;
}

export function SubmissionEditModal({
  editing,
  saving,
  error,
  onClose,
  onChange,
  onSave,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [tagsInput, setTagsInput] = useState((editing?.tags ?? []).join(", "));

  useEffect(() => {
    setTagsInput((editing?.tags ?? []).join(", "));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id, JSON.stringify(editing?.tags)]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*, subcategories(*)")
      .order("display_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (editing?.category_id) {
      const cat = categories.find((c) => c.id === editing.category_id);
      setSelectedCategory(cat || null);
    }
  }, [editing?.category_id, categories]);

  if (!editing) return null;

  function update(patch: Partial<Submission>) {
    onChange({ ...editing!, ...patch });
  }

  function parsedTags() {
    return tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function handleSave(status: Submission["status"]) {
    onSave(status, { tags: parsedTags() });
  }

  function handleCategoryChange(categoryId: string) {
    const cat = categories.find((c) => c.id === parseInt(categoryId));
    setSelectedCategory(cat || null);
    update({
      category_id: parseInt(categoryId),
      subcategory_id: undefined,
      category_snapshot: cat?.name,
      subcategory_snapshot: undefined,
    });
  }

  function handleSubcategoryChange(subcategoryId: string) {
    const sub = selectedCategory?.subcategories?.find(
      (s) => s.id === parseInt(subcategoryId)
    );
    update({
      subcategory_id: parseInt(subcategoryId),
      subcategory_snapshot: sub?.name,
    });
  }
  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="bg-muted px-6 py-4 rounded-t-lg border-b shrink-0">
          <DialogTitle className="text-base font-semibold">
            Edit Submission
          </DialogTitle>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              type="url"
              value={editing.url}
              onChange={(e) => update({ url: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {(
              [
                "name",
                "slug",
                "logo_url",
                "hero_image_url",
                "platform",
              ] as const
            ).map((key) => (
              <div key={key} className="space-y-1">
                <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                <Input
                  value={(editing[key] as string) ?? ""}
                  onChange={(e) => update({ [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={editing.category_id?.toString() ?? ""}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category…" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Subcategory</Label>
              <Select
                value={editing.subcategory_id?.toString() ?? ""}
                onValueChange={handleSubcategoryChange}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory…" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories?.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Pricing Model</Label>
            <Select
              value={editing.pricing ?? ""}
              onValueChange={(v) => update({ pricing: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {["Free", "Freemium", "Paid"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {(
              ["model", "paidFrom", "billingFrequency", "freeTrial"] as const
            ).map((k) => (
              <div key={k} className="space-y-1">
                <Label className="capitalize">
                  {k.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  value={editing.pricing_info?.[k] ?? ""}
                  onChange={(e) =>
                    update({
                      pricing_info: {
                        ...editing.pricing_info,
                        [k]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <Label>Overview</Label>
            <Textarea
              rows={4}
              value={editing.overview ?? ""}
              onChange={(e) => update({ overview: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Short Description</Label>
            <Textarea
              rows={2}
              placeholder="Brief one-liner shown in listings (~160 chars)"
              value={editing.short_description ?? ""}
              onChange={(e) => update({ short_description: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Detail Description</Label>
            <Textarea
              rows={6}
              placeholder="Full detailed description shown on the tool page"
              value={editing.detail_description ?? ""}
              onChange={(e) => update({ detail_description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Key Features</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    key_features: [
                      ...(editing.key_features ?? []),
                      { title: "", description: "" },
                    ],
                  })
                }
              >
                + Add
              </Button>
            </div>
            {(editing.key_features ?? []).map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start"
              >
                <Input
                  placeholder="Title"
                  value={f.title}
                  onChange={(e) => {
                    const kf = [...(editing.key_features ?? [])];
                    kf[i] = { ...kf[i], title: e.target.value };
                    update({ key_features: kf });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={f.description}
                  onChange={(e) => {
                    const kf = [...(editing.key_features ?? [])];
                    kf[i] = { ...kf[i], description: e.target.value };
                    update({ key_features: kf });
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() =>
                    update({
                      key_features: (editing.key_features ?? []).filter(
                        (_, j) => j !== i
                      ),
                    })
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Cases</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    use_cases: [
                      ...(editing.use_cases ?? []),
                      { title: "", audience: "", description: "" },
                    ],
                  })
                }
              >
                + Add
              </Button>
            </div>
            {(editing.use_cases ?? []).map((u, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 items-start"
              >
                <Input
                  placeholder="Title"
                  value={u.title}
                  onChange={(e) => {
                    const uc = [...(editing.use_cases ?? [])];
                    uc[i] = { ...uc[i], title: e.target.value };
                    update({ use_cases: uc });
                  }}
                />
                <Input
                  placeholder="Audience"
                  value={u.audience}
                  onChange={(e) => {
                    const uc = [...(editing.use_cases ?? [])];
                    uc[i] = { ...uc[i], audience: e.target.value };
                    update({ use_cases: uc });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={u.description}
                  onChange={(e) => {
                    const uc = [...(editing.use_cases ?? [])];
                    uc[i] = { ...uc[i], description: e.target.value };
                    update({ use_cases: uc });
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() =>
                    update({
                      use_cases: (editing.use_cases ?? []).filter(
                        (_, j) => j !== i
                      ),
                    })
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["pros", "cons"] as const).map((key) => (
              <div key={key} className="space-y-1">
                <Label className="capitalize">{key} (one per line)</Label>
                <Textarea
                  rows={3}
                  value={(editing[key] ?? []).join("\n")}
                  onChange={(e) =>
                    update({ [key]: e.target.value.split("\n") })
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <Label>Tags (comma separated)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={() =>
                update({
                  tags: tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g. AI, Productivity, Writing"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving…" : "Save & Publish"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave("pending")}
              disabled={saving}
            >
              Save as Draft
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSave("rejected")}
              disabled={saving}
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
