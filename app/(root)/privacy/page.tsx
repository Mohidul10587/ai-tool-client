import Footer2 from "@/components/footer2";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how AI Directory collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 text-sm text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: June 7, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          When you register or use AI Directory, we collect information you
          provide directly, such as your name, email address, and profile photo.
          We also automatically collect usage data including pages visited,
          search queries, votes, and comments you submit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          2. How We Use Your Information
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to operate and improve the platform,
          personalise your experience, process tool submissions and featured ad
          requests, send transactional emails (e.g. account verification), and
          comply with legal obligations. We do not sell your personal data to
          third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use strictly necessary cookies to maintain your authenticated
          session. We may also use analytics cookies to understand how visitors
          interact with the site. You can disable cookies in your browser
          settings, though some features may not function correctly without
          them.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Data Storage & Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your data is stored securely using Supabase (PostgreSQL) hosted on
          infrastructure that complies with industry-standard security
          practices. Uploaded images are stored on Cloudinary. We use HTTPS for
          all data transmission and implement access controls to limit who can
          view your data.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the following third-party services that may process your data:{" "}
          <strong>Supabase</strong> for authentication and database,{" "}
          <strong>Cloudinary</strong> for image storage, and{" "}
          <strong>Vercel</strong> for hosting. Each service has its own privacy
          policy governing their data practices.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You have the right to access, correct, or delete your personal data at
          any time. You can update your profile information from your dashboard.
          To request full account deletion, please contact us at the email
          address below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. Children's Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">
          AI Directory is not directed at children under the age of 13. We do
          not knowingly collect personal information from children. If you
          believe a child has provided us with personal data, please contact us
          and we will delete it promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">8. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify
          you of significant changes by posting the new policy on this page with
          an updated date. Your continued use of the platform after changes
          constitutes your acceptance of the revised policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">9. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
          <a
            href="mailto:privacy@aidirectory.com"
            className="underline hover:text-foreground"
          >
            privacy@aidirectory.com
          </a>
          .
        </p>
      </section>
      <Footer2 />
    </div>
  );
}
