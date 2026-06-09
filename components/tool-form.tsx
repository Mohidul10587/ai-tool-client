"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/mega-menu";

type Submission = {
  id?: string;
  url: string;
  status?: "pending" | "published" | "rejected";
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
  tags?: string[];
  qa_items?: { question: string; answer: string }[];
  short_description?: string;
  detail_description?: string;
};

type FormData = {
  name: string; url: string; slug: string; platform: string;
  category_id: string; subcategory_id: string;
  category_snapshot: string; subcategory_snapshot: string;
  pricing: string; overview: string; short_description: string; detail_description: string;
  logo_url: string; hero_image_url: string;
  pricing_info: { model: string; paidFrom: string; billingFrequency: string; freeTrial: string };
  key_features: { title: string; description: string }[];
  use_cases: { title: string; audience: string; description: string }[];
  pros: string[]; cons: string[]; tags: string;
  qa_items: { question: string; answer: string }[];
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

function toFormData(s?: Submission): FormData {
  return {
    name: s?.name ?? "",
    url: s?.url ?? "",
    slug: s?.slug ?? "",
    platform: s?.platform ?? "",
    category_id: s?.category_id?.toString() ?? "",
    subcategory_id: s?.subcategory_id?.toString() ?? "",
    category_snapshot: s?.category_snapshot ?? "",
    subcategory_snapshot: s?.subcategory_snapshot ?? "",
    pricing: s?.pricing ?? "Free",
    overview: s?.overview ?? "",
    short_description: s?.short_description ?? "",
    detail_description: s?.detail_description ?? "",
    logo_url: s?.logo_url ?? "",
    hero_image_url: s?.hero_image_url ?? "",
    pricing_info: {
      model: s?.pricing_info?.model ?? "",
      paidFrom: s?.pricing_info?.paidFrom ?? "",
      billingFrequency: s?.pricing_info?.billingFrequency ?? "",
      freeTrial: s?.pricing_info?.freeTrial ?? "",
    },
    key_features: s?.key_features ?? [],
    use_cases: s?.use_cases ?? [],
    pros: s?.pros ?? [],
    cons: s?.cons ?? [],
    tags: (s?.tags ?? []).join(", "),
    qa_items: s?.qa_items ?? [],
  };
}

interface ToolFormProps {
  /** Pass to enable edit mode; omit for add mode */
  initialData?: Submission;
  /** Called on successful add (no initialData) or save (with initialData) */
  onSuccess?: (status?: Submission["status"], overrides?: Partial<Submission>) => void;
  /** Show Publish/Draft/Reject buttons instead of single submit (edit mode) */
  editMode?: boolean;
  saving?: boolean;
  error?: string | null;
}

export function ToolForm({ initialData, onSuccess, editMode, saving: externalSaving, error: externalError }: ToolFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(() => toFormData(initialData));
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo_url ?? "");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState(initialData?.hero_image_url ?? "");
  const [internalSaving, setInternalSaving] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const saving = editMode ? (externalSaving ?? false) : internalSaving;
  const error = editMode ? (externalError ?? null) : internalError;

  useEffect(() => {
    if (initialData) {
      setForm(toFormData(initialData));
      setLogoFile(null);
      setLogoPreview(initialData.logo_url ?? "");
      setHeroFile(null);
      setHeroPreview(initialData.hero_image_url ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categories").select("*, subcategories(*)").order("display_order")
      .then(({ data }) => { if (data) setCategories(data); });
  }, []);

  useEffect(() => {
    if (form.category_id) {
      const cat = categories.find(c => c.id === parseInt(form.category_id));
      setSelectedCategory(cat || null);
    }
  }, [form.category_id, categories]);

  function update(patch: Partial<FormData>) {
    setForm(prev => ({ ...prev, ...patch }));
  }

  function handleCategoryChange(categoryId: string) {
    const cat = categories.find(c => c.id === parseInt(categoryId));
    setSelectedCategory(cat || null);
    update({ category_id: categoryId, subcategory_id: "", category_snapshot: cat?.name ?? "", subcategory_snapshot: "" });
  }

  function handleSubcategoryChange(subcategoryId: string) {
    const sub = selectedCategory?.subcategories?.find(s => s.id === parseInt(subcategoryId));
    update({ subcategory_id: subcategoryId, subcategory_snapshot: sub?.name ?? "" });
  }

  function buildOverrides(): Partial<Submission> {
    return {
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      name: form.name, url: form.url, slug: form.slug, platform: form.platform,
      category_id: parseInt(form.category_id),
      subcategory_id: form.subcategory_id ? parseInt(form.subcategory_id) : undefined,
      category_snapshot: form.category_snapshot,
      subcategory_snapshot: form.subcategory_snapshot,
      pricing: form.pricing, overview: form.overview,
      short_description: form.short_description, detail_description: form.detail_description,
      pricing_info: form.pricing_info,
      key_features: form.key_features.filter(f => f.title),
      use_cases: form.use_cases.filter(u => u.title),
      pros: form.pros.filter(Boolean), cons: form.cons.filter(Boolean),
      qa_items: form.qa_items.filter(qa => qa.question && qa.answer),
    };
  }

  async function handleEditSave(status: Submission["status"]) {
    try {
      const overrides: Partial<Submission> = buildOverrides();
      if (logoFile) overrides.logo_url = await uploadImage(logoFile);
      if (heroFile) overrides.hero_image_url = await uploadImage(heroFile);
      onSuccess?.(status, overrides);
    } catch {
      onSuccess?.(status, buildOverrides());
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInternalSaving(true);
    setInternalError(null);
    try {
      let logo_url = form.logo_url;
      let hero_image_url = form.hero_image_url;
      if (logoFile) logo_url = await uploadImage(logoFile);
      if (heroFile) hero_image_url = await uploadImage(heroFile);

      const res = await fetch("/api/admin/add-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildOverrides(), logo_url, hero_image_url, status: "published" }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Failed"); }
      if (onSuccess) onSuccess();
      else router.push("/admin/tool-submissions");
      router.refresh();
    } catch (err: any) {
      setInternalError(err.message);
    } finally {
      setInternalSaving(false);
    }
  }

  const formBody = (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Tool Name {!editMode && "*"}</Label>
          <Input value={form.name} onChange={e => {
            const name = e.target.value;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            update({ name, slug });
          }} required={!editMode} />
        </div>
        <div className="space-y-1">
          <Label>URL {!editMode && "*"}</Label>
          <Input type="url" value={form.url} onChange={e => update({ url: e.target.value })} required={!editMode} />
        </div>
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e => update({ slug: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Platform</Label>
          <Input value={form.platform} onChange={e => update({ platform: e.target.value })} placeholder="Web, Mobile, Desktop" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Category {!editMode && "*"}</Label>
          <Select value={form.category_id} onValueChange={handleCategoryChange}>
            <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Subcategory</Label>
          <Select value={form.subcategory_id} onValueChange={handleSubcategoryChange} disabled={!selectedCategory}>
            <SelectTrigger><SelectValue placeholder="Select subcategory…" /></SelectTrigger>
            <SelectContent>
              {selectedCategory?.subcategories?.map(sub => (
                <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo</Label>
          {logoPreview && <img src={logoPreview} alt="logo" className="h-12 w-12 rounded object-contain border p-0.5" />}
          <p className="text-xs text-muted-foreground">Recommended: 200×200 px · PNG/SVG</p>
          <Button type="button" variant="outline" size="sm" onClick={() => logoRef.current?.click()}>
            {logoPreview ? "Change Logo" : "Upload Logo"}
          </Button>
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => {
            const f = e.target.files?.[0]; if (!f) return;
            setLogoFile(f); setLogoPreview(URL.createObjectURL(f));
          }} />
          {logoFile && <p className="text-xs text-muted-foreground">{logoFile.name} — will upload on save</p>}
        </div>
        <div className="space-y-2">
          <Label>Hero Image</Label>
          {heroPreview && <img src={heroPreview} alt="hero" className="h-24 w-full rounded object-cover border" />}
          <p className="text-xs text-muted-foreground">Recommended: 1200×630 px · JPG or PNG</p>
          <Button type="button" variant="outline" size="sm" onClick={() => heroRef.current?.click()}>
            {heroPreview ? "Change Hero Image" : "Upload Hero Image"}
          </Button>
          <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={e => {
            const f = e.target.files?.[0]; if (!f) return;
            setHeroFile(f); setHeroPreview(URL.createObjectURL(f));
          }} />
          {heroFile && <p className="text-xs text-muted-foreground">{heroFile.name} — will upload on save</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Pricing</Label>
        <Select value={form.pricing} onValueChange={v => update({ pricing: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Free", "Freemium", "Paid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(["model", "paidFrom", "billingFrequency", "freeTrial"] as const).map(k => (
          <div key={k} className="space-y-1">
            <Label className="capitalize">{k.replace(/([A-Z])/g, " $1")}</Label>
            <Input value={form.pricing_info[k]} onChange={e => update({ pricing_info: { ...form.pricing_info, [k]: e.target.value } })} />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Short Description {!editMode && "*"}</Label>
        <Textarea rows={2} value={form.short_description} onChange={e => update({ short_description: e.target.value })} required={!editMode} />
      </div>
      <div className="space-y-1">
        <Label>Overview</Label>
        <Textarea rows={3} value={form.overview} onChange={e => update({ overview: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>Detail Description</Label>
        <Textarea rows={5} value={form.detail_description} onChange={e => update({ detail_description: e.target.value })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Key Features</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => update({ key_features: [...form.key_features, { title: "", description: "" }] })}>+ Add</Button>
        </div>
        {form.key_features.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input placeholder="Title" value={f.title} onChange={e => { const kf = [...form.key_features]; kf[i] = { ...kf[i], title: e.target.value }; update({ key_features: kf }); }} />
            <Input placeholder="Description" value={f.description} onChange={e => { const kf = [...form.key_features]; kf[i] = { ...kf[i], description: e.target.value }; update({ key_features: kf }); }} />
            <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => update({ key_features: form.key_features.filter((_, j) => j !== i) })}>✕</Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Use Cases</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => update({ use_cases: [...form.use_cases, { title: "", audience: "", description: "" }] })}>+ Add</Button>
        </div>
        {form.use_cases.map((u, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
            <Input placeholder="Title" value={u.title} onChange={e => { const uc = [...form.use_cases]; uc[i] = { ...uc[i], title: e.target.value }; update({ use_cases: uc }); }} />
            <Input placeholder="Audience" value={u.audience} onChange={e => { const uc = [...form.use_cases]; uc[i] = { ...uc[i], audience: e.target.value }; update({ use_cases: uc }); }} />
            <Input placeholder="Description" value={u.description} onChange={e => { const uc = [...form.use_cases]; uc[i] = { ...uc[i], description: e.target.value }; update({ use_cases: uc }); }} />
            <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => update({ use_cases: form.use_cases.filter((_, j) => j !== i) })}>✕</Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(["pros", "cons"] as const).map(key => (
          <div key={key} className="space-y-1">
            <Label className="capitalize">{key} (one per line)</Label>
            <Textarea rows={3} value={form[key].join("\n")} onChange={e => update({ [key]: e.target.value.split("\n") })} />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Q&A Section</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => update({ qa_items: [...form.qa_items, { question: "", answer: "" }] })}>Add Q&A</Button>
        </div>
        {form.qa_items.map((qa, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Label className="text-sm">Q&A #{i + 1}</Label>
              <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => update({ qa_items: form.qa_items.filter((_, j) => j !== i) })}>Remove</Button>
            </div>
            <Input placeholder="Question" value={qa.question} onChange={e => { const u = [...form.qa_items]; u[i] = { ...u[i], question: e.target.value }; update({ qa_items: u }); }} />
            <Textarea rows={3} placeholder="Answer" value={qa.answer} onChange={e => { const u = [...form.qa_items]; u[i] = { ...u[i], answer: e.target.value }; update({ qa_items: u }); }} />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Tags (comma separated)</Label>
        <Input value={form.tags} onChange={e => update({ tags: e.target.value })} placeholder="e.g. AI, Productivity, Writing" />
      </div>
    </div>
  );

  if (editMode) {
    return (
      <div className="space-y-4">
        {formBody}
        <div className="flex gap-3 pt-2">
          <Button onClick={() => handleEditSave("published")} disabled={saving} className="flex-1">
            {saving ? "Saving…" : "Save & Publish"}
          </Button>
          <Button variant="outline" onClick={() => handleEditSave("pending")} disabled={saving}>Save as Draft</Button>
          <Button variant="destructive" onClick={() => handleEditSave("rejected")} disabled={saving}>Reject</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      {formBody}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add & Publish"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tool-submissions")}>Cancel</Button>
      </div>
    </form>
  );
}
