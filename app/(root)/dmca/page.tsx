import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: "AI Directory DMCA policy — how to report copyright infringement and file counter-notices.",
};

export default function DMCAPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-sm text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">DMCA Policy</h1>
        <p className="text-muted-foreground">Last updated: June 8, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          AI Directory respects the intellectual property rights of others and expects users of the platform to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to claims of copyright infringement committed using our platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Reporting Infringement</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you believe that content on AI Directory infringes your copyright, please send a written notice to our designated DMCA agent containing:
        </p>
        <ul className="text-muted-foreground leading-relaxed list-disc list-inside space-y-2">
          <li>Your name, address, phone number, and email address.</li>
          <li>A description of the copyrighted work you claim has been infringed.</li>
          <li>The URL or other specific location on AI Directory where the allegedly infringing content is located.</li>
          <li>A statement that you have a good-faith belief that the use of the material is not authorised by the copyright owner, its agent, or the law.</li>
          <li>A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or are authorised to act on the copyright owner&apos;s behalf.</li>
          <li>Your electronic or physical signature.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Counter-Notice</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you believe that content you submitted was removed by mistake or misidentification, you may file a counter-notice. The counter-notice must include: your name, address, phone number, and email; identification of the removed content and its location before removal; a statement under penalty of perjury that you have a good-faith belief the content was removed by mistake; and your consent to jurisdiction of the applicable federal court.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">4. Repeat Infringers</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to disable and/or terminate the accounts of users who are repeat infringers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          To submit a DMCA notice or counter-notice, please use our{" "}
          <a href="/contact" className="underline hover:text-foreground">Contact page</a>.
        </p>
      </section>
    </div>
  );
}
