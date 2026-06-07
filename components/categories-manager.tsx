"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types/mega-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [subcategories, setSubcategories] = useState<{name: string; slug: string}[]>([{name: "", slug: ""}]);

  const supabase = createClient();

  const openDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategorySlug(category.slug);
      setSubcategories(category.subcategories?.map(s => ({name: s.name, slug: s.slug})) || [{name: "", slug: ""}]);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategorySlug("");
      setSubcategories([{name: "", slug: ""}]);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const filteredSubs = subcategories.filter(s => s.name.trim() && s.slug.trim());
    if (!categoryName.trim() || !categorySlug.trim() || !filteredSubs.length) return;

    if (editingCategory) {
      await supabase.from("categories").update({ name: categoryName, slug: categorySlug }).eq("id", editingCategory.id);
      await supabase.from("subcategories").delete().eq("category_id", editingCategory.id);
      await supabase.from("subcategories").insert(filteredSubs.map((sub, idx) => ({
        category_id: editingCategory.id,
        name: sub.name,
        slug: sub.slug,
        display_order: idx
      })));
    } else {
      const { data } = await supabase.from("categories").insert({
        name: categoryName,
        slug: categorySlug,
        display_order: categories.length
      }).select().single();
      if (data) {
        await supabase.from("subcategories").insert(filteredSubs.map((sub, idx) => ({
          category_id: data.id,
          name: sub.name,
          slug: sub.slug,
          display_order: idx
        })));
      }
    }

    const { data: updated } = await supabase.from("categories").select("*, subcategories(*)").order("display_order");
    setCategories(updated || []);
    setOpen(false);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    await supabase.from("categories").delete().eq("id", id);
    setCategories(categories.filter(c => c.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => openDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit" : "Add"} Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Category Name" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
            <Input placeholder="Category Slug (e.g., text-chat)" value={categorySlug} onChange={e => setCategorySlug(e.target.value)} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategories</label>
              {subcategories.map((sub, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input placeholder="Name" value={sub.name} onChange={e => {
                    const newSubs = [...subcategories];
                    newSubs[idx].name = e.target.value;
                    setSubcategories(newSubs);
                  }} />
                  <Input placeholder="Slug" value={sub.slug} onChange={e => {
                    const newSubs = [...subcategories];
                    newSubs[idx].slug = e.target.value;
                    setSubcategories(newSubs);
                  }} />
                  <Button variant="ghost" size="icon" onClick={() => setSubcategories(subcategories.filter((_, i) => i !== idx))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setSubcategories([...subcategories, {name: "", slug: ""}])}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            </div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {categories.map(category => (
          <div key={category.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openDialog(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(category.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.subcategories?.map(sub => (
                <span key={sub.id} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {sub.name} <span className="text-xs text-gray-500">/{sub.slug}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete category?"
        description="This will permanently delete this category and cannot be undone."
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
