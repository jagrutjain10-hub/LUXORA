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
            <h1 style={{fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1}}>Cookie Policy</h1>
            <div style={{width:48,height:1,background:'#c9a96e',margin:'28px auto 0'}} />
          </motion.div>
        </section>
        <section style={{background:'#faf7f2'}} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <p style={{fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',letterSpacing:'0.1em',marginBottom:40}}>Last updated: June 2026</p>
              <div key="What Are Cookies" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>What Are Cookies</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>Cookies are small text files placed on your device when you visit our website. They help us remember your preferences and improve your browsing experience.</p>
              </div>
              <div key="Types of Cookies We Use" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Types of Cookies We Use</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We use essential cookies for site functionality, analytical cookies to understand usage patterns, and preference cookies to remember your settings.</p>
              </div>
              <div key="Managing Cookies" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Managing Cookies</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>You can control cookies through your browser settings. Disabling essential cookies may affect site functionality. Third-party cookies can be managed through the respective provider settings.</p>
              </div>
              <div key="Updates to This Policy" style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:10 }}>Updates to This Policy</h2>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:15,color:'rgba(10,10,10,0.7)',lineHeight:1.85 }}>We may update this Cookie Policy from time to time. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
