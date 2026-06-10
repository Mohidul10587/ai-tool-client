import Footer2 from "@/components/footer2";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the AI Directory Terms of Service — rules for using the platform, submitting tools, and paid services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 text-sm text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: June 7, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using AI Directory ("the platform"), you agree to be
          bound by these Terms of Service. If you do not agree to these terms,
          please do not use the platform. We reserve the right to modify these
          terms at any time, and continued use of the platform constitutes
          acceptance of any changes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Use of the Platform</h2>
        <p className="text-muted-foreground leading-relaxed">
          You may use AI Directory for lawful purposes only. You agree not to:
          submit false, misleading, or spam content; attempt to gain
          unauthorised access to any part of the platform; scrape or harvest
          data without permission; impersonate another person or entity; or use
          the platform to distribute malware or harmful content.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Account Registration</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must provide accurate information when creating an account. You
          are responsible for maintaining the confidentiality of your login
          credentials and for all activity that occurs under your account.
          Notify us immediately if you suspect any unauthorised use of your
          account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Tool Submissions</h2>
        <p className="text-muted-foreground leading-relaxed">
          By submitting an AI tool, you confirm that you have the right to
          submit it and that the information provided is accurate. We reserve
          the right to accept, reject, edit, or remove any submission at our
          discretion without notice. Paid submissions are non-refundable once
          reviewed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          5. Featured Ads & Paid Services
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Featured ad spots and other paid services are subject to admin
          approval. Payment does not guarantee approval. If a submission is
          rejected, you may be eligible for a refund at our discretion. We
          reserve the right to remove any approved ad if it is found to violate
          these terms after approval.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">
          All content on AI Directory — including the design, code, and
          editorial content — is owned by or licensed to us. You retain
          ownership of content you submit, but grant us a non-exclusive,
          royalty-free licence to display, distribute, and promote it on the
          platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. User-Generated Content</h2>
        <p className="text-muted-foreground leading-relaxed">
          You are solely responsible for content you post, including votes,
          comments, tool descriptions, and logos. We do not endorse
          user-generated content and are not liable for any content submitted by
          users. We reserve the right to remove any content that violates these
          terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          8. Disclaimers & Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          AI Directory is provided "as is" without warranties of any kind. We do
          not guarantee the accuracy of tool listings or reviews. To the maximum
          extent permitted by law, we shall not be liable for any indirect,
          incidental, or consequential damages arising from your use of the
          platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">9. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to suspend or terminate your account at any time
          for violation of these terms or for any other reason at our
          discretion. Upon termination, your right to use the platform ceases
          immediately.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">10. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms of Service shall be governed by and construed in
          accordance with applicable law. Any disputes arising from these terms
          shall be resolved through good-faith negotiation, and if unresolved,
          through binding arbitration.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">11. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <a
            href="mailto:legal@aidirectory.com"
            className="underline hover:text-foreground"
          >
            legal@aidirectory.com
          </a>
          .
        </p>
      </section>
      <Footer2 />
    </div>
  );
}
