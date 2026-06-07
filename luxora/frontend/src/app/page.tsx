'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Quote, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { MarqueeBar } from '@/components/home/MarqueeBar';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { cn } from '@/lib/utils';

// â”€â”€â”€ Mock data (replace with API calls) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const HERO_COLLECTIONS = [
  {
    id: 'wall-decor',
    title: 'Wall Decor',
    subtitle: 'Artisan Statements',
    href: '/products?category=wall-decor',
    image: '/images/collections/wall-decor.jpg',
  },
  {
    id: 'sculptures',
    title: 'Sculptures',
    subtitle: 'Form & Presence',
    href: '/products?category=sculptures',
    image: '/images/collections/sculptures.jpg',
  },
  {
    id: 'luxury-vases',
    title: 'Luxury Vases',
    subtitle: 'Vessels of Elegance',
    href: '/products?category=luxury-vases',
    image: '/images/collections/vases.jpg',
  },
];

const MOCK_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: `product-${i}`,
  name: ['Golden Hour Vase', 'Marble Arc Mirror', 'Onyx Sculpture', 'Woven Wall Panel',
         'Crystal Candle Holder', 'Bronze Relief Frame', 'Silk Throw Pillow', 'Obsidian Bookend'][i],
  slug: ['golden-hour-vase', 'marble-arc-mirror', 'onyx-sculpture', 'woven-wall-panel',
         'crystal-candle-holder', 'bronze-relief-frame', 'silk-throw-pillow', 'obsidian-bookend'][i],
  price: [12999, 24999, 34999, 8999, 6999, 18999, 4999, 9999][i],
  discountPrice: [9999, 19999, null, null, 5499, 14999, null, 7999][i],
  category: { name: ['Luxury Vases', 'Mirrors', 'Sculptures', 'Wall Decor',
                       'Table Decor', 'Wall Decor', 'Premium Accessories', 'Sculptures'][i] },
  images: [{ url: `/images/products/product-${i + 1}.jpg`, isPrimary: true }],
  avgRating: [4.9, 4.8, 5.0, 4.7, 4.6, 4.9, 4.5, 4.8][i],
  reviewCount: [142, 87, 203, 56, 98, 124, 41, 77][i],
  isNew: i < 3,
  stockQty: i === 3 ? 0 : 10,
}));

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Mehta',
    location: 'Mumbai',
    rating: 5,
    text: 'Every piece from LUXORA is a conversation starter. The Golden Hour Vase completely transformed my living room into something from a luxury magazine.',
    product: 'Golden Hour Vase',
    avatar: '/images/avatars/1.jpg',
  },
  {
    id: 2,
    name: 'Arjun Kapoor',
    location: 'Delhi',
    rating: 5,
    text: 'The craftsmanship is impeccable. Each item arrives in stunning packaging and feels genuinely luxurious. Worth every rupee and more.',
    product: 'Marble Arc Mirror',
    avatar: '/images/avatars/2.jpg',
  },
  {
    id: 3,
    name: 'Shreya Nair',
    location: 'Bangalore',
    rating: 5,
    text: 'I\'ve ordered four times now. The quality is unmatched â€” these are pieces you keep for generations. LUXORA has completely redefined my home aesthetic.',
    product: 'Onyx Sculpture',
    avatar: '/images/avatars/3.jpg',
  },
];

const CATEGORIES = [
  { name: 'Wall Decor', count: 48, slug: 'wall-decor', emoji: 'ðŸ–¼ï¸' },
  { name: 'Decorative Lights', count: 32, slug: 'decorative-lights', emoji: 'âœ¨' },
  { name: 'Luxury Vases', count: 61, slug: 'luxury-vases', emoji: 'ðŸº' },
  { name: 'Sculptures', count: 29, slug: 'sculptures', emoji: 'ðŸ—¿' },
  { name: 'Table Decor', count: 44, slug: 'table-decor', emoji: 'ðŸ•¯ï¸' },
  { name: 'Mirrors', count: 27, slug: 'mirrors', emoji: 'ðŸªž' },
  { name: 'Premium Accessories', count: 53, slug: 'premium-accessories', emoji: 'ðŸ’Ž' },
];

