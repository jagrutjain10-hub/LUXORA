'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) { setLoading(false); return; }
    try { const { data } = await api.get('/wishlist'); setItems(data.data ?? []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const removeItem = async (productId: string) => {
    await api.post(`/wishlist/${productId}`);
    setItems(prev => prev.filter(i => i.productId !== productId));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (item: any) => {
    addItem({ productId:item.product.id, name:item.product.name, price:Number(item.product.discountPrice ?? item.product.price), image:item.product.images?.[0]?.url, slug:item.product.slug });
    removeItem(item.productId);
    toast.success('Moved to cart');
  };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-20 sm:py-28 text-center section-px">
          <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Your Collection</p>
          <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>Wishlist</h1>
          <div style={{ width:48,height:1,background:'#c9a96e',margin:'28px auto 0' }} />
        </section>
        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="container-luxury">
            {!user ? (
              <div className="text-center py-20">
                <Heart size={40} style={{ color:'#e8dfd0',margin:'0 auto 16px' }} />
                <p style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.5)',marginBottom:24 }}>Sign in to view your wishlist</p>
                <Link href="/login" className="btn-primary">Sign In</Link>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({length:4}).map((_,i) => <div key={i} className="aspect-square bg-sand-100 animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <Heart size={40} style={{ color:'#e8dfd0',margin:'0 auto 16px' }} />
                <p style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.5)',marginBottom:24 }}>Your wishlist is empty</p>
                <Link href="/products" className="btn-primary">Browse Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((item:any,i:number) => (
                  <motion.div key={item.id} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
                    style={{ background:'#fff',border:'1px solid #e8dfd0' }}>
                    <Link href={`/products/${item.product.slug}`} className="block aspect-square overflow-hidden" style={{ position:'relative' }}>
                      {item.product.images?.[0]?.url
                        ? <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 50vw,25vw" />
                        : <div style={{ width:'100%',height:'100%',background:'#f5f0e8',display:'flex',alignItems:'center',justifyContent:'center' }}><Heart size={24} style={{ color:'#e8dfd0' }} /></div>
                      }
                    </Link>
                    <div style={{ padding:'16px' }}>
                      <p style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'#0a0a0a',fontWeight:500,marginBottom:4 }} className="line-clamp-1">{item.product.name}</p>
                      <p style={{ fontFamily:'var(--font-cormorant)',fontSize:18,color:'#0a0a0a',marginBottom:12 }}>₹{Number(item.product.discountPrice??item.product.price).toLocaleString('en-IN')}</p>
                      <div className="flex gap-2">
                        <button onClick={()=>moveToCart(item)} className="btn-primary flex-1 justify-center" style={{ padding:'10px 12px',fontSize:10 }}>
                          <ShoppingBag size={12} /> Add to Cart
                        </button>
                        <button onClick={()=>removeItem(item.productId)} style={{ width:36,height:36,border:'1px solid #e8dfd0',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(10,10,10,0.4)',flexShrink:0 }}
                          className="hover:text-red-500 hover:border-red-200 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
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
