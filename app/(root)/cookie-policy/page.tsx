import Footer2 from "@/components/footer2";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how AI Directory uses cookies to keep you signed in and improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 text-sm text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: June 8, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. What Are Cookies?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cookies are small text files placed on your device when you visit a
          website. They help the site remember information about your visit,
          making your next visit easier and the site more useful to you.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. How We Use Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          AI Directory uses cookies to keep you signed in, remember your
          preferences, understand how you use our platform, and improve your
          overall experience. We do not use cookies to track you across
          third-party websites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Types of Cookies We Use</h2>
        <ul className="text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
          <li>
            <strong>Essential cookies</strong> — required for authentication and
            core platform functionality. These cannot be disabled.
          </li>
          <li>
            <strong>Preference cookies</strong> — remember your settings such as
            theme and language preferences.
          </li>
          <li>
            <strong>Analytics cookies</strong> — help us understand how visitors
            interact with our site so we can improve it. Data is aggregated and
            anonymous.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Third-Party Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Some third-party services we use (such as analytics providers) may set
          their own cookies. These are governed by the respective third
          party&apos;s privacy policy, not ours.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Managing Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          You can control and delete cookies through your browser settings. Note
          that disabling certain cookies may affect the functionality of the
          platform, including your ability to stay signed in.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Cookie Policy from time to time. We will notify you
          of significant changes by updating the date at the top of this page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have questions about our use of cookies, please visit our{" "}
          <a href="/contact" className="underline hover:text-foreground">
            Contact page
          </a>
          .
        </p>
      </section>
      <Footer2 />
    </div>
  );
}
