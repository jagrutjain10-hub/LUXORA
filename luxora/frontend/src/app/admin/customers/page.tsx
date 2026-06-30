'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const { data } = await api.get(`/admin/customers?${params}`);
      setCustomers(data.data.customers ?? []);
      setTotalPages(data.data.pagination?.totalPages ?? 1);
      setTotal(data.data.pagination?.total ?? 0);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/customers/${id}/toggle`);
      setCustomers(cs => cs.map(c => c.id === id ? { ...c, isActive: !current } : c));
      toast.success(current ? 'Customer deactivated' : 'Customer activated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p style={{ fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9a96e',marginBottom:4 }}>Management</p>
          <h1 style={{ fontFamily:'var(--font-cormorant)',fontWeight:300,fontSize:'clamp(1.8rem,3vw,2.5rem)',color:'#0a0a0a' }}>Customers</h1>
        </div>
        <button onClick={fetchCustomers} style={{ display:'flex',alignItems:'center',gap:6,border:'1px solid #e8dfd0',padding:'10px 16px',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0a0a0a',background:'#fff',cursor:'pointer' }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div style={{ background:'#fff',border:'1px solid #e8dfd0',padding:'12px 16px',display:'flex',alignItems:'center',gap:12 }}>
        <div style={{ position:'relative',flex:1 }}>
          <Search size={14} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'rgba(10,10,10,0.3)' }} />
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name, email, phone..."
            style={{ width:'100%',paddingLeft:36,paddingRight:12,paddingTop:10,paddingBottom:10,border:'1px solid #e8dfd0',fontFamily:'var(--font-jost)',fontSize:14,color:'#0a0a0a',outline:'none',background:'#faf7f2' }} />
        </div>
        <span style={{ fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',whiteSpace:'nowrap' }}>{total} customers</span>
      </div>

      <div style={{ background:'#fff',border:'1px solid #e8dfd0',overflowX:'auto' }}>
        <table style={{ width:'100%',minWidth:700 }}>
          <thead>
            <tr style={{ background:'#faf7f2',borderBottom:'1px solid #e8dfd0' }}>
              {['Customer','Email','Phone','Orders','Joined','Status',''].map(h => (
                <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontFamily:'var(--font-jost)',fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(10,10,10,0.45)',whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({length:8}).map((_,i) => (
              <tr key={i} style={{ borderTop:'1px solid #f5f0e8' }}>
                {Array.from({length:7}).map((_,j) => (
                  <td key={j} style={{ padding:'14px 16px' }}><div style={{ height:12,background:'#f5f0e8' }} className="animate-pulse" /></td>
                ))}
              </tr>
            )) : customers.length === 0 ? (
              <tr><td colSpan={7} style={{ padding:'48px 16px',textAlign:'center',fontFamily:'var(--font-jost)',fontSize:14,color:'rgba(10,10,10,0.4)' }}>No customers found.</td></tr>
            ) : customers.map((c:any) => (
              <tr key={c.id} style={{ borderTop:'1px solid #f5f0e8' }} className="hover:bg-[#faf7f2] transition-colors">
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <div style={{ width:32,height:32,background:'#f5f0e8',border:'1px solid #e8dfd0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <span style={{ fontFamily:'var(--font-cormorant)',fontSize:16,color:'#c9a96e' }}>{c.firstName[0]}</span>
                    </div>
                    <span style={{ fontFamily:'var(--font-jost)',fontSize:13,fontWeight:500,color:'#0a0a0a' }}>{c.firstName} {c.lastName}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px',fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.6)' }}>{c.email}</td>
                <td style={{ padding:'12px 16px',fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.6)' }}>{c.phone||'—'}</td>
                <td style={{ padding:'12px 16px',fontFamily:'var(--font-cormorant)',fontSize:18,color:'#0a0a0a' }}>{c._count?.orders??0}</td>
                <td style={{ padding:'12px 16px',fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.5)',whiteSpace:'nowrap' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ fontFamily:'var(--font-jost)',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',padding:'3px 10px',background:c.isActive?'#f0fdf4':'#fef2f2',color:c.isActive?'#16a34a':'#dc2626' }}>
                    {c.isActive?'Active':'Inactive'}
                  </span>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <button onClick={()=>toggleActive(c.id,c.isActive)} title={c.isActive?'Deactivate':'Activate'}
                    style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(10,10,10,0.4)',padding:4 }} className="hover:text-obsidian transition-colors">
                    {c.isActive?<UserX size={15}/>:<UserCheck size={15}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:'8px 16px',border:'1px solid #e8dfd0',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0a0a0a',background:'#fff',cursor:'pointer',opacity:page===1?0.4:1 }}>Previous</button>
          <span style={{ fontFamily:'var(--font-jost)',fontSize:12,color:'rgba(10,10,10,0.4)',padding:'0 12px' }}>{page} / {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:'8px 16px',border:'1px solid #e8dfd0',fontFamily:'var(--font-jost)',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0a0a0a',background:'#fff',cursor:'pointer',opacity:page===totalPages?0.4:1 }}>Next</button>
        </div>
      )}
    </div>
  );
}
