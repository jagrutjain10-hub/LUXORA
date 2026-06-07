// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { label: 'Above ₹30,000', min: 30000, max: 999999 },
];

const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Wall Decor', slug: 'wall-decor' },
  { name: 'Decorative Lights', slug: 'decorative-lights' },
  { name: 'Luxury Vases', slug: 'luxury-vases' },
  { name: 'Sculptures', slug: 'sculptures' },
  { name: 'Table Decor', slug: 'table-decor' },
  { name: 'Mirrors', slug: 'mirrors' },
  { name: 'Premium Accessories', slug: 'premium-accessories' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [page, setPage] = useState(1);

  const params = {
    category: searchParams.get('category') ?? '',
    search: searchParams.get('search') ?? '',
    sort: searchParams.get('sort') ?? 'createdAt',
    order: searchParams.get('order') ?? 'desc',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    featured: searchParams.get('featured') ?? '',
    bestSeller: searchParams.get('bestSeller') ?? '',
    page,
  };

  const { data, isLoading } = useProducts(params);

  const updateParam = useCallback((key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    sp.delete('page');
    setPage(1);
    router.push(`/products?${sp.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const activeFiltersCount = [
    params.category, params.minPrice, params.maxPrice, params.featured, params.bestSeller
  ].filter(Boolean).length;

  const pageTitle = params.search
    ? `Search: "${params.search}"`
    : params.category
    ? CATEGORIES.find(c => c.slug === params.category)?.name ?? 'Products'
    : params.featured === 'true' ? 'Featured Collection'
    : params.bestSeller === 'true' ? 'Best Sellers'
    : 'All Collections';

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)] min-h-screen bg-ivory-50">

        {/* Page Header */}
        <div className="bg-obsidian py-16 section-px">
          <div className="max-w-8xl mx-auto text-center">
            <div className="label-gold text-champagne-400 mb-3">LUXORA</div>
            <h1 className="font-display text-display-lg text-ivory font-light">{pageTitle}</h1>
            {data && (
              <p className="text-ivory/40 mt-3 font-body text-sm">
                {data.pagination.total.toLocaleString()} pieces
              </p>
            )}
          </div>
        </div>

        <div className="container-luxury py-12">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-sand-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 border text-sm font-body tracking-wide transition-all duration-300',
                  filtersOpen || activeFiltersCount > 0
                    ? 'bg-obsidian text-ivory border-obsidian'
                    : 'border-obsidian/20 text-obsidian hover:border-obsidian'
                )}
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-champagne-500 text-obsidian text-xs rounded-full flex items-center justify-center font-medium">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Active filter pills */}
              <AnimatePresence>
                {params.category && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => updateParam('category', '')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-champagne-50 border border-champagne-300 text-champagne-800 text-xs font-body"
                  >
                    {CATEGORIES.find(c => c.slug === params.category)?.name}
                    <X size={11} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={`${params.sort}-${params.order}`}
                  onChange={(e) => {
                    const [s, o] = e.target.value.split('-');
                    updateParam('sort', s);
                    updateParam('order', o);
                  }}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-obsidian/15 bg-white text-sm font-body
                             text-obsidian focus:outline-none focus:border-champagne-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian/40 pointer-events-none" />
              </div>

              {/* Grid toggle */}
              <div className="hidden md:flex items-center border border-obsidian/15">
                {([3, 4] as const).map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={cn(
                      'p-2.5 transition-colors',
                      gridCols === cols ? 'bg-obsidian text-ivory' : 'text-obsidian/40 hover:text-obsidian'
                    )}
                    aria-label={`${cols} columns`}
                  >
                    {cols === 4 ? <Grid3X3 size={15} /> : <LayoutList size={15} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.aside
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 260 }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0 overflow-hidden"
                  style={{ minWidth: 260 }}
                >
                  <div className="pr-8">
                    <h2 className="font-body text-xs uppercase tracking-widest text-obsidian/60 mb-6 font-medium">
                      Refine Results
                    </h2>

                    {/* Category */}
                    <FilterSection title="Category">
                      {CATEGORIES.map(cat => (
                        <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group py-1.5">
                          <input
                            type="radio"
                            name="category"
                            checked={params.category === cat.slug}
                            onChange={() => updateParam('category', cat.slug)}
                            className="accent-champagne-500"
                          />
                          <span className={cn(
                            'text-sm font-body transition-colors',
                            params.category === cat.slug ? 'text-obsidian font-medium' : 'text-obsidian/60 group-hover:text-obsidian'
                          )}>
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </FilterSection>

                    {/* Price Range */}
                    <FilterSection title="Price Range">
                      {PRICE_RANGES.map(range => (
                        <label key={range.label} className="flex items-center gap-3 cursor-pointer group py-1.5">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={params.minPrice === String(range.min) && params.maxPrice === String(range.max)}
                            onChange={() => {
                              updateParam('minPrice', String(range.min));
                              updateParam('maxPrice', String(range.max));
                            }}
                            className="accent-champagne-500"
                          />
                          <span className="text-sm font-body text-obsidian/60 group-hover:text-obsidian transition-colors">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </FilterSection>

                    {/* Special */}
                    <FilterSection title="Collection">
                      {[
                        { label: 'Featured', key: 'featured', value: 'true' },
                        { label: 'Best Sellers', key: 'bestSeller', value: 'true' },
                      ].map(({ label, key, value }) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group py-1.5">
                          <input
                            type="checkbox"
                            checked={(searchParams.get(key) ?? '') === value}
                            onChange={(e) => updateParam(key, e.target.checked ? value : '')}
                            className="accent-champagne-500"
                          />
                          <span className="text-sm font-body text-obsidian/60 group-hover:text-obsidian transition-colors">{label}</span>
                        </label>
                      ))}
                    </FilterSection>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => router.push('/products')}
                        className="mt-4 text-xs text-champagne-700 font-body uppercase tracking-widest hover:text-obsidian transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className={cn(
                  'grid gap-5',
                  gridCols === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
                )}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : data?.products.length === 0 ? (
                <div className="text-center py-32">
                  <div className="font-display text-6xl text-sand-300 mb-6">◇</div>
                  <h3 className="font-display text-2xl text-obsidian font-light mb-3">No products found</h3>
                  <p className="text-obsidian/50 font-body mb-8">Try adjusting your filters or search terms.</p>
                  <button onClick={() => router.push('/products')} className="btn-secondary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={cn(
                    'grid gap-5',
                    gridCols === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
                  )}>
                    {data?.products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.4) }}
                      >
                        <ProductCard product={product as any} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {data && data.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                      {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            'w-10 h-10 text-sm font-body transition-all duration-200',
                            page === p
                              ? 'bg-obsidian text-ivory'
                              : 'border border-obsidian/15 text-obsidian/60 hover:border-obsidian hover:text-obsidian'
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-7 pb-7 border-b border-sand-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <span className="text-xs font-body uppercase tracking-widest text-obsidian font-medium">{title}</span>
        <ChevronDown size={14} className={cn('text-obsidian/40 transition-transform duration-200', !open && '-rotate-90')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
