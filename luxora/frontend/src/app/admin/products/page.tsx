'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, X, Search, AlertTriangle } from 'lucide-react';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { uploadApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Wall Decor', id: 'wall-decor' },
  { name: 'Decorative Lights', id: 'decorative-lights' },
  { name: 'Luxury Vases', id: 'luxury-vases' },
  { name: 'Sculptures', id: 'sculptures' },
  { name: 'Table Decor', id: 'table-decor' },
  { name: 'Mirrors', id: 'mirrors' },
  { name: 'Premium Accessories', id: 'premium-accessories' },
];

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDesc: z.string().max(150).optional(),
  sku: z.string().min(3, 'SKU required'),
  price: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().optional().nullable(),
  categoryId: z.string().min(1, 'Category required'),
  stockQty: z.coerce.number().int().min(0),
  material: z.string().optional(),
  weight: z.coerce.number().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────

function ImageUploader({ images, onImagesChange }: {
  images: string[];
  onImagesChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const { data } = await uploadApi.image(file);
        uploadedUrls.push(data.data.url);
      }
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square bg-ivory-100 group">
            <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <div className="absolute top-1 left-1 bg-champagne-500 text-obsidian text-[10px] px-1.5 py-0.5 font-mono">
                MAIN
              </div>
            )}
            <button
              type="button"
              onClick={() => onImagesChange(images.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 w-6 h-6 bg-obsidian/80 text-ivory flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Upload slot */}
        <label className={cn(
          'aspect-square border-2 border-dashed flex flex-col items-center justify-center cursor-pointer',
          'border-sand-300 hover:border-champagne-400 transition-colors',
          uploading && 'opacity-50 pointer-events-none'
        )}>
          {uploading ? (
            <div className="text-xs text-obsidian/40 font-body text-center px-2">Uploading...</div>
          ) : (
            <>
              <Upload size={18} className="text-obsidian/30 mb-2" />
              <span className="text-xs text-obsidian/40 font-body text-center px-2">Add Images</span>
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </label>
      </div>
      <p className="text-xs text-obsidian/40 font-body">First image will be the main product image. Drag to reorder.</p>
    </div>
  );
}

// ─── PRODUCT FORM MODAL ───────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
}: {
  product?: any;
  onClose: () => void;
}) {
  const [images, setImages] = useState<string[]>(product?.images?.map((i: any) => i.url) ?? []);
  const isEditing = !!product;

  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      shortDesc: product.shortDesc ?? '',
      sku: product.sku,
      price: product.price,
      discountPrice: product.discountPrice,
      categoryId: product.categoryId,
      stockQty: product.stockQty,
      material: product.material ?? '',
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
    } : { isFeatured: false, isBestSeller: false, stockQty: 0 },
  });

  const onSubmit = (data: ProductFormData) => {
    const payload = { ...data, images: images.map((url, i) => ({ url, isPrimary: i === 0 })) };

    if (isEditing) {
      updateProduct({ id: product.id, ...payload }, { onSuccess: onClose });
    } else {
      createProduct(payload, { onSuccess: onClose });
    }
  };

  const price = watch('price');
  const discountPrice = watch('discountPrice');
  const discount = discountPrice && price ? Math.round(((price - discountPrice) / price) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-obsidian/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl h-screen bg-white shadow-luxury-lg overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-sand-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-obsidian font-medium">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-obsidian/40 font-body mt-0.5">
              {isEditing ? `Editing: ${product.name}` : 'Fill in product details below'}
            </p>
          </div>
          <button onClick={onClose} className="text-obsidian/40 hover:text-obsidian transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">
          {/* Images */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-obsidian/50 font-body mb-3">
              Product Images
            </label>
            <ImageUploader images={images} onImagesChange={setImages} />
          </div>

          {/* Basic Info */}
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-obsidian/40 font-body border-b border-sand-100 pb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-xs font-body text-obsidian/60 mb-2">Product Name *</label>
                <input {...register('name')} className="input-luxury w-full" placeholder="e.g. Golden Hour Vase" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">SKU *</label>
                <input {...register('sku')} className="input-luxury" placeholder="LXR-VAS-001" />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Category *</label>
                <select {...register('categoryId')} className="input-luxury bg-transparent">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-body text-obsidian/60 mb-2">Short Description</label>
              <input {...register('shortDesc')} className="input-luxury" placeholder="Brief tagline (max 150 chars)" />
            </div>

            <div>
              <label className="block text-xs font-body text-obsidian/60 mb-2">Full Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className="input-luxury resize-none w-full"
                placeholder="Detailed product description..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-obsidian/40 font-body border-b border-sand-100 pb-3">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Price (₹) *</label>
                <input {...register('price')} type="number" step="0.01" className="input-luxury" placeholder="12999" />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">
                  Sale Price (₹)
                  {discount && <span className="ml-2 text-champagne-600">{discount}% off</span>}
                </label>
                <input {...register('discountPrice')} type="number" step="0.01" className="input-luxury" placeholder="9999" />
              </div>

              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Stock Qty *</label>
                <input {...register('stockQty')} type="number" className="input-luxury" placeholder="50" />
                {errors.stockQty && <p className="text-red-500 text-xs mt-1">{errors.stockQty.message}</p>}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-obsidian/40 font-body border-b border-sand-100 pb-3">
              Additional Details
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Material</label>
                <input {...register('material')} className="input-luxury" placeholder="e.g. Marble, Brass" />
              </div>
              <div>
                <label className="block text-xs font-body text-obsidian/60 mb-2">Weight (kg)</label>
                <input {...register('weight')} type="number" step="0.1" className="input-luxury" placeholder="1.2" />
              </div>
            </div>

            {/* Flags */}
            <div className="flex gap-6">
              {[
                { name: 'isFeatured' as const, label: 'Featured Product' },
                { name: 'isBestSeller' as const, label: 'Best Seller' },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" {...register(name)} className="accent-champagne-500 w-4 h-4" />
                  <span className="text-sm font-body text-obsidian/70 group-hover:text-obsidian transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-obsidian/40 font-body border-b border-sand-100 pb-3">
              SEO (Optional)
            </h3>
            <div>
              <label className="block text-xs font-body text-obsidian/60 mb-2">Meta Title</label>
              <input {...register('metaTitle')} className="input-luxury" placeholder="SEO title" />
            </div>
            <div>
              <label className="block text-xs font-body text-obsidian/60 mb-2">Meta Description</label>
              <input {...register('metaDescription')} className="input-luxury" placeholder="SEO description (160 chars)" />
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white border-t border-sand-200 -mx-8 px-8 py-5 flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || updating}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {creating || updating ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── ADMIN PRODUCTS PAGE ──────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminProducts({ search, page });
  const { mutate: deleteProduct } = useDeleteProduct();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="label-gold text-champagne-500 mb-1">Catalog</div>
          <h1 className="font-display text-display-sm text-obsidian font-light">Products</h1>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-sand-200 p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian/30" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-sand-200 text-sm font-body focus:outline-none focus:border-champagne-400"
          />
        </div>
        {data && (
          <span className="text-xs font-mono text-obsidian/40">
            {data.pagination.total} products
          </span>
        )}
      </div>

      {/* Products Table */}
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
              <th className="px-5 py-3 text-left text-xs font-body uppercase tracking-wider text-obsidian/50">Status</th>
              <th className="px-5 py-3 text-right text-xs font-body uppercase tracking-wider text-obsidian/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-sand-100">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 skeleton" /></td>
                  ))}
                </tr>
              ))
            ) : data?.products?.map((product: any) => (
              <tr key={product.id} className="border-t border-sand-100 hover:bg-ivory-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="w-12 h-12 bg-ivory-100 flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={16} className="text-sand-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-body text-obsidian font-medium max-w-[200px] truncate">{product.name}</div>
                  {product.isFeatured && <span className="text-xs text-champagne-600">Featured</span>}
                  {product.isBestSeller && <span className="text-xs text-champagne-600 ml-2">Best Seller</span>}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-obsidian/50">{product.sku}</td>
                <td className="px-5 py-4 text-sm font-body text-obsidian/60">{product.category?.name}</td>
                <td className="px-5 py-4">
                  <div className="font-display text-base text-obsidian">₹{Number(product.price).toLocaleString('en-IN')}</div>
                  {product.discountPrice && (
                    <div className="text-xs text-champagne-600 font-mono">
                      ₹{Number(product.discountPrice).toLocaleString('en-IN')}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={cn(
                    'text-xs font-mono px-2 py-1',
                    product.stockQty === 0 ? 'bg-red-50 text-red-600'
                      : product.stockQty <= 5 ? 'bg-amber-50 text-amber-700'
                      : 'bg-green-50 text-green-700'
                  )}>
                    {product.stockQty === 0 ? 'Out of Stock' : `${product.stockQty} left`}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn(
                    'text-xs px-2 py-1',
                    product.isActive ? 'bg-green-50 text-green-700' : 'bg-sand-100 text-obsidian/40'
                  )}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditProduct(product); setShowModal(true); }}
                      className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-obsidian border border-transparent hover:border-sand-200 transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="w-8 h-8 flex items-center justify-center text-obsidian/40 hover:text-red-500 border border-transparent hover:border-red-200 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editProduct}
            onClose={() => { setShowModal(false); setEditProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 max-w-sm w-full"
            >
              <AlertTriangle size={24} className="text-amber-500 mb-4" />
              <h3 className="font-display text-xl text-obsidian mb-2">Delete Product?</h3>
              <p className="text-sm text-obsidian/60 font-body mb-6">
                This will deactivate the product. Existing order items won't be affected.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => {
                    deleteProduct(deleteConfirm);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-6 py-3 text-sm font-body uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
