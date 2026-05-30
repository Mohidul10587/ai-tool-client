import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoriesManager } from "@/components/categories-manager";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") redirect("/dashboard");

  const { data: categories } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .order("display_order");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Categories</h2>
      <CategoriesManager initialCategories={categories || []} />
    </div>
  );
}
