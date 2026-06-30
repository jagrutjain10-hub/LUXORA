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
            <p className="label-gold mb-4" style={{color:'#c9a96e'}}>Legal</p>
            <h1 style={{fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1}}>Terms of Service</h1>
            <div style={{width:48,height:1,background:'#c9a96e',margin:'28px auto 0'}} />
          </motion.div>
        </section>
        <section style={{background:'#faf7f2'}} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <p style={{fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',letterSpacing:'0.1em',marginBottom:40}}>Last updated: June 2026</p>
              <div key="Acceptance of Terms" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Acceptance of Terms</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>By accessing or using LUXORA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
              </div>
              <div key="Products & Descriptions" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Products & Descriptions</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We strive to accurately describe all products. Colours may vary slightly due to monitor calibration. All prices are in Indian Rupees and include applicable taxes unless stated otherwise.</p>
              </div>
              <div key="Orders & Payment" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Orders & Payment</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>All orders are subject to availability and confirmation. We reserve the right to cancel orders in cases of pricing errors or stock unavailability.</p>
              </div>
              <div key="Shipping & Delivery" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Shipping & Delivery</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Delivery timelines are estimates only. LUXORA is not responsible for delays caused by courier partners or customs for international orders.</p>
              </div>
              <div key="Returns & Refunds" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Returns & Refunds</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We accept returns within 7 days of delivery for items in original, unused condition. Customised products are non-returnable. Refunds are processed within 7-10 business days.</p>
              </div>
              <div key="Intellectual Property" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Intellectual Property</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>All content on LUXORA including images, text, and branding is the exclusive property of LUXORA and may not be reproduced without written consent.</p>
              </div>
              <div key="Contact" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Contact</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>For questions regarding these terms, contact us at hello@luxora.in.</p>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
