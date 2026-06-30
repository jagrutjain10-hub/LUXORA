'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, MapPin, User, LogOut, ChevronRight, Package } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/store/wishlist.store';
import { api, authApi } from '@/lib/api';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ orders:0, wishlist:0, addresses:0 });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/orders/my?limit=5').then(r => {
      const data = r.data.data;
      setOrders(data.orders ?? []);
      setStats(s => ({ ...s, orders: data.pagination?.total ?? 0 }));
    }).catch(()=>{});
    api.get('/wishlist').then(r => setStats(s=>({...s,wishlist:r.data.data?.length??0}))).catch(()=>{});
  }, [user, router]);

  const handleLogout = async () => {
    await authApi.logout().catch(()=>null);
    clearAuth();
    router.push('/');
  };

  if (!user) return null;

  const STATUS_COLOR: Record<string,string> = { PENDING:'#d97706',CONFIRMED:'#2563eb',PROCESSING:'#7c3aed',SHIPPED:'#db2777',DELIVERED:'#16a34a',CANCELLED:'#dc2626' };

  return (
    <>
      <Navbar />
      <main className="pt-[var(--nav-height)]">
        <section style={{ background:'#0a0a0a' }} className="py-14 sm:py-20 section-px">
          <div className="container-luxury">
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
              <div>
                <p className="label-gold mb-2" style={{ color:'#c9a96e' }}>Member Area</p>
                <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,color:'#f5f0e8',fontSize:'clamp(2rem,4vw,3rem)' }}>Hello, {user.firstName}</h1>
              </div>
              {(user.role==='ADMIN'||user.role==='SUPER_ADMIN') && (
                <Link href="/admin/dashboard" style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'#c9a96e',border:'1px solid #c9a96e',padding:'10px 20px',textDecoration:'none' }}>
                  Admin Panel
                </Link>
              )}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:24 }}>
              {[['Total Orders',stats.orders,ShoppingBag],['Wishlist',stats.wishlist,Heart],['Addresses',stats.addresses,MapPin]].map(([l,v,Icon]:any) => (
                <div key={l} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,169,110,0.2)',padding:'20px 16px' }}>
                  <Icon size={18} style={{ color:'#c9a96e',marginBottom:8 }} />
                  <div style={{ fontFamily:'var(--font-cormorant)',fontSize:28,color:'#f5f0e8',fontWeight:300 }}>{v}</div>
                  <div style={{ fontFamily:'var(--font-jost)',fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background:'#faf7f2' }} className="section-py section-px">
          <div className="container-luxury">
            <div style={{ display:'grid',lg:'grid-cols-3',gap:24 }} className="grid lg:grid-cols-4">
              {/* Sidebar */}
              <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'8px 0',height:'fit-content' }}>
                {[['My Profile','/dashboard/profile',User],['My Orders','/dashboard/orders',ShoppingBag],['Wishlist','/wishlist',Heart],['Addresses','/dashboard/addresses',MapPin]].map(([l,h,Icon]:any) => (
                  <Link key={h} href={h} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(10,10,10,0.7)',textDecoration:'none',borderBottom:'1px solid #f5f0e8' }}
                    className="hover:bg-ivory-50 transition-colors group">
                    <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                      <Icon size={15} style={{ color:'#c9a96e' }} />
                      {l}
                    </div>
                    <ChevronRight size={14} style={{ color:'rgba(10,10,10,0.2)' }} />
                  </Link>
                ))}
                <button onClick={handleLogout} style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 20px',fontFamily:'var(--font-jost)',fontSize:13,color:'rgba(10,10,10,0.5)',background:'none',border:'none',cursor:'pointer',width:'100%' }}>
                  <LogOut size={15} style={{ color:'rgba(10,10,10,0.3)' }} /> Sign Out
                </button>
              </div>

              {/* Main */}
              <div className="lg:col-span-3 space-y-6">
                {/* Profile card */}
                <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'24px' }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
                    <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a' }}>Profile</h2>
                    <Link href="/dashboard/profile" style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#c9a96e',textDecoration:'none' }}>Edit</Link>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
                    {[['First Name',user.firstName],['Last Name',user.lastName],['Email',user.email],['Phone',user.phone||'—']].map(([l,v]:any) => (
                      <div key={l}>
                        <p style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(10,10,10,0.4)',marginBottom:4 }}>{l}</p>
                        <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'#0a0a0a' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'24px' }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
                    <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:22,color:'#0a0a0a' }}>Recent Orders</h2>
                    <Link href="/dashboard/orders" style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#c9a96e',textDecoration:'none' }}>View All</Link>
                  </div>
                  {orders.length === 0 ? (
                    <div style={{ textAlign:'center',padding:'32px 0' }}>
                      <Package size={32} style={{ color:'#e8dfd0',margin:'0 auto 12px' }} />
                      <p style={{ fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.4)',fontSize:14,marginBottom:16 }}>No orders yet</p>
                      <Link href="/products" className="btn-primary" style={{ fontSize:11 }}>Shop Now</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o:any) => (
                        <Link key={o.id} href={`/dashboard/orders/${o.id}`} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'#faf7f2',border:'1px solid #e8dfd0',textDecoration:'none' }}
                          className="hover:border-champagne-400 transition-all">
                          <div>
                            <p style={{ fontFamily:'var(--font-jost)',fontSize:13,fontWeight:500,color:'#0a0a0a',marginBottom:2 }}>#{o.orderNumber}</p>
                            <p style={{ fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ fontFamily:'var(--font-cormorant)',fontSize:18,color:'#0a0a0a',marginBottom:2 }}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</p>
                            <span style={{ fontFamily:'var(--font-jost)',fontSize:10,color:STATUS_COLOR[o.status]??'#888',letterSpacing:'0.1em',textTransform:'uppercase' }}>{o.status}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
