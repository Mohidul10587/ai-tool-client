"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, ChevronDown, X, Menu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@supabase/supabase-js";
import type { Category } from "@/types/mega-menu";

const featuredAds = [
  { id: 1, name: "AdTech AI", color: "bg-rose-50" },
  { id: 2, name: "BrandBot", color: "bg-sky-50" },
  { id: 3, name: "CloudAI Pro", color: "bg-amber-50" },
  { id: 4, name: "DataMind", color: "bg-emerald-50" },
  { id: 5, name: "EdgeAI", color: "bg-violet-50" },
  { id: 6, name: "FlowAI", color: "bg-pink-50" },
  { id: 7, name: "GenAI Studio", color: "bg-cyan-50" },
  { id: 8, name: "HyperWrite", color: "bg-orange-50" },
  { id: 9, name: "InsightAI", color: "bg-lime-50" },
  { id: 10, name: "JetBot", color: "bg-indigo-50" },
];

function MegaMenuDropdown({ isOpen, categories }: { isOpen: boolean; categories: Category[] }) {
  if (!isOpen) return null;
  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-[800px] -translate-x-1/2 rounded-xl border border-black/10 bg-white p-6 shadow-xl">
      <div className="grid grid-cols-6 gap-6">
        {categories.map((category) => (
          <div key={category.id}>
            <h4 className="mb-3 text-sm font-bold text-black">{category.name}</h4>
            <ul className="space-y-2">
              {category.subcategories?.map((sub) => (
                <li key={sub.id}>
                  <Link href={`/category/${sub.slug}`} className="text-xs text-black/60 transition-colors hover:text-black">
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-black/10 pt-4">
        <Link href="/categories" className="flex items-center gap-1.5 text-xs font-semibold text-black/60 transition-colors hover:text-black">
          Browse All Categories <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function MobileMegaMenu({ isOpen, onClose, categories }: { isOpen: boolean; onClose: () => void; categories: Category[] }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] md:hidden" style={{ backgroundColor: "#ffffff" }}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 px-4 py-3" style={{ backgroundColor: "#ffffff" }}>
        <h2 className="text-base font-bold text-black">Categories</h2>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200">
          <X className="h-5 w-5 text-black" />
        </button>
      </div>
      <div className="h-[calc(100vh-52px)] overflow-y-auto px-4 pb-24 pt-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="rounded-xl border border-black/10 p-4" style={{ backgroundColor: "#f9fafb" }}>
              <h4 className="mb-3 text-sm font-bold text-black">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-black/70 transition-all hover:border-black hover:bg-gray-100 active:scale-95"
                    style={{ backgroundColor: "#ffffff" }}
                    onClick={onClose}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/categories" onClick={onClose} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-black/80">
            Browse All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*, subcategories(*)")
      .order("display_order")
      .then(({ data }) => {
        if (data) {
          setCategories(data.map(cat => ({
            ...cat,
            subcategories: cat.subcategories.sort((a, b) => a.display_order - b.display_order)
          })));
        }
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    if (isMegaMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMegaMenuOpen]);

  const toggleMegaMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMegaMenuOpen((prev) => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-56 xl:px-60">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-black">AI Directory</span>
        </Link>

        <div ref={menuRef} className="relative hidden items-center gap-6 md:flex">
          <button onClick={toggleMegaMenu} className="flex items-center gap-1 text-sm text-black/60 transition-colors hover:text-black">
            Categories
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
          </button>
          <Link href="/pricing" className="text-sm text-black/60 transition-colors hover:text-black">Pricing</Link>
          <a href="#" className="text-sm text-black/60 transition-colors hover:text-black">Submit Tool</a>
          <a href="#" className="text-sm text-black/60 transition-colors hover:text-black">Blog</a>
          <MegaMenuDropdown isOpen={isMegaMenuOpen} categories={categories} />
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href={user.user_metadata?.role === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 rounded-full bg-black pl-1 pr-3 py-1 text-sm font-medium text-white transition-all hover:bg-black/80"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-[10px] bg-white/20 text-white">
                  {(user.user_metadata?.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-black/80">
              Login
            </Link>
          )}
          <button
            className="md:hidden"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if (isMobileMenuOpen) setIsMobileCategoriesOpen(false);
            }}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="overflow-hidden border-t border-black/5 bg-white py-2 lg:hidden">
        <div className="marquee-container flex">
          <div className="marquee-content flex animate-marquee gap-3">
            {[...featuredAds, ...featuredAds].map((ad, index) => (
              <a key={`${ad.id}-${index}`} href="#" className={`flex h-9 min-w-[130px] items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-black shadow-sm ${ad.color}`}>
                {ad.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-black/10 bg-white shadow-lg md:hidden">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-2">
              <button onClick={() => setIsMobileCategoriesOpen(true)} className="flex items-center justify-between rounded-xl border border-black/10 bg-gray-50 px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100">
                <span>Categories</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link href="/pricing" className="rounded-xl border border-black/10 bg-gray-50 px-4 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-gray-100">Pricing</Link>
              <a href="#" className="rounded-xl border border-black/10 bg-gray-50 px-4 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-gray-100">Submit Tool</a>
              <a href="#" className="rounded-xl border border-black/10 bg-gray-50 px-4 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-gray-100">Blog</a>
            </div>
          </div>
        </div>
      )}

      <MobileMegaMenu
        isOpen={isMobileCategoriesOpen}
        onClose={() => {
          setIsMobileCategoriesOpen(false);
          setIsMobileMenuOpen(false);
        }}
        categories={categories}
      />
    </nav>
  );
}
