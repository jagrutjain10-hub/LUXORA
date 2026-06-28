'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Truck } from 'lucide-react';

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Customer Care</div>
          <h1 className="font-display text-display-lg text-ivory font-light">Shipping Policy</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20 max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                ['Standard Delivery', '5–7 business days', 'Free on orders above ₹2,999. ₹199 for orders below.'],
                ['Express Delivery', '2–3 business days', '₹499. Available for select pin codes.'],
                ['White Glove Delivery', 'Scheduled', '₹999. Luxury packaging + room placement assistance.'],
              ].map(([type, time, detail]) => (
                <div key={type} className="flex gap-6 p-8 bg-white border border-sand-200">
                  <div className="w-12 h-12 bg-obsidian flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-champagne-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-obsidian font-light mb-1">{type}</h2>
                    <div className="label-gold text-champagne-600 mb-2">{time}</div>
                    <p className="font-body text-obsidian/60 text-sm">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 bg-obsidian text-center">
              <p className="font-body text-ivory/70 text-sm">All orders are carefully packaged to ensure safe delivery of your luxury pieces. We ship Pan-India.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
