import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "A complete list of all pages available on AI Directory.",
};

export default function SitemapPage() {
  const sections = [
    {
      title: "Main",
      links: [
        { name: "Home", href: "/" },
        { name: "Pricing", href: "/pricing" },
        { name: "Categories", href: "/categories" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookie-policy" },
        { name: "DMCA", href: "/dmca" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
    {
      title: "Account",
      links: [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "Dashboard", href: "/dashboard" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground">All pages available on AI Directory.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:underline hover:text-foreground text-muted-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
