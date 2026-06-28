'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const SECTIONS = [
  { title: 'Acceptance of Terms', body: 'By accessing and using the LUXORA website and services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
  { title: 'Products & Pricing', body: 'All products are subject to availability. Prices are in Indian Rupees and include applicable taxes unless otherwise stated. We reserve the right to modify prices at any time.' },
  { title: 'Orders & Payment', body: 'Orders are confirmed upon successful payment. We accept UPI, credit/debit cards, and net banking via Razorpay. We reserve the right to cancel orders in case of pricing errors or stock unavailability, with a full refund.' },
  { title: 'Shipping & Delivery', body: 'We ship across India. Delivery timelines are estimates and may vary. Risk of loss passes to you upon delivery to the carrier. Please inspect your order upon receipt and contact us immediately if damaged.' },
  { title: 'Returns & Refunds', body: 'We offer returns within 15 days of delivery for items in original, unused condition. Custom or personalized items are non-returnable. Refunds are processed within 5-7 business days.' },
  { title: 'Intellectual Property', body: 'All content on this website, including images, text, and design, is the property of LUXORA and may not be reproduced without permission.' },
  { title: 'Contact', body: 'For questions about these Terms, contact us at hello@luxora.in.' },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Legal</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Terms of Service</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20">
            <div className="max-w-3xl mx-auto">
              <p className="font-body text-obsidian/50 mb-12 text-sm">Last updated: June 2026</p>
              <div className="space-y-12">
                {SECTIONS.map(({ title, body }) => (
                  <div key={title} className="pb-12 border-b border-sand-200 last:border-0">
                    <h2 className="font-display text-xl text-obsidian font-light mb-4">{title}</h2>
                    <p className="font-body text-obsidian/70 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
