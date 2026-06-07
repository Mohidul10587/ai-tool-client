"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";

export function AvatarUpload({
  userId,
  currentUrl,
  initials,
}: {
  userId: string;
  currentUrl?: string;
  initials: string;
}) {
  const [savedUrl, setSavedUrl] = useState<string | undefined>(currentUrl);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Max file size is 2MB"); return; }
    setError(null);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!pendingFile) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = pendingFile.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, pendingFile, { upsert: true });

    if (uploadError) { setError(uploadError.message); setUploading(false); return; }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const fd = new FormData();
    fd.set("name", "");
    fd.set("avatar_url", publicUrl);
    await updateProfile(fd);

    setSavedUrl(publicUrl);
    setPendingFile(null);
    setUploading(false);
  }

  function handleCancel() {
    setPendingFile(null);
    setPreview(savedUrl);
    setError(null);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-20 w-20 text-xl">
          <AvatarImage src={preview} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:opacity-90"
        >
          <Camera size={13} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleSelect}
        disabled={uploading}
      />

      {pendingFile && (
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={uploading}>
            {uploading ? <><Loader2 size={13} className="animate-spin mr-1" />Uploading…</> : "Save Photo"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={uploading}>Cancel</Button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground text-center">
        Recommended: <strong>200×200 px</strong> · JPG, PNG or WebP · Square shape · max 2MB
      </p>
    </div>
  );
}
