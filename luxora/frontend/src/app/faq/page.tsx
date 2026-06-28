'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express delivery is available in 2–3 days for select pin codes. White glove delivery can be scheduled for luxury pieces.' },
  { q: 'Can I return a product?', a: 'Yes, we accept returns within 15 days of delivery. Items must be unused and in original packaging. Contact hello@luxora.in with your order number to initiate a return.' },
  { q: 'Are your products authentic?', a: 'Every LUXORA piece comes with a certificate of authenticity. We work directly with verified artisans, manufacturers, and curated luxury brands.' },
  { q: 'How do I track my order?', a: 'Once shipped, you will receive a tracking number via email. You can also track your order in your dashboard under "My Orders".' },
  { q: 'Do you offer gift wrapping?', a: 'All LUXORA orders come in premium packaging. For special gift presentation, contact us at hello@luxora.in before placing your order.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards, and net banking via Razorpay. All transactions are secured with industry-standard encryption.' },
  { q: 'Can I customize a product?', a: 'Some products can be customized. Please contact hello@luxora.in with your requirements and we will advise on possibilities and timelines.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Help Centre</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Frequently Asked Questions</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20 max-w-3xl mx-auto">
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-sand-200">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-body font-medium text-obsidian">{faq.q}</span>
                    <ChevronDown size={18} className={cn('text-champagne-500 flex-shrink-0 transition-transform duration-200 ml-4', open === i && 'rotate-180')} />
                  </button>
                  {open === i && (
                    <div className="px-6 pb-6">
                      <div className="h-px bg-sand-200 mb-4" />
                      <p className="font-body text-obsidian/70 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
