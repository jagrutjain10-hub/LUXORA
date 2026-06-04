'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ShoppingBag, Heart, MapPin, Edit3, Save } from 'lucide-react';
import { useAuthStore } from '@/store/wishlist.store';
import { useOrders } from '@/hooks/useProducts';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore();
  const { data: ordersData } = useOrders({ limit: 3 });
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: '' },
  });

  if (!user) return null;

  const orderStats = [
    { label: 'Total Orders', value: ordersData?.pagination?.total ?? '—', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Wishlist', value: '—', href: '/dashboard/wishlist', icon: Heart },
    { label: 'Addresses', value: '—', href: '/dashboard/addresses', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {orderStats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href}
            className="bg-white border border-sand-200 p-5 hover:border-champagne-300 hover:shadow-card transition-all duration-300 group">
            <Icon size={20} className="text-champagne-600 mb-3" />
            <div className="font-display text-2xl text-obsidian font-light">{value}</div>
            <div className="text-xs font-body text-obsidian/50 uppercase tracking-widest mt-1 group-hover:text-champagne-700 transition-colors">{label}</div>
          </Link>
        ))}
      </div>

      {/* Profile */}
      <div className="bg-white border border-sand-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-obsidian font-medium">Profile</h2>
          <button onClick={() => setEditing(!editing)} className="text-sm font-body text-champagne-700 flex items-center gap-2 hover:text-obsidian transition-colors">
            {editing ? <Save size={14} /> : <Edit3 size={14} />}
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {[
            { label: 'First Name', name: 'firstName', value: user.firstName },
            { label: 'Last Name', name: 'lastName', value: user.lastName },
            { label: 'Email', name: 'email', value: user.email, disabled: true },
            { label: 'Phone', name: 'phone', value: '—' },
          ].map(({ label, name, value, disabled }) => (
            <div key={name}>
              <div className="text-xs font-body uppercase tracking-widest text-obsidian/40 mb-2">{label}</div>
              {editing && !disabled ? (
                <input
                  {...register(name as any)}
                  className="input-luxury w-full text-sm"
                />
              ) : (
                <div className={`text-sm font-body py-2 border-b border-sand-100 ${disabled ? 'text-obsidian/40' : 'text-obsidian'}`}>
                  {value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-sand-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-obsidian font-medium">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-body text-champagne-700 hover:text-obsidian transition-colors">
            View All
          </Link>
        </div>

        {!ordersData?.orders?.length ? (
          <div className="text-center py-10">
            <ShoppingBag size={32} className="text-sand-300 mx-auto mb-3" />
            <p className="text-sm font-body text-obsidian/40">No orders yet</p>
            <Link href="/products" className="btn-secondary mt-4 inline-flex">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ordersData.orders.map((order: any) => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-ivory-50 hover:bg-ivory-100 transition-colors">
                <div>
                  <div className="font-mono text-xs text-champagne-700 mb-0.5">{order.orderNumber}</div>
                  <div className="text-xs text-obsidian/50 font-body">{order.items?.length} items</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-base text-obsidian">₹{Number(order.totalAmount).toLocaleString('en-IN')}</div>
                  <div className="text-xs font-body text-obsidian/40">{order.status}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
