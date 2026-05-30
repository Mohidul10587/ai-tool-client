"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Item = { id: number; url: string; tool_name: string; [key: string]: unknown };

interface ExtraField {
  key: string;
  label: string;
  maxLength?: number;
}

interface Props {
  item: Item | null;
  onClose: () => void;
  onSave: (id: number, data: { url: string; tool_name: string; [key: string]: string }) => Promise<{ error?: string; success?: boolean }>;
  extraFields?: ExtraField[];
}

export function UserEditModal({ item, onClose, onSave, extraFields }: Props) {
  const [url, setUrl] = useState("");
  const [toolName, setToolName] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (item) {
      setUrl(item.url);
      setToolName(item.tool_name);
      const init: Record<string, string> = {};
      extraFields?.forEach(f => { init[f.key] = (item[f.key] as string) ?? ""; });
      setExtras(init);
      setError(null);
    }
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    setError(null);
    const result = await onSave(item.id, { url, tool_name: toolName, ...extras });
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
      router.refresh();
    }
  }

  const dirty = item && (
    url !== item.url ||
    toolName !== item.tool_name ||
    extraFields?.some(f => extras[f.key] !== ((item[f.key] as string) ?? ""))
  );

  return (
    <Dialog open={!!item} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="ue-name">Tool Name</Label>
            <Input id="ue-name" value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="My AI Tool" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ue-url">URL</Label>
            <Input id="ue-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          {extraFields?.map(f => (
            <div key={f.key} className="space-y-1">
              <Label htmlFor={`ue-${f.key}`}>
                {f.label}{f.maxLength && <span className="ml-1 text-xs text-muted-foreground">(max {f.maxLength} chars)</span>}
              </Label>
              <Input
                id={`ue-${f.key}`}
                value={extras[f.key] ?? ""}
                onChange={(e) => setExtras(prev => ({ ...prev, [f.key]: f.maxLength ? e.target.value.slice(0, f.maxLength) : e.target.value }))}
                maxLength={f.maxLength}
              />
              {f.maxLength && <p className="text-right text-xs text-muted-foreground">{(extras[f.key] ?? "").length}/{f.maxLength}</p>}
            </div>
          ))}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {dirty && <p className="text-xs text-muted-foreground">Saving will reset status to <strong>pending</strong> for re-review.</p>}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleSave} disabled={saving || !dirty}>{saving ? "Saving…" : "Save Changes"}</Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
