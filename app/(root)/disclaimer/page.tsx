export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-sm text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Disclaimer</h1>
        <p className="text-muted-foreground">Last updated: June 8, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. General Information Only</h2>
        <p className="text-muted-foreground leading-relaxed">
          The information provided on AI Directory is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. No Professional Advice</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nothing on AI Directory constitutes professional, technical, financial, legal, or other advice. You should consult a qualified professional before making decisions based on information found on this platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Third-Party Content</h2>
        <p className="text-muted-foreground leading-relaxed">
          AI Directory lists tools, products, and services submitted by third parties. We do not endorse, sponsor, or take responsibility for any third-party tools, websites, or content accessible via links on our platform. Use of any linked website is at your own risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Affiliate Disclaimer</h2>
        <p className="text-muted-foreground leading-relaxed">
          Some links on AI Directory may be affiliate links. This means we may earn a commission if you click through and make a purchase, at no additional cost to you. We only feature tools we believe may be valuable to our users.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Errors and Omissions</h2>
        <p className="text-muted-foreground leading-relaxed">
          While we strive to keep all information up to date, tool listings, pricing, and features may change without notice. AI Directory is not responsible for any errors, omissions, or outdated information in tool listings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          Under no circumstances shall AI Directory or its operators be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of, or inability to use, the platform or any content on it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have questions about this disclaimer, please visit our{" "}
          <a href="/contact" className="underline hover:text-foreground">Contact page</a>.
        </p>
      </section>
    </div>
  );
}
