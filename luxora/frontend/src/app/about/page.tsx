'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.8 }}>
            <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Our Story</p>
            <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>About LUXORA</h1>
            <div style={{ width:48,height:1,background:'#c9a96e',margin:'28px auto 0' }} />
          </motion.div>
        </section>
        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6" style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.75)',lineHeight:1.9,fontSize:16 }}>
              <p>LUXORA was founded with a singular vision: to bring museum-quality decorative art into the homes of those who appreciate beauty, craftsmanship, and the subtle power of a well-curated space.</p>
              <p>Every piece in our collection is sourced directly from artisans and ateliers across India and beyond — chosen not just for aesthetic appeal, but for the story it carries and the emotion it evokes.</p>
              <p>We believe that a home is more than architecture. It is a reflection of the people who inhabit it. Our mission is to give you the pieces that make your space unmistakably, irreplaceably yours.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-16 pt-12" style={{ borderTop:'1px solid #e8dfd0' }}>
              {[['2,400+','Curated Products'],['48K+','Happy Clients'],['100%','Authentic']].map(([v,l]) => (
                <div key={l} className="text-center">
                  <div style={{ fontFamily:'var(--font-cormorant)',fontSize:'clamp(1.8rem,4vw,2.5rem)',fontWeight:300,color:'#c9a96e' }}>{v}</div>
                  <div className="label-gold mt-2" style={{ color:'rgba(10,10,10,0.4)' }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mt-14">
              {[['Artisan Crafted','Every piece is handcrafted by skilled artisans using premium materials sourced globally.'],['Curated Excellence','Our team carefully selects each product to meet our exacting standards.'],['Premium Delivery','White-glove packaging ensures your pieces arrive in pristine condition.'],['Lifetime Authenticity','Each piece comes with our commitment to genuine luxury craftsmanship.']].map(([t,d]) => (
                <div key={t} style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'28px 24px' }}>
                  <div style={{ width:24,height:1,background:'#c9a96e',marginBottom:16 }} />
                  <h3 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:20,color:'#0a0a0a',marginBottom:10 }}>{t}</h3>
                  <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.6)',lineHeight:1.7 }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/products" className="btn-primary">Explore the Collection</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
