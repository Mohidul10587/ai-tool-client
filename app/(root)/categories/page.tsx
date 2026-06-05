import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: প্রতি ঘণ্টায় revalidate

export const metadata: Metadata = {
  title: "All AI Tool Categories",
  description: "Browse all AI tool categories and discover the best AI tools for every use case.",
};

type Subcategory = {
  id: string;
  name: string;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  display_order: number;
  subcategories: Subcategory[];
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, display_order, subcategories(id, name, slug)")
    .order("display_order");

  const cats = (categories as Category[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">All Categories</h1>
          <p className="text-lg text-muted-foreground">
            Browse {cats.length} categories of AI tools
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-3 text-base font-bold text-black">{category.name}</h2>
              {category.subcategories?.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/category/${sub.slug}`}
                        className="text-sm text-black/70 hover:text-black hover:underline transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-black/40">No subcategories yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
