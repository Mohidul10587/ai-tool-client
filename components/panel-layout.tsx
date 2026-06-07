"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Settings,
  Shield,
  Users,
  Globe,
  Home,
  Inbox,
  FolderTree,
  Send,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PanelLayoutProps {
  children: React.ReactNode;
  role: "admin" | "user";
  userName: string;
  avatarUrl?: string;
}

const userNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Tools Submissions",
    href: "/dashboard/tool-submissions",
    icon: <Inbox size={18} />,
  },
  {
    label: "Featured Ad",
    href: "/dashboard/featured-ad",
    icon: <FileText size={18} />,
  },
  {
    label: "Submission Service",
    href: "/dashboard/submission-service",
    icon: <Send size={18} />,
  },
  {
    label: "Public Review",
    href: "/dashboard/public-review",
    icon: <FileText size={18} />,
  },
  { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  {
    label: "Profile Settings",
    href: "/dashboard/settings",
    icon: <Settings size={18} />,
  },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: <Shield size={18} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
  {
    label: "Tool Submissions",
    href: "/admin/tool-submissions",
    icon: <Inbox size={18} />,
  },
  {
    label: "Add New Tool",
    href: "/admin/add-tool",
    icon: <Plus size={18} />,
  },
  {
    label: "Featured Ads",
    href: "/admin/featured-ads",
    icon: <Inbox size={18} />,
  },
  {
    label: "Add Featured Ad",
    href: "/admin/add-featured-ad",
    icon: <Plus size={18} />,
  },
  {
    label: "Submission Service",
    href: "/admin/submission-service",
    icon: <Send size={18} />,
  },
  {
    label: "Public Review",
    href: "/admin/public-review",
    icon: <FileText size={18} />,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <FolderTree size={18} />,
  },
  {
    label: "Site Settings",
    href: "/admin/site-settings",
    icon: <Globe size={18} />,
  },
  {
    label: "Pricing Settings",
    href: "/admin/pricing-settings",
    icon: <FileText size={18} />,
  },
  {
    label: "My Submissions",
    href: "/admin/submissions",
    icon: <Inbox size={18} />,
  },
  {
    label: "My Featured Ad",
    href: "/admin/featured-ad",
    icon: <FileText size={18} />,
  },
  { label: "Profile", href: "/admin/profile", icon: <User size={18} /> },
  {
    label: "Profile Settings",
    href: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

function SidebarContent({
  nav,
  userName,
  role,
  avatarUrl,
  onClose,
}: {
  nav: NavItem[];
  userName: string;
  role: string;
  avatarUrl?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <Link
          href="/"
          className="font-semibold text-lg hover:opacity-80 transition-opacity"
        >
          {role === "admin" ? "Admin Panel" : "My Dashboard"}
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-3 py-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Homepage link */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-2 border-t pt-3"
        >
          <Home size={18} />
          Go to Homepage
        </Link>
      </nav>

      {/* User + Logout */}
      <div className="border-t px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground truncate flex-1">
            {userName}
          </p>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm" className="w-full" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}

export function PanelLayout({
  children,
  role,
  userName,
  avatarUrl,
}: PanelLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r shrink-0">
        <SidebarContent
          nav={nav}
          userName={userName}
          role={role}
          avatarUrl={avatarUrl}
        />
      </aside>

      {/* Mobile Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r shadow-xl transition-transform duration-300 lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          nav={nav}
          userName={userName}
          role={role}
          avatarUrl={avatarUrl}
          onClose={() => setDrawerOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 border-b px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <span className="font-semibold text-sm">
            {role === "admin" ? "Admin Panel" : "My Dashboard"}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
