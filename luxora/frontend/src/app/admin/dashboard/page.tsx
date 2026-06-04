'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle,
  Clock, CheckCircle, Truck, ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';
import { useAdminDashboard, useAdminOrders, useUpdateOrderStatus } from '@/hooks/useProducts';
import { orderApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, growth, icon: Icon, accent = false
}: {
  label: string; value: string; sub?: string; growth?: number;
  icon: React.ElementType; accent?: boolean;
}) {
  const positive = growth !== undefined && growth >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 border transition-all duration-300 hover:shadow-card',
        accent ? 'bg-obsidian border-champagne-800/30' : 'bg-white border-sand-200'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-10 h-10 flex items-center justify-center',
          accent ? 'bg-champagne-900/50' : 'bg-ivory-100'
        )}>
          <Icon size={18} className={accent ? 'text-champagne-400' : 'text-champagne-600'} />
        </div>
        {growth !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-mono px-2 py-1',
            positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          )}>
            {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div className={cn('font-display text-3xl font-light mb-1', accent ? 'text-ivory' : 'text-obsidian')}>
        {value}
      </div>
      <div className={cn('text-sm font-body', accent ? 'text-ivory/50' : 'text-obsidian/50')}>{label}</div>
      {sub && (
        <div className={cn('text-xs font-mono mt-1', accent ? 'text-champagne-500/60' : 'text-obsidian/30')}>{sub}</div>
      )}
    </motion.div>
  );
}

// ─── REVENUE CHART ────────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: any[] }) {
  const formatted = data.map(d => ({
    date: format(new Date(d.date), 'MMM d'),
    revenue: Math.round(d.revenue),
  }));

  return (
    <div className="bg-white border border-sand-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-body text-sm uppercase tracking-widest text-obsidian/60">Revenue</h3>
          <div className="font-display text-2xl text-obsidian font-light mt-1">Last 30 Days</div>
        </div>
        <TrendingUp size={20} className="text-champagne-500" />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fontFamily: 'var(--font-jost)', fill: '#8a8178' }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', fill: '#8a8178' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0a0a', border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: 0, fontFamily: 'var(--font-jost)', fontSize: 12, color: '#f5f0e8'
            }}
            formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── RECENT ORDERS TABLE ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  PENDING: { color: 'bg-amber-50 text-amber-700', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'bg-blue-50 text-blue-700', icon: CheckCircle, label: 'Confirmed' },
  PACKED: { color: 'bg-purple-50 text-purple-700', icon: Package, label: 'Packed' },
  SHIPPED: { color: 'bg-indigo-50 text-indigo-700', icon: Truck, label: 'Shipped' },
  DELIVERED: { color: 'bg-green-50 text-green-700', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'bg-red-50 text-red-600', icon: AlertTriangle, label: 'Cancelled' },
};

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function OrdersTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useAdminOrders({ page, status: statusFilter || undefined });
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleExport = async () => {
    try {
      const res = await orderApi.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `luxora-orders-${Date.now()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="bg-white border border-sand-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-sand-100">
        <h3 className="font-body text-sm uppercase tracking-widest text-obsidian">Orders</h3>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-sand-200 px-3 py-2 bg-white text-obsidian focus:outline-none focus:border-champagne-400"
          >
            <option value="">All Status</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-obsidian/15 text-sm font-body
                       text-obsidian hover:bg-obsidian hover:text-ivory transition-all duration-200"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-ivory-50">
              {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-sand-100">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 skeleton w-full" /></td>
                  ))}
                </tr>
              ))
            ) : data?.orders?.map((order: any) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              return (
                <tr key={order.id} className="border-t border-sand-100 hover:bg-ivory-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-champagne-700">{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-obsidian font-body">
                      {order.user?.firstName} {order.user?.lastName}
                    </div>
                    <div className="text-xs text-obsidian/40 font-mono">{order.user?.email}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-obsidian/60 font-mono">{order.items?.length}</td>
                  <td className="px-4 py-4">
                    <span className="font-display text-base text-obsidian">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      'text-xs px-2 py-1 font-mono',
                      order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    )}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className={cn('inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5', status.color)}>
                      <StatusIcon size={11} />
                      {status.label}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-obsidian/40 font-mono whitespace-nowrap">
                    {format(new Date(order.createdAt), 'dd MMM, HH:mm')}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={e => updateStatus({ id: order.id, status: e.target.value })}
                      className="text-xs border border-sand-200 px-2 py-1.5 bg-white focus:outline-none focus:border-champagne-400"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-sand-100">
          <span className="text-xs text-obsidian/40 font-mono">
            {data.pagination.total} total orders
          </span>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-8 h-8 text-xs font-mono transition-all',
                  page === p ? 'bg-obsidian text-ivory' : 'border border-sand-200 text-obsidian/50 hover:border-obsidian'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOP PRODUCTS ─────────────────────────────────────────────────────────────

function TopProducts({ products }: { products: any[] }) {
  return (
    <div className="bg-white border border-sand-200 p-6">
      <h3 className="font-body text-sm uppercase tracking-widest text-obsidian/60 mb-6">Top Products</h3>
      <div className="space-y-4">
        {products?.map((p: any, i: number) => (
          <div key={p.productId} className="flex items-center gap-4">
            <div className="w-7 h-7 bg-ivory-100 flex items-center justify-center text-xs font-mono text-obsidian/40">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-body text-obsidian truncate">{p.productName}</div>
              <div className="text-xs text-obsidian/40 font-mono">{p._sum.quantity} sold</div>
            </div>
            <div className="font-display text-base text-champagne-700">
              ₹{Number(p._sum.totalPrice).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="label-gold text-champagne-500 mb-2">Overview</div>
        <h1 className="font-display text-display-sm text-obsidian font-light">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={isLoading ? '—' : `₹${(data?.stats.totalRevenue / 100000).toFixed(1)}L`}
          sub={`₹${data?.stats.monthRevenue?.toLocaleString('en-IN')} this month`}
          growth={data?.stats.revenueGrowth}
          icon={TrendingUp}
          accent
        />
        <StatCard
          label="Total Orders"
          value={isLoading ? '—' : data?.stats.totalOrders?.toLocaleString()}
          sub={`${data?.stats.monthOrders} this month`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Customers"
          value={isLoading ? '—' : data?.stats.totalCustomers?.toLocaleString()}
          sub={`${data?.stats.monthCustomers} new this month`}
          icon={Users}
        />
        <StatCard
          label="Pending Orders"
          value={isLoading ? '—' : data?.stats.pendingOrders?.toString()}
          sub={data?.stats.lowStockProducts > 0 ? `${data.stats.lowStockProducts} low stock` : 'Stock OK'}
          icon={data?.stats.pendingOrders > 0 ? Clock : CheckCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {data?.revenueByDay && <RevenueChart data={data.revenueByDay} />}
        </div>
        <div>
          {data?.topProducts && <TopProducts products={data.topProducts} />}
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
