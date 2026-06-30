'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q:'How do I place an order?', a:'Browse our collection, add items to your cart, and proceed to checkout. You can pay securely via UPI or other payment methods.' },
  { q:'What is your return policy?', a:'We accept returns within 7 days of delivery for items in original, unused condition. Contact hello@luxora.in to initiate a return.' },
  { q:'Do you offer free shipping?', a:'Yes! All orders above ₹2,999 qualify for free standard shipping across India. Orders below this attract a flat ₹199 shipping fee.' },
  { q:'How long does delivery take?', a:'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for select pin codes at checkout.' },
  { q:'Are your products authentic?', a:'Absolutely. Every LUXORA product is sourced directly from verified artisans and manufacturers. We guarantee 100% authenticity.' },
  { q:'Can I track my order?', a:'Yes. Once dispatched, you will receive a tracking number via email to monitor your order status in real time.' },
  { q:'Do you ship internationally?', a:'Currently we ship within India only. International shipping is coming soon — subscribe to our newsletter for updates.' },
  { q:'How do I contact customer support?', a:'Email us at hello@luxora.in or call +91 98765 43210. We respond within 24 hours on business days.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8 }}>
            <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Support</p>
            <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>Frequently Asked Questions</h1>
            <div style={{ width:48,height:1,background:'#c9a96e',margin:'28px auto 0' }} />
          </motion.div>
        </section>
        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq,i) => (
              <div key={i} style={{ background:'#fff',border:'1px solid #e8dfd0' }}>
                <button className="w-full flex items-center justify-between p-5 text-left gap-4" onClick={() => setOpen(open===i?null:i)}>
                  <span style={{ fontFamily:'var(--font-jost)',fontSize:15,fontWeight:500,color:'#0a0a0a' }}>{faq.q}</span>
                  <ChevronDown size={16} style={{ color:'#c9a96e',flexShrink:0,transform:open===i?'rotate(180deg)':'none',transition:'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {open===i && (
                    <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }} style={{ overflow:'hidden' }}>
                      <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.65)',lineHeight:1.8,padding:'0 20px 20px' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
