import Footer2 from "@/components/footer2";
import { getSiteSettings } from "@/lib/site-settings";
import { Mail, Twitter, Facebook, Linkedin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the AI Directory team for tool submissions, partnerships, advertising, or general enquiries.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contacts = [
    settings.social_email && {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: settings.social_email,
      href: `mailto:${settings.social_email}`,
    },
    settings.social_twitter && {
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: "Twitter / X",
      value: settings.social_twitter,
      href: settings.social_twitter,
    },
    settings.social_facebook && {
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      label: "Facebook",
      value: settings.social_facebook,
      href: settings.social_facebook,
    },
    settings.social_linkedin && {
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      value: settings.social_linkedin,
      href: settings.social_linkedin,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          We&apos;d love to hear from you. Reach out through any of the channels
          below.
        </p>
      </div>

      {contacts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 transition-colors"
            >
              <span className="text-muted-foreground">{c.icon}</span>
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground break-all">
                  {c.value}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Contact information has not been set up yet. Please check back later.
        </p>
      )}

      <div className="rounded-xl border border-border p-6 space-y-3 bg-muted/20">
        <h2 className="text-base font-semibold">General Enquiries</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For tool submissions, partnership opportunities, advertising, or any
          other enquiries, please use the contact details above. We aim to
          respond within 2 business days.
        </p>
      </div>
      <Footer2 />
    </div>
  );
}
