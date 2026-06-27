'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:    { label: 'Pending Verification', color: 'text-amber-600',  icon: Clock },
  CONFIRMED:  { label: 'Confirmed',            color: 'text-blue-600',   icon: CheckCircle },
  PROCESSING: { label: 'Processing',           color: 'text-indigo-600', icon: Package },
  SHIPPED:    { label: 'Shipped',              color: 'text-purple-600', icon: Truck },
  DELIVERED:  { label: 'Delivered',            color: 'text-green-600',  icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',            color: 'text-red-500',    icon: XCircle },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my?limit=20')
      .then(res => setOrders(res.data.data?.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-obsidian font-light">My Orders</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-sand-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-sand-200">
          <Package size={40} className="text-sand-300 mx-auto mb-4" />
          <p className="font-body text-obsidian/50 mb-6">No orders yet</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
            const StatusIcon = statusCfg.icon;
            return (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block bg-white border border-sand-200 hover:border-champagne-400 transition-all p-4 sm:p-5 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* First item image */}
                    {order.items?.[0]?.imageUrl && (
                      <div className="relative w-12 h-12 bg-ivory-100 flex-shrink-0">
                        <Image
                          src={order.items[0].imageUrl}
                          alt={order.items[0].productName}
                          fill className="object-cover" sizes="48px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-obsidian/50 mb-0.5">#{order.orderNumber}</p>
                      <p className="font-body text-sm text-obsidian font-medium truncate">
                        {order.items?.[0]?.productName}
                        {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                      <p className="text-xs text-obsidian/40 font-body mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display text-lg text-obsidian">₹{Number(order.totalAmount).toLocaleString('en-IN')}</p>
                    <div className={cn('flex items-center gap-1 justify-end mt-1', statusCfg.color)}>
                      <StatusIcon size={11} />
                      <span className="text-[10px] font-body">{statusCfg.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-sand-100">
                  <div className="flex items-center gap-1.5">
                    {order.payment?.status === 'PENDING' && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 font-mono">
                        Payment Pending Verification
                      </span>
                    )}
                    {order.payment?.status === 'PAID' && (
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 font-mono">
                        Payment Verified
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-obsidian/30 group-hover:text-champagne-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
