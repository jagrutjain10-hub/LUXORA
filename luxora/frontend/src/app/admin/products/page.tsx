'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, X, Search, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    name: '', description: '', sku: '', price: '', discountPrice: '',
    categoryId: '', stockQty: '', material: '', isFeatured: false, isBestSeller: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?search=${search}&limit=200`);
      setProducts(data.data?.products ?? []);
    } catch { } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data ?? []);
    } catch { }
  };

  useEffect(() => { fetchProducts(); }, [search]);
  useEffect(() => { fetchCategories(); }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', sku: '', price: '', discountPrice: '', categoryId: '', stockQty: '', material: '', isFeatured: false, isBestSeller: false });
    setImages([]);
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name: product.name, description: product.description, sku: product.sku,
      price: product.price, discountPrice: product.discountPrice ?? '',
      categoryId: product.categoryId, stockQty: product.stockQty,
      material: product.material ?? '', isFeatured: product.isFeatured, isBestSeller: product.isBestSeller,
    });
    setImages(product.images?.map((i: any) => i.url) ?? []);
    setShowModal(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(data.data.url);
      }
      setImages(prev => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.sku || !form.price || !form.categoryId || !form.stockQty) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stockQty: Number(form.stockQty),
        images: images.map((url, i) => ({ url, isPrimary: i === 0 })),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-champagne-600 font-body mb-0.5">Catalog</p>
          <h1 className="font-display text-2xl sm:text-3xl text-obsidian font-light">Products</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 bg-obsidian text-ivory px-3 sm:px-5 py-2.5 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors whitespace-nowrap">
          <Plus size={14} /> <span className="hidden sm:inline">Add</span> Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-sand-200 p-3 sm:p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-2.5 border border-sand-200 text-sm font-body focus:outline-none focus:border-champagne-400"
          />
        </div>
        <span className="text-xs font-mono text-obsidian/40 whitespace-nowrap">{products.length} products</span>
      </div>

      {/* Table - scrollable on mobile */}
      <div className="bg-white border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full" style={{ minWidth: 600 }}>
            <thead>
              <tr className="bg-ivory-50 border-b border-sand-100">
                {['Image', 'Product', 'SKU', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} className="px-3 sm:px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-sand-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-3 sm:px-5 py-4"><div className="h-4 bg-sand-100 animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-obsidian/40 font-body">
                    No products yet. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : products.map((product: any) => (
                <tr key={product.id} className="border-t border-sand-100 hover:bg-ivory-50 transition-colors">
                  <td className="px-3 sm:px-5 py-3">
                    <div className="w-10 h-10 bg-ivory-100 flex-shrink-0">
                      {product.images?.[0]?.url
                        ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-sand-400" /></div>
                      }
                    </div>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <div className="text-sm font-body text-obsidian font-medium max-w-[140px] truncate">{product.name}</div>
                  </td>
                  <td className="px-3 sm:px-5 py-3 font-mono text-xs text-obsidian/50 whitespace-nowrap">{product.sku}</td>
                  <td className="px-3 sm:px-5 py-3 text-xs font-body text-obsidian/60 whitespace-nowrap">{product.category?.name}</td>
                  <td className="px-3 sm:px-5 py-3 whitespace-nowrap">
                    <div className="font-display text-base text-obsidian">₹{Number(product.price).toLocaleString('en-IN')}</div>
                    {product.discountPrice && <div className="text-xs text-champagne-600">₹{Number(product.discountPrice).toLocaleString('en-IN')}</div>}
                  </td>
                  <td className="px-3 sm:px-5 py-3 whitespace-nowrap">
                    <span className={`text-xs font-mono px-2 py-1 ${product.stockQty === 0 ? 'bg-red-50 text-red-600' : product.stockQty <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                      {product.stockQty === 0 ? 'Out' : `${product.stockQty}`}
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-obsidian border border-transparent hover:border-sand-200 transition-all">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)} className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-red-500 border border-transparent hover:border-red-200 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal - full screen on mobile */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-start sm:justify-end">
          <div className="fixed inset-0 bg-obsidian/50" onClick={() => setShowModal(false)} />
          <div className="relative w-full sm:w-[90vw] sm:max-w-xl h-full bg-white shadow-xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-sand-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="font-display text-lg sm:text-xl text-obsidian">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-obsidian/40 hover:text-obsidian w-9 h-9 flex items-center justify-center">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
              {/* Images */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/50 font-body mb-2">Images</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square bg-ivory-100 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute top-0.5 left-0.5 bg-champagne-500 text-obsidian text-[9px] px-1">MAIN</div>}
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-obsidian/80 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-sand-300 hover:border-champagne-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload size={16} className="text-obsidian/30 mb-1" />
                    <span className="text-[10px] text-obsidian/40 font-body">{uploading ? '...' : 'Add'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files)} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Golden Crystal Chandelier" className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400" />
              </div>

              {/* SKU + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body text-obsidian/60 mb-1.5">SKU *</label>
                  <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="NL-001" className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400" />
                </div>
                <div>
                  <label className="block text-xs font-body text-obsidian/60 mb-1.5">Category *</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400 bg-transparent">
                    <option value="">Select...</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Product description..." className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400 resize-none" />
              </div>

              {/* Price + Sale + Stock */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Price (₹) *', key: 'price', placeholder: '12999' },
                  { label: 'Sale Price', key: 'discountPrice', placeholder: '9999' },
                  { label: 'Stock *', key: 'stockQty', placeholder: '10' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-body text-obsidian/60 mb-1.5">{label}</label>
                    <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400" />
                  </div>
                ))}
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-1.5">Material</label>
                <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="e.g. Crystal, Metal" className="w-full border border-sand-200 px-3 py-2.5 text-sm font-body focus:outline-none focus:border-champagne-400" />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                {[{ key: 'isFeatured', label: 'Featured' }, { key: 'isBestSeller', label: 'Best Seller' }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} className="accent-champagne-500 w-4 h-4" />
                    <span className="text-sm font-body text-obsidian/70">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-sand-200 px-4 sm:px-6 py-4 flex gap-3 flex-shrink-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-sand-200 text-obsidian px-4 py-3 text-xs uppercase tracking-widest font-body hover:bg-ivory-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-obsidian text-ivory px-4 py-3 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-obsidian/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-xs w-full">
            <AlertTriangle size={22} className="text-amber-500 mb-3" />
            <h3 className="font-display text-lg text-obsidian mb-2">Delete Product?</h3>
            <p className="text-sm text-obsidian/60 font-body mb-5">This will deactivate the product.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-sand-200 text-obsidian px-4 py-2.5 text-xs uppercase tracking-widest font-body">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white px-4 py-2.5 text-xs uppercase tracking-widest font-body hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
