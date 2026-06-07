"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function AdminAddFeaturedAdForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const logoRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    url: "",
    description: "",
    tool_name: "",
    price_paid: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload logo");
    }
    
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let logo_url = "";
      
      // Upload logo if selected
      if (logoFile) {
        logo_url = await uploadLogo(logoFile);
      }

      const payload = {
        ...formData,
        logo_url,
        status: "approved" // Admin uploaded ads are automatically approved
      };

      const res = await fetch("/api/admin/add-featured-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add featured ad");
      }

      router.push("/admin/featured-ads");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Featured Ad Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tool Name *</Label>
              <Input
                value={formData.tool_name}
                onChange={(e) => handleInputChange("tool_name", e.target.value)}
                placeholder="Enter tool name"
                required
              />
            </div>
            <div>
              <Label>Tool URL *</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value.slice(0, 40))}
              placeholder="Short description (max 40 characters)"
              maxLength={40}
              rows={2}
              required
            />
            <p className="text-right text-xs text-muted-foreground mt-1">
              {formData.description.length}/40
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price Paid (Optional)</Label>
              <Input
                value={formData.price_paid}
                onChange={(e) => handleInputChange("price_paid", e.target.value)}
                placeholder="e.g., 50"
                type="number"
              />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="space-y-2">
                {logoPreview && (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-10 w-10 rounded object-contain border p-0.5"
                    />
                    <span className="text-sm text-muted-foreground">
                      {logoFile?.name}
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {logoPreview ? "Change Logo" : "Upload Logo"}
                </Button>
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoSelect}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 200×200 px, PNG/SVG, max 2MB
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding Featured Ad..." : "Add Featured Ad"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/featured-ads")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
