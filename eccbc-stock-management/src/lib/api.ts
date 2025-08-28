import axios from 'axios';
// import { Product, Order, StockMovement } from '../types'; // Commented out for demo

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  search: (searchTerm: string) => api.get(`/products/search/${searchTerm}`),
  create: (product: any) => api.post('/products', product),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Stock API
export const stockApi = {
  check: (id: string) => api.get(`/stock/check/${id}`),
  update: (id: string, data: any) => api.put(`/stock/${id}`, data),
  getMovements: (productId?: string) => 
    api.get(`/stock/movements${productId ? `?product_id=${productId}` : ''}`),
};

// Orders API
export const ordersApi = {
  create: (order: any) => api.post('/orders', order),
  getByCustomer: (customerPhone: string) => api.get(`/orders/${customerPhone}`),
  getAll: () => api.get('/orders/all'),
  getById: (id: string) => api.get(`/orders/details/${id}`),
  updateStatus: (id: string, status: string) => 
    api.put(`/orders/${id}/status`, { status }),
};

// Health API
export const healthApi = {
  check: () => api.get('/health'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
