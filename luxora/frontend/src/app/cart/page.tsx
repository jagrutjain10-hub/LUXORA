'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/store/cart.store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCartStore();
  const sub = subtotal();
  const shipping = sub >= 2999 ? 0 : 199;
  const total = sub + shipping;

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-16 sm:py-24 text-center section-px">
          <p className="label-gold mb-4" style={{ color:'#c9a96e' }}>Your Selections</p>
          <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1.1 }}>Shopping Cart</h1>
          <div style={{ width:48,height:1,background:'#c9a96e',margin:'24px auto 0' }} />
        </section>
        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="container-luxury">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} style={{ color:'#e8dfd0',margin:'0 auto 20px' }} />
                <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,fontSize:28,color:'#0a0a0a',marginBottom:12 }}>Your cart is empty</h2>
                <p style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.5)',marginBottom:28,fontSize:15 }}>Discover our curated collection of luxury home decor.</p>
                <Link href="/products" className="btn-primary">Browse Collection</Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {items.map((item:any) => (
                      <motion.div key={item.productId} layout initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-12 }}
                        style={{ background:'#fff',border:'1px solid #e8dfd0',display:'flex',gap:16,padding:'16px' }}>
                        <div style={{ position:'relative',width:80,height:80,flexShrink:0,background:'#f5f0e8' }}>
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ fontFamily:'var(--font-jost)',fontSize:14,fontWeight:500,color:'#0a0a0a',marginBottom:4 }} className="line-clamp-2">{item.name}</p>
                          <p style={{ fontFamily:'var(--font-cormorant)',fontSize:20,color:'#0a0a0a',marginBottom:12 }}>₹{item.price.toLocaleString('en-IN')}</p>
                          <div className="flex items-center justify-between">
                            <div style={{ display:'flex',alignItems:'center',border:'1px solid #e8dfd0' }}>
                              <button onClick={()=>updateQty(item.productId,item.quantity-1)} style={{ width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(10,10,10,0.5)' }}><Minus size={12}/></button>
                              <span style={{ width:36,textAlign:'center',fontFamily:'var(--font-jost)',fontSize:14,color:'#0a0a0a' }}>{item.quantity}</span>
                              <button onClick={()=>updateQty(item.productId,item.quantity+1)} style={{ width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(10,10,10,0.5)' }}><Plus size={12}/></button>
                            </div>
                            <button onClick={()=>removeItem(item.productId)} style={{ color:'rgba(10,10,10,0.3)',background:'none',border:'none',cursor:'pointer',padding:4 }} className="hover:text-red-500 transition-colors"><Trash2 size={15}/></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div>
                  <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'28px 24px',position:'sticky',top:'calc(var(--nav-height) + 24px)' }}>
                    <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a',marginBottom:20 }}>Order Summary</h2>
                    <div className="space-y-3" style={{ fontFamily:'var(--font-jost)',fontSize:14 }}>
                      <div className="flex justify-between" style={{ color:'rgba(10,10,10,0.6)' }}><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between" style={{ color:'rgba(10,10,10,0.6)' }}><span>Shipping</span><span style={{ color:shipping===0?'#6b7280':'inherit' }}>{shipping===0?'Free':`₹${shipping}`}</span></div>
                      {shipping>0 && <p style={{ fontSize:11,color:'rgba(10,10,10,0.4)',marginTop:4 }}>Free shipping on orders above ₹2,999</p>}
                      <div style={{ borderTop:'1px solid #e8dfd0',paddingTop:16,marginTop:4 }} className="flex justify-between items-center">
                        <span style={{ fontWeight:500,color:'#0a0a0a' }}>Total</span>
                        <span style={{ fontFamily:'var(--font-cormorant)',fontSize:26,color:'#0a0a0a' }}>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <Link href="/checkout" className="btn-primary w-full justify-center mt-6" style={{ marginTop:24 }}>
                      Proceed to Checkout <ArrowRight size={14} />
                    </Link>
                    <Link href="/products" className="btn-secondary w-full justify-center mt-3" style={{ marginTop:12,fontSize:11 }}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
