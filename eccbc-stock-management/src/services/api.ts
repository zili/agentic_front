import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Configuration de l'API
const API_BASE_URL = 'http://n8n.xandys.xyz:8000';

// Types pour l'authentification
export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

// Types pour les produits
export interface Product {
  id: number;
  code: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  category_id: number;
  unit_type: string;
  unit_size?: string;
  units_per_case: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithStock extends Product {
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
}

// Types pour les commandes
export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string;
}

export interface OrderCreate {
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  notes?: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// Types pour le stock
export interface StockUpdate {
  quantity: number;
  reserved_quantity?: number;
  notes?: string;
}

export interface StockCheck {
  product_id: number;
  available: boolean;
  quantity: number;
  product_name: string;
  product_name_local?: string;
}

// Classe principale pour l'API
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          this.logout();
        }
        return Promise.reject(error);
      }
    );

    // Récupérer le token depuis le localStorage au démarrage
    this.token = localStorage.getItem('auth_token');
  }

  // Méthodes d'authentification
  async login(credentials: UserLogin): Promise<Token> {
    try {
      const response: AxiosResponse<Token> = await this.api.post('/api/auth/login', credentials);
      this.token = response.data.access_token;
      localStorage.setItem('auth_token', this.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response: AxiosResponse<UserResponse> = await this.api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyToken(): Promise<{ valid: boolean; username?: string }> {
    try {
      const response = await this.api.post('/api/auth/verify');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Méthodes pour les produits
  async getProducts(activeOnly: boolean = true): Promise<ProductWithStock[]> {
    try {
      const response: AxiosResponse<ProductWithStock[]> = await this.api.get('/api/products', {
        params: { active_only: activeOnly }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(productId: number): Promise<ProductWithStock> {
    try {
      const response: AxiosResponse<ProductWithStock> = await this.api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchProducts(searchTerm: string, language: string = 'fr'): Promise<ProductWithStock[]> {
    try {
      const response: AxiosResponse<ProductWithStock[]> = await this.api.get(`/api/products/search/${searchTerm}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Méthodes pour le stock
  async checkStock(productId: number, language: string = 'fr'): Promise<StockCheck> {
    try {
      const response: AxiosResponse<StockCheck> = await this.api.get(`/api/stock/check/${productId}`, {
        params: { language }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStock(productId: number, stockUpdate: StockUpdate): Promise<void> {
    try {
      await this.api.put(`/api/stock/${productId}`, stockUpdate);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Méthodes pour les commandes
  async createOrder(order: OrderCreate): Promise<Order> {
    try {
      const response: AxiosResponse<Order> = await this.api.post('/api/orders', order);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllOrders(limit: number = 50): Promise<Order[]> {
    try {
      const response: AxiosResponse<Order[]> = await this.api.get('/api/orders/all', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomerOrders(customerPhone: string, limit: number = 10): Promise<Order[]> {
    try {
      const response: AxiosResponse<Order[]> = await this.api.get(`/api/orders/${customerPhone}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Méthode de santé
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get('/api/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Getters
  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Méthode utilitaire pour gérer les erreurs
  private handleError(error: any): Error {
    if (error.response) {
      // Erreur de réponse du serveur
      const message = error.response.data?.detail || error.response.data?.message || 'Erreur serveur';
      return new Error(message);
    } else if (error.request) {
      // Erreur de réseau
      return new Error('Erreur de connexion au serveur');
    } else {
      // Autre erreur
      return new Error(error.message || 'Erreur inconnue');
    }
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;
