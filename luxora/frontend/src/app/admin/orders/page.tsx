'use client';
// @ts-nocheck
import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useProducts';
import { orderApi } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PACKED','SHIPPED','DELIVERED','CANCELLED'];
const STATUS_COLORS = { PENDING:'#f59e0b', CONFIRMED:'#3b82f6', PACKED:'#8b5cf6', SHIPPED:'#6366f1', DELIVERED:'#10b981', CANCELLED:'#ef4444' };

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminOrders({ page, status: status || undefined, search: search || undefined });
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleExport = async () => {
    try {
      const res = await orderApi.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'luxora-orders.xlsx'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Export failed'); }
  };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'32px',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <p style={{fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9a96e',marginBottom:'4px',fontFamily:'var(--font-jost)'}}>Management</p>
          <h1 style={{fontFamily:'var(--font-cormorant)',fontSize:'2rem',fontWeight:300,color:'#0a0a0a'}}>Orders</h1>
        </div>
        <button onClick={handleExport} style={{background:'#0a0a0a',color:'#f5f0e8',padding:'12px 24px',border:'none',fontSize:'11px',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:'var(--font-jost)',cursor:'pointer'}}>Export Excel</button>
      </div>

      <div style={{background:'white',border:'1px solid #e8dfd0',padding:'16px',display:'flex',gap:'12px',marginBottom:'24px',flexWrap:'wrap'}}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by order number or email..." style={{flex:1,minWidth:'200px',border:'1px solid #e8dfd0',padding:'10px 16px',fontFamily:'var(--font-jost)',fontSize:'14px',outline:'none'}} />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{border:'1px solid #e8dfd0',padding:'10px 16px',fontFamily:'var(--font-jost)',fontSize:'14px',outline:'none',background:'white'}}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{background:'white',border:'1px solid #e8dfd0',overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#faf7f2'}}>
              {['Order','Customer','Items','Total','Payment','Status','Date','Action'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(10,10,10,0.5)',fontFamily:'var(--font-jost)',fontWeight:500,whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({length:8}).map((_,i) => (
                <tr key={i} style={{borderTop:'1px solid #f0ebe3'}}>
                  {Array.from({length:8}).map((_,j) => (
                    <td key={j} style={{padding:'16px'}}><div style={{height:'16px',background:'#e8dfd0',borderRadius:'2px'}} /></td>
                  ))}
                </tr>
              ))
            ) : data?.orders?.map((order: any) => (
              <tr key={order.id} style={{borderTop:'1px solid #f0ebe3'}}>
                <td style={{padding:'14px 16px',fontFamily:'var(--font-jost)',fontSize:'12px',color:'#c9a96e',fontWeight:500}}>{order.orderNumber}</td>
                <td style={{padding:'14px 16px'}}>
                  <div style={{fontFamily:'var(--font-jost)',fontSize:'13px',color:'#0a0a0a'}}>{order.user?.firstName} {order.user?.lastName}</div>
                  <div style={{fontFamily:'monospace',fontSize:'11px',color:'rgba(10,10,10,0.4)'}}>{order.user?.email}</div>
                </td>
                <td style={{padding:'14px 16px',fontFamily:'monospace',fontSize:'12px',color:'rgba(10,10,10,0.6)'}}>{order.items?.length}</td>
                <td style={{padding:'14px 16px',fontFamily:'var(--font-cormorant)',fontSize:'16px',color:'#0a0a0a'}}>Rs.{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                <td style={{padding:'14px 16px'}}>
                  <span style={{fontSize:'11px',padding:'3px 8px',fontFamily:'var(--font-jost)',background:order.paymentStatus==='PAID'?'#d1fae5':'#fef3c7',color:order.paymentStatus==='PAID'?'#065f46':'#92400e'}}>{order.paymentStatus}</span>
                </td>
                <td style={{padding:'14px 16px'}}>
                  <span style={{fontSize:'11px',padding:'3px 8px',fontFamily:'var(--font-jost)',background:'rgba(0,0,0,0.05)',color:STATUS_COLORS[order.status]||'#0a0a0a'}}>{order.status}</span>
                </td>
                <td style={{padding:'14px 16px',fontFamily:'monospace',fontSize:'11px',color:'rgba(10,10,10,0.4)',whiteSpace:'nowrap'}}>{order.createdAt ? format(new Date(order.createdAt),'dd MMM yy') : '-'}</td>
                <td style={{padding:'14px 16px'}}>
                  <select value={order.status} onChange={e => updateStatus({id:order.id,status:e.target.value})} style={{border:'1px solid #e8dfd0',padding:'6px 8px',fontFamily:'var(--font-jost)',fontSize:'12px',outline:'none',background:'white',cursor:'pointer'}}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
          {Array.from({length:Math.min(data.pagination.totalPages,5)},(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{width:'36px',height:'36px',border:'1px solid',borderColor:page===p?'#0a0a0a':'#e8dfd0',background:page===p?'#0a0a0a':'white',color:page===p?'#f5f0e8':'rgba(10,10,10,0.6)',fontFamily:'monospace',fontSize:'13px',cursor:'pointer'}}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}