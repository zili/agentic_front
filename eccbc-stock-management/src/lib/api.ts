import axios from 'axios';
import { Product, Order, StockMovement, DashboardStats, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  search: (searchTerm: string) => api.get<Product[]>(`/products/search/${searchTerm}`),
  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Product>('/products', product),
  update: (id: string, product: Partial<Product>) => 
    api.put<Product>(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Stock API
export const stockApi = {
  check: (id: string) => api.get<Product>(`/stock/check/${id}`),
  update: (id: string, data: { quantity: number; movement_type: 'in' | 'out' | 'adjustment'; reason: string }) => 
    api.put<Product>(`/stock/${id}`, data),
  getMovements: (productId?: string) => 
    api.get<StockMovement[]>(`/stock/movements${productId ? `?product_id=${productId}` : ''}`),
};

// Orders API
export const ordersApi = {
  create: (order: { customer_phone: string; customer_name?: string; items: Array<{ product_id: string; quantity: number }> }) => 
    api.post<Order>('/orders', order),
  getByCustomer: (customerPhone: string) => api.get<Order[]>(`/orders/${customerPhone}`),
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/details/${id}`),
  updateStatus: (id: string, status: Order['status']) => 
    api.put<Order>(`/orders/${id}/status`, { status }),
};

// Health API
export const healthApi = {
  check: () => api.get<{ status: string; timestamp: string }>('/health'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};

export default api;
