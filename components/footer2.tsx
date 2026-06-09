"use client";

import Link from "next/link";
import { Zap, Mail } from "lucide-react";
import { Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

const footerLinks = {
  Product: [
    { name: "Submit Tool", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
  ],
  Resources: [
    { name: "Blog", href: "#" },
    { name: "Newsletter", href: "#" },
    { name: "FAQ", href: "/faq" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "DMCA", href: "/dmca" },
    { name: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer2() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { getSiteSettings } = await import("@/lib/site-settings");
        const data = await getSiteSettings();
        setSettings(data || {});
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  return (
    <footer className="border-t border-black/10 bg-white mt-24">
      <div className=" px-4 py-10 ">
        {/* Top Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="h-8 max-w-[140px] object-contain"
                />
              ) : (
                <>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-black">
                    AI Tools
                  </span>
                </>
              )}
            </Link>
            <p className="mt-3 max-w-xs text-xs text-black/60">
              The largest directory of AI tools. Discover, compare, and find the
              best AI solutions for your needs.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {/* X (Twitter) */}
              <a
                href={settings.social_twitter || "#"}
                target={settings.social_twitter ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={settings.social_facebook || "#"}
                target={settings.social_facebook ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href={settings.social_linkedin || "#"}
                target={settings.social_linkedin ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              {/* Email */}
              <a
                href={
                  settings.social_email
                    ? `mailto:${settings.social_email}`
                    : "mailto:contact@aitools.com"
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/60 transition-all hover:bg-black/10 hover:text-black"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-black">{title}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-black/60 transition-colors hover:text-black"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 sm:flex-row">
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} AI Tools. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-black/40 transition-colors hover:text-black"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-black/40 transition-colors hover:text-black"
            >
              Terms
            </Link>
            <Link
              href="/cookie-policy"
              className="text-xs text-black/40 transition-colors hover:text-black"
            >
              Cookies
            </Link>
            <Link
              href="/sitemap-page"
              className="text-xs text-black/40 transition-colors hover:text-black"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
