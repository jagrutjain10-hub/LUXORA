'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const SECTIONS = [
  { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as your name, email address, phone number, and delivery address when you create an account or place an order. Payment information is processed securely by Razorpay and is never stored on our servers.' },
  { title: 'How We Use Your Information', body: 'We use the information we collect to process your orders, send order confirmations and shipping updates, respond to your comments and questions, and send you marketing communications (with your consent).' },
  { title: 'Information Sharing', body: 'We do not sell, trade, or otherwise transfer your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to strict confidentiality agreements.' },
  { title: 'Data Security', body: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
  { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at hello@luxora.in.' },
  { title: 'Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at hello@luxora.in or at our Mumbai office.' },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Legal</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Privacy Policy</h1>
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