// â”€â”€â”€ HERO SECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-obsidian">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/30 to-obsidian/80 z-10" />
        <div className="absolute inset-0 bg-noise z-20 opacity-40" />
        {/* Placeholder gradient for bg image */}
        <div className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #2d1f0e 0%, #0a0a0a 60%, #111 100%)' }}
        />
      </motion.div>

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-1/4 w-px h-1/3 bg-gradient-to-b from-transparent via-champagne-500/30 to-transparent z-20" />
      <div className="absolute bottom-0 right-1/3 w-px h-1/4 bg-gradient-to-t from-transparent via-champagne-500/20 to-transparent z-20" />

      {/* Content */}
      <motion.div
        className="relative z-30 h-full flex flex-col items-center justify-center text-center section-px"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="label-gold text-champagne-400 mb-6"
        >
          Est. 2024 Â· Premium Collection
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-display-2xl text-ivory font-light leading-tight mb-6 max-w-5xl"
        >
          Where Spaces Become
          <br />
          <em className="text-champagne-400 italic not-italic font-light" style={{ fontStyle: 'italic' }}>
            Sanctuaries
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="text-ivory/60 text-lg font-body font-light max-w-xl mx-auto mb-12 tracking-wide"
        >
          Curated luxury dÃ©cor for the discerning eye. Each piece is an heirloom in the making.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/products" className="btn-ghost">
            Explore Collection
          </Link>
          <Link href="/products?featured=true" className="btn-primary">
            Shop Curated Picks
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center gap-16"
        >
          {[['2,400+', 'Products'], ['48K+', 'Happy Clients'], ['100%', 'Authentic']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl text-champagne-400 font-light">{val}</div>
              <div className="label-gold text-ivory/40 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-10 z-30 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="label-gold text-ivory/40 vertical-text" style={{ writingMode: 'vertical-rl', fontSize: '10px', letterSpacing: '0.2em' }}>
          SCROLL
        </div>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-champagne-500/50 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

// â”€â”€â”€ MARQUEE BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LuxuryMarquee() {
  const items = ['Free Shipping Over â‚¹2,999', 'Artisan Crafted', 'Premium Packaging', 'Hassle-Free Returns', 'Authenticity Guaranteed', 'Curated Luxury'];
  const doubled = [...items, ...items];

  return (
    <div className="bg-obsidian py-4 overflow-hidden border-y border-champagne-800/30">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-8 label-gold text-champagne-400 text-label-xs">
            {item}
            <span className="text-champagne-700">âœ¦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CategoriesSection() {
  return (
    <AnimatedSection className="section-py bg-ivory-100">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="label-gold mb-4">Browse By Category</div>
          <h2 className="font-display text-display-md text-obsidian font-light">
            Curated Collections
          </h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white border border-sand-200 
                           hover:border-champagne-500 hover:bg-champagne-50 transition-all duration-400 text-center"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <div className="font-body text-xs font-medium text-obsidian uppercase tracking-wider mb-1 group-hover:text-champagne-700 transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-obsidian/40 text-xs font-mono">{cat.count} pieces</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ FEATURED COLLECTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedCollections() {
  return (
    <AnimatedSection className="section-py bg-obsidian">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="label-gold text-champagne-400 mb-4">Signature Collections</div>
          <h2 className="font-display text-display-md text-ivory font-light">
            Designed for the Exceptional
          </h2>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-1">
          {HERO_COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group relative overflow-hidden aspect-[3/4] bg-obsidian-700 cursor-pointer"
            >
              {/* Image placeholder */}
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-luxury group-hover:scale-105"
                style={{
                  background: [
                    'radial-gradient(ellipse at 50% 80%, #3d2a0e 0%, #1a0e05 100%)',
                    'radial-gradient(ellipse at 50% 20%, #1a1a2e 0%, #0d0d1a 100%)',
                    'radial-gradient(ellipse at 30% 60%, #0e2a1a 0%, #051209 100%)',
                  ][i]
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent z-10" />

              <Link href={col.href} className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                <div className="label-gold text-champagne-400 mb-2">{col.subtitle}</div>
                <h3 className="font-display text-3xl text-ivory font-light mb-4">{col.title}</h3>
                <div className="flex items-center gap-3 text-champagne-400 text-label-sm uppercase tracking-widest font-body
                                translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>

              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-px bg-champagne-500/40 z-20" />
              <div className="absolute top-0 right-0 w-px h-16 bg-champagne-500/40 z-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ BEST SELLERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function BestSellers() {
  return (
    <AnimatedSection className="section-py bg-white">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <div className="label-gold mb-4">Community Favourites</div>
            <h2 className="font-display text-display-md text-obsidian font-light">Best Sellers</h2>
          </div>
          <Link href="/products?bestSeller=true" className="btn-secondary self-start md:self-auto">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {MOCK_PRODUCTS.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <ProductCard product={product as any} />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ WHY LUXORA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WHY_FEATURES = [
  {
    icon: 'â—ˆ',
    title: 'Artisan Crafted',
    desc: 'Every piece is handcrafted by skilled artisans using premium materials sourced from around the world.',
  },
  {
    icon: 'â—‡',
    title: 'Curated Excellence',
    desc: 'Our team of luxury interior experts carefully selects each product to ensure it meets our exacting standards.',
  },
  {
    icon: 'â—†',
    title: 'Premium Delivery',
    desc: 'White-glove packaging and careful logistics ensure your luxury pieces arrive in pristine condition.',
  },
  {
    icon: 'â—‹',
    title: 'Lifetime Authenticity',
    desc: 'Each piece comes with a certificate of authenticity and our commitment to genuine luxury craftsmanship.',
  },
];

function WhyLuxora() {
  return (
    <AnimatedSection className="section-py relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f0e8 0%, #ede4d5 100%)' }}>
      <div className="absolute inset-0 bg-noise opacity-50" />

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-champagne-300/20" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-champagne-300/20" />

      <div className="container-luxury relative">
        <div className="text-center mb-20">
          <div className="label-gold mb-4">The LUXORA Promise</div>
          <h2 className="font-display text-display-md text-obsidian font-light">
            Why Choose LUXORA
          </h2>
          <div className="divider-gold" />
          <p className="text-obsidian/60 max-w-xl mx-auto font-body">
            More than dÃ©cor â€” we deliver experiences that transform spaces into personal sanctuaries of refined living.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group text-center p-8 bg-white/60 backdrop-blur-sm border border-white/80
                         hover:bg-white hover:shadow-luxury transition-all duration-600 ease-luxury"
            >
              <div className="text-4xl text-champagne-500 mb-6 font-display transition-transform duration-400 group-hover:scale-110 inline-block">
                {feat.icon}
              </div>
              <h3 className="font-display text-xl text-obsidian mb-4 font-medium">{feat.title}</h3>
              <p className="text-obsidian/60 text-sm leading-relaxed font-body">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Testimonials() {
  return (
    <AnimatedSection className="section-py bg-obsidian">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="label-gold text-champagne-400 mb-4">Social Proof</div>
          <h2 className="font-display text-display-md text-ivory font-light">
            What Our Clients Say
          </h2>
          <div className="w-12 h-px bg-champagne-500 mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-obsidian-800 border border-champagne-900/40 p-8 relative group
                         hover:border-champagne-600/40 transition-all duration-400"
            >
              <Quote size={24} className="text-champagne-700 mb-6" />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-champagne-500 fill-champagne-500" />
                ))}
              </div>

              <p className="text-ivory/70 text-sm leading-relaxed mb-8 font-body italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-champagne-800 flex items-center justify-center
                                text-champagne-300 font-display text-lg font-light">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-ivory text-sm font-body font-medium">{t.name}</div>
                  <div className="text-ivory/40 text-xs font-mono">{t.location} Â· {t.product}</div>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-8 h-px bg-champagne-600/30" />
              <div className="absolute bottom-0 right-0 w-px h-8 bg-champagne-600/30" />
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          {[['4.9/5', 'Average Rating'], ['48,000+', 'Happy Clients'], ['99.2%', 'Satisfaction Rate']].map(([val, label]) => (
            <div key={label}>
              <div className="font-display text-3xl text-champagne-400 font-light mb-2">{val}</div>
              <div className="label-gold text-ivory/40 text-label-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ INSPIRATION GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function InspirationGallery() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    style: [
      { gridColumn: 'span 2', gridRow: 'span 2' },
      {}, {}, {}, { gridColumn: 'span 2' }, {},
    ][i],
    bg: [
      'radial-gradient(ellipse at 40% 60%, #3d2a0e 0%, #1a0a02 100%)',
      'radial-gradient(ellipse at 70% 30%, #0e1a2e 0%, #050d1a 100%)',
      'radial-gradient(ellipse at 50% 80%, #1a0e2e 0%, #0a0514 100%)',
      'radial-gradient(ellipse at 20% 50%, #0e2e1a 0%, #051209 100%)',
      'radial-gradient(ellipse at 80% 70%, #2e1a0e 0%, #120802 100%)',
      'radial-gradient(ellipse at 50% 20%, #1a1a0e 0%, #0d0d05 100%)',
    ][i],
  }));

  return (
    <AnimatedSection className="section-py bg-ivory-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="label-gold mb-4">@luxora.in</div>
          <h2 className="font-display text-display-md text-obsidian font-light">
            Spaces We've Transformed
          </h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[600px]">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden cursor-pointer"
              style={item.style as any}
              whileHover={{ scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full" style={{ background: item.bg }} />
              <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                <div className="label-gold text-ivory text-center">
                  <div className="text-2xl mb-2">@luxora.in</div>
                  <div className="text-label-xs">Shop This Look</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// â”€â”€â”€ PAGE EXPORT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LuxuryMarquee />
        <CategoriesSection />
        <FeaturedCollections />
        <BestSellers />
        <WhyLuxora />
        <Testimonials />
        <InspirationGallery />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

