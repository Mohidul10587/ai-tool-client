"use client";

import { useState, useRef } from "react";
import { saveSiteSettings } from "@/lib/site-settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@/lib/site-settings";

const textSections = [
  {
    title: "General",
    fields: [
      { key: "site_title", label: "Site Title", type: "input" },
      { key: "site_description", label: "Meta Description", type: "textarea" },
      { key: "site_keywords", label: "Meta Keywords (comma separated)", type: "input" },
      { key: "footer_text", label: "Footer Text", type: "input" },
    ],
  },
  {
    title: "Branding",
    fields: [],
  },
  {
    title: "SEO & Verification",
    fields: [
      { key: "twitter_handle", label: "Twitter Handle", type: "input", placeholder: "@yourhandle" },
      { key: "google_verification", label: "Google Site Verification Code", type: "input" },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "social_twitter", label: "Twitter / X URL", type: "input", placeholder: "https://twitter.com/yourhandle" },
      { key: "social_facebook", label: "Facebook URL", type: "input", placeholder: "https://facebook.com/yourpage" },
      { key: "social_linkedin", label: "LinkedIn URL", type: "input", placeholder: "https://linkedin.com/company/yourpage" },
      { key: "social_email", label: "Contact Email", type: "input", placeholder: "contact@yourdomain.com" },
    ],
  },
];

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(settings.logo_url ?? "");
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string>(settings.favicon_url ?? "");
  const [ogFile, setOgFile] = useState<File | null>(null);
  const [ogPreview, setOgPreview] = useState<string>(settings.og_image_url ?? "");

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const ogRef = useRef<HTMLInputElement>(null);

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File) => void,
    setPreview: (s: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const fd = new FormData(e.currentTarget);

      if (logoFile) {
        const url = await uploadFile(logoFile);
        fd.set("logo_url", url);
      }
      if (faviconFile) {
        const url = await uploadFile(faviconFile);
        fd.set("favicon_url", url);
      }
      if (ogFile) {
        const url = await uploadFile(ogFile);
        fd.set("og_image_url", url);
      }

      const result = await saveSiteSettings(fd);
      setStatus(result);
      if (result.success) {
        setLogoFile(null);
        setFaviconFile(null);
        setOgFile(null);
      }
    } catch (err: any) {
      setStatus({ error: err.message ?? "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {status?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{status.error}</p>
      )}
      {status?.success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
          Settings saved. Changes are live.
        </p>
      )}

      {textSections.filter(s => s.fields.length > 0).map((section) => (
        <Card key={section.title}>
          <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.key} name={f.key} defaultValue={settings[f.key as keyof SiteSettings]} rows={3} />
                ) : (
                  <Input
                    id={f.key}
                    name={f.key}
                    defaultValue={settings[f.key as keyof SiteSettings]}
                    placeholder={(f as { placeholder?: string }).placeholder}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Logo upload */}
      <Card>
        <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {logoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPreview} alt="Logo preview" className="h-12 object-contain border rounded p-1" />
          )}
          <p className="text-xs text-muted-foreground">
            Recommended: <strong>200×60 px</strong> (horizontal) or <strong>200×200 px</strong> (square) · PNG or SVG with transparent background · max 2MB
          </p>
          <input type="hidden" name="logo_url" value={logoFile ? "" : (settings.logo_url ?? "")} />
          <Button type="button" variant="outline" size="sm" onClick={() => logoRef.current?.click()}>
            {logoPreview ? "Change Logo" : "Upload Logo"}
          </Button>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setLogoFile, setLogoPreview)}
          />
          {logoFile && <p className="text-xs text-muted-foreground">{logoFile.name} — will upload on save</p>}
        </CardContent>
      </Card>

      {/* Favicon upload */}
      <Card>
        <CardHeader><CardTitle>Favicon</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {faviconPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={faviconPreview} alt="Favicon preview" className="h-8 w-8 object-contain border rounded p-1" />
          )}
          <p className="text-xs text-muted-foreground">
            Recommended: <strong>32×32 px</strong> or <strong>64×64 px</strong> · ICO, PNG, or SVG · Square shape works best · max 512KB
          </p>
          <input type="hidden" name="favicon_url" value={faviconFile ? "" : (settings.favicon_url ?? "")} />
          <Button type="button" variant="outline" size="sm" onClick={() => faviconRef.current?.click()}>
            {faviconPreview ? "Change Favicon" : "Upload Favicon"}
          </Button>
          <input
            ref={faviconRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setFaviconFile, setFaviconPreview)}
          />
          {faviconFile && <p className="text-xs text-muted-foreground">{faviconFile.name} — will upload on save</p>}
        </CardContent>
      </Card>

      {/* OG Image upload */}
      <Card>
        <CardHeader><CardTitle>OG Image (Social Share)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {ogPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ogPreview} alt="OG image preview" className="h-24 object-contain border rounded p-1" />
          )}
          <p className="text-xs text-muted-foreground">
            Recommended: <strong>1200×630 px</strong> · JPG or PNG · Used when sharing on social media · max 5MB
          </p>
          <input type="hidden" name="og_image_url" value={ogFile ? "" : (settings.og_image_url ?? "")} />
          <Button type="button" variant="outline" size="sm" onClick={() => ogRef.current?.click()}>
            {ogPreview ? "Change OG Image" : "Upload OG Image"}
          </Button>
          <input
            ref={ogRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setOgFile, setOgPreview)}
          />
          {ogFile && <p className="text-xs text-muted-foreground">{ogFile.name} — will upload on save</p>}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Saving…" : "Save All Settings"}
      </Button>
    </form>
  );
}
