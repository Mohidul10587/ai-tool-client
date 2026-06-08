export default function FAQPage() {
  const faqs = [
    {
      q: "What is AI Directory?",
      a: "AI Directory is the largest curated collection of AI tools. We help individuals and businesses discover, compare, and choose the best AI solutions for their needs.",
    },
    {
      q: "How do I submit an AI tool?",
      a: "Create a free account, go to your Dashboard, and click \"Submit Tool\". Fill in the details about the tool and submit it for review. Approved tools appear in the directory.",
    },
    {
      q: "Is there a cost to submit a tool?",
      a: "Basic submissions are free. We also offer paid featured placements for higher visibility. Check our Pricing page for current rates.",
    },
    {
      q: "How long does tool review take?",
      a: "Most submissions are reviewed within 2–5 business days. You will receive an email notification once your tool is approved or if we need more information.",
    },
    {
      q: "Can I edit my submitted tool?",
      a: "Yes. Go to your Dashboard → Tool Submissions, find your tool, and click Edit. Changes are reviewed before going live.",
    },
    {
      q: "What is a Featured Ad?",
      a: "Featured Ads are premium placements that display your tool prominently in the sidebar and on category pages. They drive significantly more visibility than standard listings.",
    },
    {
      q: "How do I report incorrect information?",
      a: "Use the Contact page to reach our team. Include the tool name and the information that needs correcting and we will update it promptly.",
    },
    {
      q: "Do you have an API?",
      a: "We are currently working on a public API for developers. Sign up for our newsletter to be notified when it launches.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about AI Directory.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((item, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-0">
            <h2 className="text-base font-semibold mb-2">{item.q}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Still have questions?{" "}
        <a href="/contact" className="underline hover:text-foreground">
          Contact us
        </a>
        .
      </p>
    </div>
  );
}
