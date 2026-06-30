'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            <p className="label-gold mb-4" style={{color:'#c9a96e'}}>Policy</p>
            <h1 style={{fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1}}>Returns & Refunds</h1>
            <div style={{width:48,height:1,background:'#c9a96e',margin:'28px auto 0'}} />
          </motion.div>
        </section>
        <section style={{background:'#faf7f2'}} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <p style={{fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',letterSpacing:'0.1em',marginBottom:40}}>Last updated: June 2026</p>
              <div key="Return Eligibility" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Return Eligibility</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Items may be returned within 7 days of delivery if they are in original, unused, and undamaged condition with all original packaging and tags intact.</p>
              </div>
              <div key="Non-Returnable Items" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Non-Returnable Items</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Customised, personalised, or made-to-order items cannot be returned. Items marked as final sale are also non-returnable.</p>
              </div>
              <div key="Return Process" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Return Process</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>To initiate a return, email hello@luxora.in with your order number and reason for return. Our team will provide a return shipping label within 2 business days.</p>
              </div>
              <div key="Refund Timeline" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Refund Timeline</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Once we receive and inspect the returned item, refunds are processed within 7-10 business days to your original payment method.</p>
              </div>
              <div key="Damaged or Defective Items" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Damaged or Defective Items</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>If you receive a damaged or defective item, please contact us within 48 hours of delivery with photographs. We will arrange a replacement or full refund at no cost to you.</p>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
