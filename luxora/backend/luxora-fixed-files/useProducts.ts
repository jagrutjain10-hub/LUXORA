import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, orderApi, adminApi, authApi, categoryApi } from '@/lib/api';
import { useAuthStore } from '@/store/wishlist.store';
import toast from 'react-hot-toast';

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoryApi.list();
      return data.data as Array<{
        id: string; name: string; slug: string; description?: string;
        imageUrl?: string; sortOrder: number; _count: { products: number };
      }>;
    },
    staleTime: 5 * 60_000,
  });
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export function useProducts(params: Record<string, any>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productApi.list(params);
      return data.data as { products: any[]; pagination: any };
    },
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await productApi.get(slug);
      return data.data;
    },
    staleTime: 120_000,
  });
}

export function useFeaturedProducts() {
  return useProducts({ featured: 'true', limit: 8 });
}

export function useBestSellers() {
  return useProducts({ bestSeller: 'true', limit: 8 });
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export function useOrders(params?: any) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const { data } = await orderApi.list(params);
      return data.data;
    },
    enabled: !!user,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await orderApi.get(id);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useAdminOrders(params?: any) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: async () => {
      const { data } = await orderApi.adminList(params);
      return data.data;
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, trackingNumber }: any) =>
      orderApi.updateStatus(id, status, trackingNumber),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
  });
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await adminApi.dashboard();
      return data.data;
    },
    refetchInterval: 5 * 60_000, // Refresh every 5 minutes
  });
}

export function useAdminProducts(params?: any) {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: async () => {
      const { data } = await productApi.list({ ...params, limit: 20 });
      return data.data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => productApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated');
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data: { email: string; password: string; rememberMe?: boolean }) =>
      authApi.login(data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.firstName}!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Login failed');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: () => {
      toast.success('Account created! Please check your email to verify.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Registration failed');
    },
  });
}
