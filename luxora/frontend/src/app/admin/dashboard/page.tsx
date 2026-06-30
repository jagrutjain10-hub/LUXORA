'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Users, Package, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard').catch(() => ({ data: { data: null } })),
      api.get('/admin/inventory-alerts').catch(() => ({ data: { data: [] } })),
    ]).then(([statsRes, alertsRes]) => {
      setStats(statsRes.data.data);
      setAlerts(alertsRes.data.data ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: '#c9a96e' },
    { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}` : '—', icon: TrendingUp, color: '#c9a96e' },
    { label: 'Total Customers', value: stats?.totalCustomers ?? '—', icon: Users, color: '#c9a96e' },
    { label: 'Total Products', value: stats?.totalProducts ?? '—', icon: Package, color: '#c9a96e' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9a96e',marginBottom:6 }}>Overview</p>
        <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.5rem)',color:'#0a0a0a' }}>Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.08 }}
            style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'20px 18px' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
              <p style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(10,10,10,0.45)' }}>{card.label}</p>
              <card.icon size={16} style={{ color:'#c9a96e' }} />
            </div>
            {loading ? (
              <div style={{ height:32,background:'#f5f0e8',borderRadius:0 }} className="animate-pulse" />
            ) : (
              <p style={{ fontFamily:'var(--font-cormorant)',fontSize:'clamp(1.5rem,2.5vw,2rem)',fontWeight:300,color:'#0a0a0a' }}>{card.value}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pending orders */}
      <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'24px' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
          <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:20,color:'#0a0a0a' }}>Pending Verification</h2>
          <Link href="/admin/orders" style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'#c9a96e',textDecoration:'none',display:'flex',alignItems:'center',gap:6 }}>
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {stats?.pendingOrders > 0 ? (
          <div style={{ background:'#fff8ed',border:'1px solid #f5d89b',padding:'16px 20px',display:'flex',alignItems:'center',gap:12 }}>
            <AlertTriangle size={18} style={{ color:'#d97706',flexShrink:0 }} />
            <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'#92400e' }}>
              <strong>{stats.pendingOrders}</strong> order{stats.pendingOrders!==1?'s':''} awaiting payment verification.{' '}
              <Link href="/admin/orders?filter=PENDING" style={{ color:'#c9a96e',textDecoration:'underline' }}>Review now</Link>
            </p>
          </div>
        ) : (
          <p style={{ fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.4)',textAlign:'center',padding:'20px 0' }}>
            All orders are up to date ✓
          </p>
        )}
      </div>

      {/* Inventory alerts */}
      {alerts.length > 0 && (
        <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'24px' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
            <h2 style={{ fontFamily:'var(--font-cormorant)',fontWeight:400,fontSize:20,color:'#0a0a0a' }}>Low Stock Alerts</h2>
            <Link href="/admin/products" style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'#c9a96e',textDecoration:'none' }}>
              Manage
            </Link>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((item: any) => (
              <div key={item.id} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#faf7f2',border:'1px solid #e8dfd0' }}>
                <p style={{ fontFamily:'var(--font-jost)',fontSize:13,color:'#0a0a0a' }} className="truncate">{item.name}</p>
                <span style={{ fontFamily:'var(--font-jost)',fontSize:11,background:item.stockQty===0?'#fee2e2':'#fef3c7',color:item.stockQty===0?'#dc2626':'#d97706',padding:'3px 8px',flexShrink:0,marginLeft:12 }}>
                  {item.stockQty === 0 ? 'Out of Stock' : `${item.stockQty} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Add Product','/admin/products',Package],['View Orders','/admin/orders',ShoppingBag],['Customers','/admin/customers',Users],['View Store','/',TrendingUp]].map(([l,h,Icon]:any) => (
          <Link key={h} href={h} style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,padding:'20px 12px',background:'#fff',border:'1px solid #e8dfd0',textDecoration:'none' }}
            className="hover:border-champagne-400 transition-all group">
            <Icon size={20} style={{ color:'#c9a96e' }} />
            <span style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(10,10,10,0.6)' }}>{l}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
