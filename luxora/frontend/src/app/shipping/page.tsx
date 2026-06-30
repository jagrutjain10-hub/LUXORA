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
            <h1 style={{fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1}}>Shipping Policy</h1>
            <div style={{width:48,height:1,background:'#c9a96e',margin:'28px auto 0'}} />
          </motion.div>
        </section>
        <section style={{background:'#faf7f2'}} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <p style={{fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',letterSpacing:'0.1em',marginBottom:40}}>Last updated: June 2026</p>
              <div key="Delivery Timelines" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Delivery Timelines</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Standard delivery takes 5-7 business days within India. Express delivery (2-3 business days) is available at checkout for select pin codes.</p>
              </div>
              <div key="Free Shipping" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Free Shipping</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We offer free standard shipping on all orders above ₹2,999. Orders below this threshold attract a flat shipping fee of ₹199.</p>
              </div>
              <div key="Packaging" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Packaging</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>All LUXORA products are carefully packed in our signature luxury packaging to ensure they arrive in perfect condition. Fragile items receive additional protective wrapping.</p>
              </div>
              <div key="Order Tracking" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Order Tracking</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Once your order is dispatched, you will receive a tracking number via email. You can track your order directly through the courier partner website.</p>
              </div>
              <div key="International Shipping" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>International Shipping</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Currently, we ship within India only. International shipping will be available soon. Stay tuned for updates.</p>
              </div>
              <div key="Delays" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Delays</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>While we strive to meet all delivery timelines, delays may occur due to courier partner issues, weather conditions, or peak season volume. LUXORA is not liable for such delays.</p>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
