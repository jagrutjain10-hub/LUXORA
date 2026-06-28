'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen">
        <div className="bg-obsidian py-24 section-px text-center">
          <div className="label-gold text-champagne-400 mb-4">Our Story</div>
          <h1 className="font-display text-display-lg text-ivory font-light">About LUXORA</h1>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>
        <div className="bg-ivory-50">
          <div className="container-luxury py-20">
            <div className="max-w-3xl mx-auto">
              <div className="label-gold mb-4">Where Luxury Meets Home</div>
              <h2 className="font-display text-display-sm text-obsidian font-light mb-8">
                Redefining the Art of Living
              </h2>
              <div className="space-y-6 font-body text-obsidian/70 leading-relaxed">
                <p>LUXORA was founded with a singular vision — to bring the world&apos;s most exceptional decorative pieces into homes across India. We believe that the spaces we inhabit shape who we are, and that every home deserves to be filled with beauty, craftsmanship, and meaning.</p>
                <p>Each piece in our collection is hand-selected by our team of luxury interior experts. We work directly with master artisans, heritage workshops, and contemporary designers to bring you objects that are not merely decorative — they are heirlooms in the making.</p>
                <p>From sculptural vases that command attention to subtle table accents that complete a room, every LUXORA piece tells a story of exceptional craft and timeless elegance.</p>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-sand-200 text-center">
                {[['2,400+', 'Products'], ['48K+', 'Happy Clients'], ['100%', 'Authentic']].map(([val, label]) => (
                  <div key={label}>
                    <div className="font-display text-3xl text-champagne-500 font-light mb-2">{val}</div>
                    <div className="label-gold text-obsidian/40">{label}</div>
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
