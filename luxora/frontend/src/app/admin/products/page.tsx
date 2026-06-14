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
        const { data } = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-champagne-600 font-body mb-1">Catalog</p>
          <h1 className="font-display text-3xl text-obsidian font-light">Products</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-obsidian text-ivory px-6 py-3 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="bg-white border border-sand-200 p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 border border-sand-200 text-sm font-body focus:outline-none focus:border-champagne-400" />
        </div>
        <span className="text-xs font-mono text-obsidian/40">{products.length} products</span>
      </div>

      <div className="bg-white border border-sand-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-ivory-50 border-b border-sand-100">
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50 w-16">Image</th>
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">Product</th>
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">SKU</th>
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">Category</th>
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">Price</th>
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">Stock</th>
              <th className="px-5 py-3 text-right text-xs font-body uppercase tracking-wider text-obsidian/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-sand-100">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-sand-100 animate-pulse rounded" /></td>
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
                <td className="px-5 py-4">
                  <div className="w-12 h-12 bg-ivory-100">
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-sand-400" /></div>
                    }
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-body text-obsidian font-medium max-w-[180px] truncate">{product.name}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-obsidian/50">{product.sku}</td>
                <td className="px-5 py-4 text-sm font-body text-obsidian/60">{product.category?.name}</td>
                <td className="px-5 py-4">
                  <div className="font-display text-base text-obsidian">₹{Number(product.price).toLocaleString('en-IN')}</div>
                  {product.discountPrice && <div className="text-xs text-champagne-600">₹{Number(product.discountPrice).toLocaleString('en-IN')}</div>}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-mono px-2 py-1 ${product.stockQty === 0 ? 'bg-red-50 text-red-600' : product.stockQty <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                    {product.stockQty === 0 ? 'Out of Stock' : `${product.stockQty} left`}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-obsidian border border-transparent hover:border-sand-200 transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteConfirm(product.id)} className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-red-500 border border-transparent hover:border-red-200 transition-all"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="fixed inset-0 bg-obsidian/50" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl h-screen bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-sand-200 px-8 py-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-obsidian">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-obsidian/40 hover:text-obsidian"><X size={22} /></button>
            </div>
            <div className="px-8 py-6 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-obsidian/50 font-body mb-3">Images</label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square bg-ivory-100 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <div className="absolute top-1 left-1 bg-champagne-500 text-obsidian text-[10px] px-1.5 py-0.5">MAIN</div>}
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 bg-obsidian/80 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-sand-300 hover:border-champagne-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload size={18} className="text-obsidian/30 mb-1" />
                    <span className="text-xs text-obsidian/40 font-body">{uploading ? 'Uploading...' : 'Add Images'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files)} disabled={uploading} />
                  </label>
                </div>
              </div>

              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Golden Hour Vase' },
                { label: 'SKU *', key: 'sku', placeholder: 'LXR-VAS-001' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-body text-obsidian/60 mb-2">{label}</label>
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full border border-sand-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-400" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Category *</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-sand-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-400 bg-transparent">
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Detailed product description..." className="w-full border border-sand-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-400 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Price (₹) *', key: 'price', placeholder: '12999' },
                  { label: 'Sale Price (₹)', key: 'discountPrice', placeholder: '9999' },
                  { label: 'Stock Qty *', key: 'stockQty', placeholder: '50' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-body text-obsidian/60 mb-2">{label}</label>
                    <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full border border-sand-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-400" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Material</label>
                <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="e.g. Marble, Brass" className="w-full border border-sand-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-champagne-400" />
              </div>

              <div className="flex gap-6">
                {[{ key: 'isFeatured', label: 'Featured Product' }, { key: 'isBestSeller', label: 'Best Seller' }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} className="accent-champagne-500 w-4 h-4" />
                    <span className="text-sm font-body text-obsidian/70">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-sand-200 px-8 py-5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-sand-200 text-obsidian px-6 py-3 text-xs uppercase tracking-widest font-body hover:bg-ivory-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-obsidian text-ivory px-6 py-3 text-xs uppercase tracking-widest font-body hover:bg-champagne-700 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-obsidian/50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full">
            <AlertTriangle size={24} className="text-amber-500 mb-4" />
            <h3 className="font-display text-xl text-obsidian mb-2">Delete Product?</h3>
            <p className="text-sm text-obsidian/60 font-body mb-6">This will deactivate the product. Existing orders won't be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-sand-200 text-obsidian px-6 py-3 text-xs uppercase tracking-widest font-body">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white px-6 py-3 text-xs uppercase tracking-widest font-body hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
