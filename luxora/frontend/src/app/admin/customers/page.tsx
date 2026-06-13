'use client';
// @ts-nocheck
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { format } from 'date-fns';

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: async () => {
      const res = await adminApi.customers({ page, search: search || undefined });
      return res.data.data;
    }
  });

  return (
    <div>
      <div style={{marginBottom:'32px'}}>
        <p style={{fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9a96e',marginBottom:'4px',fontFamily:'var(--font-jost)'}}>Management</p>
        <h1 style={{fontFamily:'var(--font-cormorant)',fontSize:'2rem',fontWeight:300,color:'#0a0a0a'}}>Customers</h1>
      </div>

      <div style={{background:'white',border:'1px solid #e8dfd0',padding:'16px',marginBottom:'24px'}}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." style={{width:'100%',maxWidth:'400px',border:'1px solid #e8dfd0',padding:'10px 16px',fontFamily:'var(--font-jost)',fontSize:'14px',outline:'none'}} />
      </div>

      <div style={{background:'white',border:'1px solid #e8dfd0',overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#faf7f2'}}>
              {['Customer','Email','Phone','Orders','Status','Joined'].map(h => (
                <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(10,10,10,0.5)',fontFamily:'var(--font-jost)',fontWeight:500}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({length:8}).map((_,i) => (
                <tr key={i} style={{borderTop:'1px solid #f0ebe3'}}>
                  {Array.from({length:6}).map((_,j) => (
                    <td key={j} style={{padding:'16px'}}><div style={{height:'16px',background:'#e8dfd0',borderRadius:'2px'}} /></td>
                  ))}
                </tr>
              ))
            ) : data?.customers?.map((customer: any) => (
              <tr key={customer.id} style={{borderTop:'1px solid #f0ebe3'}}>
                <td style={{padding:'14px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#f7edd8',display:'flex',alignItems:'center',justifyContent:'center',color:'#c9a96e',fontFamily:'var(--font-cormorant)',fontSize:'16px',flexShrink:0}}>
                      {customer.firstName?.[0]}
                    </div>
                    <div>
                      <div style={{fontFamily:'var(--font-jost)',fontSize:'13px',color:'#0a0a0a',fontWeight:500}}>{customer.firstName} {customer.lastName}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'14px 16px',fontFamily:'var(--font-jost)',fontSize:'13px',color:'rgba(10,10,10,0.6)'}}>{customer.email}</td>
                <td style={{padding:'14px 16px',fontFamily:'var(--font-jost)',fontSize:'13px',color:'rgba(10,10,10,0.6)'}}>{customer.phone || '—'}</td>
                <td style={{padding:'14px 16px',fontFamily:'monospace',fontSize:'13px',color:'rgba(10,10,10,0.6)',textAlign:'center'}}>{customer._count?.orders || 0}</td>
                <td style={{padding:'14px 16px'}}>
                  <span style={{fontSize:'11px',padding:'3px 8px',fontFamily:'var(--font-jost)',background:customer.isActive?'#d1fae5':'#fee2e2',color:customer.isActive?'#065f46':'#991b1b'}}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{padding:'14px 16px',fontFamily:'monospace',fontSize:'11px',color:'rgba(10,10,10,0.4)'}}>{customer.createdAt ? format(new Date(customer.createdAt),'dd MMM yyyy') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data?.customers || data.customers.length === 0) && !isLoading && (
          <div style={{padding:'48px',textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>👥</div>
            <p style={{fontFamily:'var(--font-jost)',color:'rgba(10,10,10,0.4)'}}>No customers found</p>
          </div>
        )}
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