'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function RefundsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Customer Care</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Refund Policy</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20 max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                { title: '15-Day Returns', body: 'We offer hassle-free returns within 15 days of delivery. Items must be in their original, unused condition and packaging.' },
                { title: 'How to Return', body: 'Contact us at hello@luxora.in with your order number and reason for return. Our team will arrange a pickup within 2-3 business days.' },
                { title: 'Refund Timeline', body: 'Refunds are processed within 5-7 business days of receiving the returned item. The amount will be credited to your original payment method.' },
                { title: 'Non-Returnable Items', body: 'Custom or personalized items, items damaged due to misuse, and items without original packaging cannot be returned.' },
              ].map(({ title, body }) => (
                <div key={title} className="p-8 bg-white border border-sand-200">
                  <h2 className="font-display text-xl text-obsidian font-light mb-3">{title}</h2>
                  <p className="font-body text-obsidian/70 leading-relaxed">{body}</p>
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
