"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Action = (formData: FormData) => Promise<{ error?: string; success?: boolean }>;

export function SettingsForm({
  action,
  fields,
  submitLabel,
}: {
  action: Action;
  fields: { name: string; label: string; type?: string; defaultValue?: string; minLength?: number }[];
  submitLabel: string;
}) {
  const [status, setStatus] = useState<{ error?: string; success?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await action(new FormData(e.currentTarget));
    setStatus(result);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status?.error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{status.error}</p>
      )}
      {status?.success && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">Saved successfully.</p>
      )}
      {fields.map((f) => (
        <div key={f.name} className="space-y-1">
          <Label htmlFor={f.name}>{f.label}</Label>
          <Input
            id={f.name}
            name={f.name}
            type={f.type ?? "text"}
            defaultValue={f.defaultValue}
            minLength={f.minLength}
            required
          />
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
