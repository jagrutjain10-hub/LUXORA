'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Download, Eye, CheckCircle, XCircle,
  Package, Truck, Check, Clock, ChevronDown, X, ExternalLink,
  RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  paymentMethod: string;
  user: { firstName: string; lastName: string; email: string; phone?: string };
  address?: { fullName: string; line1: string; city: string; state: string; pincode: string; phone: string };
  items: { productName: string; quantity: number; unitPrice: number; imageUrl?: string }[];
  payment?: { status: string; method: string; paidAt?: string; gatewayPaymentId?: string };
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:              { label: 'Pending',          color: 'text-amber-700',  bg: 'bg-amber-50' },
  CONFIRMED:            { label: 'Confirmed',        color: 'text-blue-700',   bg: 'bg-blue-50' },
  PROCESSING:           { label: 'Processing',       color: 'text-indigo-700', bg: 'bg-indigo-50' },
  SHIPPED:              { label: 'Shipped',          color: 'text-purple-700', bg: 'bg-purple-50' },
  DELIVERED:            { label: 'Delivered',        color: 'text-green-700',  bg: 'bg-green-50' },
  CANCELLED:            { label: 'Cancelled',        color: 'text-red-700',    bg: 'bg-red-50' },
  PENDING_VERIFICATION: { label: 'Needs Verify',    color: 'text-orange-700', bg: 'bg-orange-50' },
  PAID:                 { label: 'Paid',             color: 'text-green-700',  bg: 'bg-green-50' },
  FAILED:               { label: 'Failed',           color: 'text-red-700',    bg: 'bg-red-50' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'text-obsidian/50', bg: 'bg-sand-100' };
  return (
    <span className={cn('text-[10px] px-2 py-1 font-mono uppercase tracking-wider', cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

// ─── ORDER DETAIL MODAL ───────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onRefresh }: {
  order: Order;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const screenshotUrl = order.payment?.gatewayPaymentId;

  const handleVerify = async (action: 'VERIFY' | 'REJECT') => {
    setProcessing(true);
    try {
      await api.patch(`/payments/${order.id}/verify`, { action });
      toast.success(action === 'VERIFY' ? 'Payment verified!' : 'Payment rejected.');
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    setStatusUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status });
      toast.success(`Order marked as ${status.toLowerCase()}`);
      onRefresh();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const isScreenshotUrl = screenshotUrl?.startsWith('http');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-obsidian/60" onClick={onClose} />
      <div className="relative w-full sm:w-[90vw] sm:max-w-2xl h-screen bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sand-200 px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <div>
            <h2 className="font-display text-lg text-obsidian">Order {order.orderNumber}</h2>
            <p className="text-xs text-obsidian/40 font-body mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-obsidian/40 hover:text-obsidian">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">

          {/* Payment Verification */}
          {order.payment && (
            <div className={cn(
              'p-4 border rounded-none',
              order.payment.status === 'PENDING' ? 'border-amber-200 bg-amber-50'
                : order.payment.status === 'PAID' ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            )}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider font-body font-medium text-obsidian/60 mb-1">
                    Payment Status
                  </p>
                  <StatusBadge status={order.payment.status} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-obsidian/40 font-body">Method</p>
                  <p className="font-mono text-sm text-obsidian">UPI</p>
                </div>
              </div>

              {/* Screenshot */}
              {screenshotUrl && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider font-body text-obsidian/50 mb-2">
                    Payment Screenshot
                  </p>
                  {isScreenshotUrl ? (
                    <div className="relative">
                      <div className="relative w-full h-48 bg-ivory-100">
                        <Image
                          src={screenshotUrl}
                          alt="Payment screenshot"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <a
                        href={screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1.5 text-xs text-obsidian/60 hover:text-obsidian transition-colors font-body"
                      >
                        <ExternalLink size={12} /> View full screenshot
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-obsidian/40 font-body bg-sand-100 p-3">
                      Screenshot pending upload
                    </p>
                  )}
                </div>
              )}

              {/* Verify / Reject buttons */}
              {order.payment.status === 'PENDING' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerify('VERIFY')}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-xs uppercase tracking-widest font-body hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle size={14} /> Verify Payment
                  </button>
                  <button
                    onClick={() => handleVerify('REJECT')}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white text-xs uppercase tracking-widest font-body hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Order Status */}
          <div>
            <p className="text-xs uppercase tracking-wider font-body text-obsidian/50 mb-3">Update Order Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={statusUpdating || order.status === s}
                  className={cn(
                    'py-2 px-3 text-xs font-body uppercase tracking-wider transition-all border',
                    order.status === s
                      ? 'bg-obsidian text-ivory border-obsidian cursor-default'
                      : 'border-sand-200 text-obsidian hover:bg-obsidian hover:text-ivory hover:border-obsidian disabled:opacity-40'
                  )}
                >
                  {s === 'CONFIRMED' && <Check size={10} className="inline mr-1" />}
                  {s === 'PROCESSING' && <Package size={10} className="inline mr-1" />}
                  {s === 'SHIPPED' && <Truck size={10} className="inline mr-1" />}
                  {s === 'DELIVERED' && <CheckCircle size={10} className="inline mr-1" />}
                  {s === 'CANCELLED' && <XCircle size={10} className="inline mr-1" />}
                  {STATUS_CONFIG[s]?.label ?? s}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-ivory-50 p-4">
            <p className="text-xs uppercase tracking-wider font-body text-obsidian/50 mb-3">Customer</p>
            <p className="font-body text-sm font-medium text-obsidian">{order.user.firstName} {order.user.lastName}</p>
            <p className="text-xs text-obsidian/60 font-body">{order.user.email}</p>
            {order.user.phone && <p className="text-xs text-obsidian/60 font-body">{order.user.phone}</p>}
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-ivory-50 p-4">
              <p className="text-xs uppercase tracking-wider font-body text-obsidian/50 mb-3">Shipping Address</p>
              <p className="font-body text-sm font-medium text-obsidian">{order.address.fullName}</p>
              <p className="text-xs text-obsidian/60 font-body">{order.address.line1}</p>
              <p className="text-xs text-obsidian/60 font-body">
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-xs text-obsidian/60 font-body">{order.address.phone}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-wider font-body text-obsidian/50 mb-3">Items Ordered</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-ivory-50">
                  {item.imageUrl && (
                    <div className="relative w-10 h-10 bg-sand-100 flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body text-obsidian truncate">{item.productName}</p>
                    <p className="text-[10px] text-obsidian/50 font-mono">Qty: {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-display text-sm text-obsidian flex-shrink-0">
                    ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-sand-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm font-medium text-obsidian">Total</span>
              <span className="font-display text-2xl text-obsidian">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ORDERS PAGE ────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: 'All', value: '' },
  { label: 'Needs Verify', value: 'PENDING', paymentStatus: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(search && { search }),
        ...(activeFilter === 'PENDING' ? { paymentStatus: 'PENDING' } : activeFilter ? { status: activeFilter } : {}),
      });
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.data.orders ?? []);
      setTotalPages(data.data.pagination?.totalPages ?? 1);
      setTotal(data.data.pagination?.total ?? 0);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleExport = async () => {
    try {
      const res = await api.get('/orders/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luxora-orders-${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Orders exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-champagne-600 font-body mb-0.5">Management</p>
          <h1 className="font-display text-2xl sm:text-3xl text-obsidian font-light">Orders</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 border border-sand-200 px-3 py-2.5 text-xs uppercase tracking-widest font-body text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-sand-200 px-3 py-2.5 text-xs uppercase tracking-widest font-body text-obsidian hover:bg-obsidian hover:text-ivory transition-colors"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setActiveFilter(tab.value); setPage(1); }}
              className={cn(
                'px-3 py-2 text-xs font-body uppercase tracking-wider whitespace-nowrap transition-all border',
                activeFilter === tab.value
                  ? 'bg-obsidian text-ivory border-obsidian'
                  : 'border-sand-200 text-obsidian/60 hover:text-obsidian hover:border-obsidian/30'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-sand-200 p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID, name, phone..."
            className="w-full pl-8 pr-3 py-2.5 border border-sand-200 text-sm font-body focus:outline-none focus:border-champagne-400"
          />
        </div>
        <span className="text-xs font-mono text-obsidian/40 whitespace-nowrap">{total} orders</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 700 }}>
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-100">
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-body uppercase tracking-wider text-obsidian/50 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t border-sand-100">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 bg-sand-100 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-obsidian/40 font-body">
                    No orders found.
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr
                  key={order.id}
                  className="border-t border-sand-100 hover:bg-ivory-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-obsidian font-medium">#{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-body text-obsidian font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </div>
                    <div className="text-[10px] text-obsidian/40 font-body truncate max-w-[120px]">
                      {order.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-body text-obsidian/60 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-obsidian/60">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-display text-sm text-obsidian">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.payment?.status ?? order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedOrder(order); }}
                      className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-obsidian border border-transparent hover:border-sand-200 transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-sand-200 text-xs font-body text-obsidian disabled:opacity-40 hover:bg-obsidian hover:text-ivory hover:border-obsidian transition-all"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-obsidian/50 px-3">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-sand-200 text-xs font-body text-obsidian disabled:opacity-40 hover:bg-obsidian hover:text-ivory hover:border-obsidian transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}
