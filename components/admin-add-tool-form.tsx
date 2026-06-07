"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";

interface Category {
  id: number;
  name: string;
  subcategories?: { id: number; name: string }[];
}

export function AdminAddToolForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    slug: "",
    overview: "",
    short_description: "",
    detail_description: "",
    category_id: "",
    subcategory_id: "",
    pricing: "Free",
    platform: "",
    logo_url: "",
    hero_image_url: "",
    pricing_info: {
      model: "",
      paidFrom: "",
      billingFrequency: "",
      freeTrial: ""
    },
    key_features: [{ title: "", description: "" }],
    use_cases: [{ title: "", audience: "", description: "" }],
    pros: [""],
    cons: [""],
    tags: [""]
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handlePricingInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing_info: { ...prev.pricing_info, [field]: value }
    }));
  };

  const handleArrayChange = (field: "key_features" | "use_cases" | "pros" | "cons" | "tags", index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: "key_features" | "use_cases" | "pros" | "cons" | "tags") => {
    const newItem = field === "key_features" 
      ? { title: "", description: "" }
      : field === "use_cases"
      ? { title: "", audience: "", description: "" }
      : "";
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field: "key_features" | "use_cases" | "pros" | "cons" | "tags", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleHeroSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let logo_url = formData.logo_url;
      let hero_image_url = formData.hero_image_url;
      
      // Upload images if selected
      if (logoFile) {
        logo_url = await uploadImage(logoFile);
      }
      if (heroFile) {
        hero_image_url = await uploadImage(heroFile);
      }

      const payload = {
        ...formData,
        logo_url,
        hero_image_url,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        pros: formData.pros.filter(Boolean),
        cons: formData.cons.filter(Boolean),
        tags: formData.tags.filter(Boolean),
        key_features: formData.key_features.filter(f => f.title && f.description),
        use_cases: formData.use_cases.filter(u => u.title && u.description),
        status: "published"
      };

      const res = await fetch("/api/admin/add-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add tool");
      }

      router.push("/admin/tool-submissions");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === parseInt(formData.category_id));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tool Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter tool name"
                required
              />
            </div>
            <div>
              <Label>URL *</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="auto-generated-from-name"
              />
            </div>
            <div>
              <Label>Platform</Label>
              <Input
                value={formData.platform}
                onChange={(e) => handleInputChange("platform", e.target.value)}
                placeholder="Web, Mobile, Desktop"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select 
                value={formData.subcategory_id} 
                onValueChange={(value) => handleInputChange("subcategory_id", value)}
                disabled={!selectedCategory?.subcategories?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories?.map(sub => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Short Description *</Label>
            <Textarea
              value={formData.short_description}
              onChange={(e) => handleInputChange("short_description", e.target.value)}
              placeholder="Brief description of the tool"
              rows={2}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pricing *</Label>
              <Select value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Freemium">Freemium</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pricing Model</Label>
              <Input
                value={formData.pricing_info.model}
                onChange={(e) => handlePricingInfoChange("model", e.target.value)}
                placeholder="e.g., Subscription, One-time"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Logo URL</Label>
              <Input
                type="url"
                value={formData.logo_url}
                onChange={(e) => handleInputChange("logo_url", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <div className="mt-2">
                {logoPreview && (
                  <div className="flex items-center gap-2 mb-2">
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
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 200×200 px, PNG/SVG, max 5MB
                </p>
              </div>
            </div>
            <div>
              <Label>Hero Image URL</Label>
              <Input
                type="url"
                value={formData.hero_image_url}
                onChange={(e) => handleInputChange("hero_image_url", e.target.value)}
                placeholder="https://example.com/hero.png"
              />
              <div className="mt-2">
                {heroPreview && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroPreview}
                      alt="Hero preview"
                      className="h-10 w-16 rounded object-cover border p-0.5"
                    />
                    <span className="text-sm text-muted-foreground">
                      {heroFile?.name}
                    </span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => heroRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {heroPreview ? "Change Hero" : "Upload Hero Image"}
                </Button>
                <input
                  ref={heroRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroSelect}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200×600 px, PNG/JPG, max 5MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label>Overview</Label>
            <Textarea
              value={formData.overview}
              onChange={(e) => handleInputChange("overview", e.target.value)}
              placeholder="Detailed overview of the tool"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Key Features</Label>
            {formData.key_features.map((feature, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  placeholder="Feature title"
                  value={feature.title}
                  onChange={(e) => handleArrayChange("key_features", index, { ...feature, title: e.target.value })}
                />
                <Input
                  placeholder="Feature description"
                  value={feature.description}
                  onChange={(e) => handleArrayChange("key_features", index, { ...feature, description: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("key_features", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("key_features")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Input
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem("tags", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("tags")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding Tool..." : "Add Tool"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tool-submissions")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
