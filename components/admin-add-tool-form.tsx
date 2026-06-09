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

const EMPTY: FormData = {
  name: "", url: "", slug: "", platform: "",
  category_id: "", subcategory_id: "",
  category_snapshot: "", subcategory_snapshot: "",
  pricing: "Free", overview: "", short_description: "", detail_description: "",
  logo_url: "", hero_image_url: "",
  pricing_info: { model: "", paidFrom: "", billingFrequency: "", freeTrial: "" },
  key_features: [], use_cases: [], pros: [], cons: [], tags: "",
  qa_items: [],
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export function AdminAddToolForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categories").select("*, subcategories(*)").order("display_order")
      .then(({ data }) => { if (data) setCategories(data); });
  }, []);

  function update(patch: Partial<FormData>) {
    setForm(prev => ({ ...prev, ...patch }));
  }

  function handleNameChange(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    update({ name, slug });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let logo_url = form.logo_url;
      let hero_image_url = form.hero_image_url;
      if (logoFile) logo_url = await uploadImage(logoFile);
      if (heroFile) hero_image_url = await uploadImage(heroFile);

      const res = await fetch("/api/admin/add-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logo_url, hero_image_url,
          category_id: parseInt(form.category_id),
          subcategory_id: form.subcategory_id ? parseInt(form.subcategory_id) : null,
          pros: form.pros.filter(Boolean),
          cons: form.cons.filter(Boolean),
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          key_features: form.key_features.filter(f => f.title),
          use_cases: form.use_cases.filter(u => u.title),
          qa_items: form.qa_items.filter(qa => qa.question && qa.answer),
          status: "published",
        }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Failed"); }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/tool-submissions");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}

      {/* Basic */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Tool Name *</Label>
          <Input value={form.name} onChange={e => handleNameChange(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>URL *</Label>
          <Input type="url" value={form.url} onChange={e => update({ url: e.target.value })} required />
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

      {/* Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Category *</Label>
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

      {/* Logo & Hero */}
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

      {/* Pricing */}
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

      {/* Descriptions */}
      <div className="space-y-1">
        <Label>Short Description *</Label>
        <Textarea rows={2} value={form.short_description} onChange={e => update({ short_description: e.target.value })} required />
      </div>
      <div className="space-y-1">
        <Label>Overview</Label>
        <Textarea rows={3} value={form.overview} onChange={e => update({ overview: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>Detail Description</Label>
        <Textarea rows={5} value={form.detail_description} onChange={e => update({ detail_description: e.target.value })} />
      </div>

      {/* Key Features */}
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

      {/* Use Cases */}
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

      {/* Pros & Cons */}
      <div className="grid grid-cols-2 gap-4">
        {(["pros", "cons"] as const).map(key => (
          <div key={key} className="space-y-1">
            <Label className="capitalize">{key} (one per line)</Label>
            <Textarea rows={3} value={form[key].join("\n")} onChange={e => update({ [key]: e.target.value.split("\n") })} />
          </div>
        ))}
      </div>

      {/* Q&A Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Q&A Section</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => update({ qa_items: [...form.qa_items, { question: "", answer: "" }] })}>
            Add Q&A
          </Button>
        </div>
        {form.qa_items.map((qa, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <Label className="text-sm">Q&A #{index + 1}</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => update({ qa_items: form.qa_items.filter((_, i) => i !== index) })}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Question"
                value={qa.question}
                onChange={e => {
                  const updated = [...form.qa_items];
                  updated[index].question = e.target.value;
                  update({ qa_items: updated });
                }}
              />
              <Textarea
                rows={3}
                placeholder="Answer"
                value={qa.answer}
                onChange={e => {
                  const updated = [...form.qa_items];
                  updated[index].answer = e.target.value;
                  update({ qa_items: updated });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <Label>Tags (comma separated)</Label>
        <Input value={form.tags} onChange={e => update({ tags: e.target.value })} placeholder="e.g. AI, Productivity, Writing" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add & Publish"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tool-submissions")}>Cancel</Button>
      </div>
    </form>
  );
}
