"use client";

import { useState } from "react";
import { saveSiteSettings } from "@/lib/site-settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@/lib/site-settings";

const sections = [
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
    fields: [
      { key: "logo_url", label: "Logo URL", type: "input", placeholder: "https://…/logo.png" },
      { key: "favicon_url", label: "Favicon URL", type: "input", placeholder: "https://…/favicon.ico" },
      { key: "og_image_url", label: "OG Image URL", type: "input", placeholder: "https://…/og.png" },
    ],
  },
  {
    title: "SEO & Verification",
    fields: [
      { key: "twitter_handle", label: "Twitter Handle", type: "input", placeholder: "@yourhandle" },
      { key: "google_verification", label: "Google Site Verification Code", type: "input" },
    ],
  },
];

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await saveSiteSettings(new FormData(e.currentTarget));
    setStatus(result);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {status?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{status.error}</p>
      )}
      {status?.success && (
        <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-md">
          Settings saved. Changes are live.
        </p>
      )}

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.key}
                    name={f.key}
                    defaultValue={settings[f.key as keyof SiteSettings]}
                    rows={3}
                  />
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

      {/* Logo preview */}
      <Card>
        <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Logo and favicon previews will reflect after saving and refreshing.</p>
          {settings.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt="Logo preview" className="h-10 mt-2 object-contain" />
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Saving…" : "Save All Settings"}
      </Button>
    </form>
  );
}
