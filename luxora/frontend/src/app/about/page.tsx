'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-champagne-600 font-body mb-4">Our Story</p>
          <h1 className="font-display text-5xl text-obsidian font-light mb-6">About LUXORA</h1>
          <div className="w-16 h-px bg-champagne-400 mx-auto" />
        </div>
        <div className="space-y-6 font-body text-obsidian/70 leading-relaxed text-base">
          <p>LUXORA was founded with a singular vision: to bring museum-quality decorative art into the homes of those who appreciate beauty, craftsmanship, and the subtle power of a well-curated space.</p>
          <p>Every piece in our collection is sourced directly from artisans and ateliers across India and beyond — chosen not just for aesthetic appeal, but for the story it carries and the emotion it evokes.</p>
          <p>We believe that a home is more than architecture. It is a reflection of the people who inhabit it. Our mission is to give you the pieces that make your space unmistakably, irreplaceably yours.</p>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 text-center border-t border-sand-200 pt-12">
          {[['2,400+', 'Curated Products'], ['48K+', 'Happy Clients'], ['100%', 'Authentic Pieces']].map(([val, label]) => (
            <div key={label}>
              <div className="font-display text-3xl text-champagne-600 font-light mb-2">{val}</div>
              <div className="text-xs uppercase tracking-widest text-obsidian/50 font-body">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/products" className="inline-block bg-obsidian text-ivory px-10 py-4 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors">
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}