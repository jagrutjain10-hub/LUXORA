export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="font-display text-4xl text-obsidian font-light mb-2">Terms of Service</h1>
        <p className="text-xs text-obsidian/40 font-body mb-10">Last updated: June 2026</p>
        <div className="space-y-8 font-body text-obsidian/70 leading-relaxed text-sm">
          {[
            ['1. Acceptance of Terms', 'By accessing or using LUXORA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'],
            ['2. Products & Descriptions', 'We strive to accurately describe all products. Colours may vary slightly due to monitor calibration. All prices are in Indian Rupees and include applicable taxes unless stated otherwise.'],
            ['3. Orders & Payment', 'All orders are subject to availability and confirmation. We reserve the right to cancel orders in cases of pricing errors or stock unavailability. Payments are processed securely via Razorpay.'],
            ['4. Shipping & Delivery', 'Delivery timelines are estimates only. LUXORA is not responsible for delays caused by courier partners or customs for international orders.'],
            ['5. Returns & Refunds', 'We accept returns within 7 days of delivery for items in original, unused condition. Customised or personalised products are non-returnable. Refunds are processed within 7-10 business days.'],
            ['6. Intellectual Property', 'All content on LUXORA including images, text, and branding is the exclusive property of LUXORA and may not be reproduced without written consent.'],
            ['7. Contact', 'For questions regarding these terms, contact us at hello@luxora.in.'],
          ].map(([title, body]) => (
            <div key={title}>
              <h2 className="font-display text-lg text-obsidian mb-2">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}