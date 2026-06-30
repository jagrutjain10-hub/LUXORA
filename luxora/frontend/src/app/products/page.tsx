'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data ?? [])).catch(()=>{});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (searchParams.get('featured')) params.set('featured', 'true');
    if (searchParams.get('bestSeller')) params.set('bestSeller', 'true');
    params.set('limit', '50');

    api.get(`/products?${params}`)
      .then(r => setProducts(r.data.data?.products ?? []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [search, category, searchParams]);

  const sortedProducts = [...products].sort((a,b) => {
    if (sort === 'price-asc') return Number(a.discountPrice??a.price) - Number(b.discountPrice??b.price);
    if (sort === 'price-desc') return Number(b.discountPrice??b.price) - Number(a.discountPrice??a.price);
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-16 sm:py-24 text-center section-px">
          <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Full Collection</p>
          <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>
            {category ? categories.find(c=>c.slug===category)?.name ?? 'Products' : 'Our Collection'}
          </h1>
          <div style={{ width:48,height:1,background:'#c9a96e',margin:'24px auto 0' }} />
        </section>

        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="container-luxury">
            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div style={{ position:'relative',flex:1 }}>
                <Search size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'rgba(10,10,10,0.3)' }} />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
                  style={{ width:'100%',paddingLeft:40,paddingRight:16,paddingTop:14,paddingBottom:14,border:'1px solid #e8dfd0',background:'#fff',fontFamily:'var(--font-jost)',fontSize:16,color:'#0a0a0a',outline:'none' }} />
              </div>
              <button onClick={()=>setFiltersOpen(!filtersOpen)}
                style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,border:'1px solid #e8dfd0',background:'#fff',padding:'14px 24px',fontFamily:'var(--font-jost)',fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0a0a0a',cursor:'pointer' }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{ overflow:'hidden' }}>
                  <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'24px',marginBottom:24,display:'grid',gridTemplateColumns:'1fr 1fr',gap:24 }} className="sm:grid-cols-2">
                    <div>
                      <p className="label-gold mb-3" style={{ color:'rgba(10,10,10,0.5)' }}>Category</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={()=>setCategory('')} style={{ padding:'8px 16px',fontFamily:'var(--font-jost)',fontSize:12,border:category===''?'1px solid #0a0a0a':'1px solid #e8dfd0',background:category===''?'#0a0a0a':'transparent',color:category===''?'#f5f0e8':'#0a0a0a',cursor:'pointer' }}>All</button>
                        {categories.map(c => (
                          <button key={c.slug} onClick={()=>setCategory(c.slug)} style={{ padding:'8px 16px',fontFamily:'var(--font-jost)',fontSize:12,border:category===c.slug?'1px solid #0a0a0a':'1px solid #e8dfd0',background:category===c.slug?'#0a0a0a':'transparent',color:category===c.slug?'#f5f0e8':'#0a0a0a',cursor:'pointer' }}>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="label-gold mb-3" style={{ color:'rgba(10,10,10,0.5)' }}>Sort By</p>
                      <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'100%',padding:'10px 0',border:'none',borderBottom:'1px solid rgba(10,10,10,0.2)',background:'transparent',fontFamily:'var(--font-jost)',fontSize:16,color:'#0a0a0a',outline:'none' }}>
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filters */}
            {(category || search) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category && (
                  <span style={{ display:'flex',alignItems:'center',gap:6,background:'#fff',border:'1px solid #c9a96e',padding:'6px 12px',fontFamily:'var(--font-jost)',fontSize:12,color:'#0a0a0a' }}>
                    {categories.find(c=>c.slug===category)?.name}
                    <X size={12} style={{ cursor:'pointer' }} onClick={()=>setCategory('')} />
                  </span>
                )}
              </div>
            )}

            <p style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(10,10,10,0.4)',marginBottom:20 }}>
              {loading ? 'Loading...' : `${sortedProducts.length} products`}
            </p>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({length:8}).map((_,i) => <div key={i} className="aspect-square bg-sand-100 animate-pulse" />)}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ fontFamily:'var(--font-cormorant)',fontSize:24,color:'#0a0a0a',marginBottom:8 }}>No products found</p>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.4)' }}>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {sortedProducts.map((product:any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#faf7f2'}} />}>
      <ProductsContent />
    </Suspense>
  );
}
