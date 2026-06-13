import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/wishlist.store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach access token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access store directly (outside React context)
  const token = (useAuthStore.getState() as any).accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401 with token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: Error) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.data.accessToken;

        // Update store
        (useAuthStore.setState as any)((state: any) => ({ ...state, accessToken: newToken }));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Clear auth state
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login?session=expired';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── TYPED API METHODS ────────────────────────────────────────────────────────

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  get: (slug: string) => api.get(`/categories/${slug}`),
};

export const productApi = {
  list: (params: Record<string, any>) => api.get('/products', { params }),
  get: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  bulkCreate: (products: any[]) => api.post('/products/bulk', { products }),
};

export const cartApi = {
  get: () => api.get('/cart'),
  sync: (items: any[]) => api.post('/cart/sync', { items }),
  clear: () => api.delete('/cart'),
};

export const orderApi = {
  create: (data: any) => api.post('/orders', data),
  list: (params?: any) => api.get('/orders/my', { params }),
  get: (id: string) => api.get(`/orders/my/${id}`),
  adminList: (params?: any) => api.get('/orders', { params }),
  updateStatus: (id: string, status: string, trackingNumber?: string) =>
    api.patch(`/orders/${id}/status`, { status, trackingNumber }),
  export: () => api.get('/orders/export', { responseType: 'blob' }),
};

export const paymentApi = {
  createRazorpayOrder: (orderId: string) => api.post('/payments/razorpay/create', { orderId }),
  verify: (data: any) => api.post('/payments/razorpay/verify', data),
};

export const reviewApi = {
  create: (productId: string, data: any) => api.post(`/reviews/${productId}`, data),
  list: (productId: string) => api.get(`/reviews/${productId}`),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  inventoryAlerts: () => api.get('/admin/inventory-alerts'),
  customers: (params?: any) => api.get('/admin/customers', { params }),
};

export const uploadApi = {
  image: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  images: (files: File[]) => {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
