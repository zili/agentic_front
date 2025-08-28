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
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  created_at: string;
  updated_at: string;
  // Propriétés calculées pour la compatibilité
  stock_available?: number;
  stock_reserved?: number;
  stock_total?: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_phone: string;
  customer_name?: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'pending';
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product: Product;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  created_at: string;
  created_by?: string;
}

export interface DashboardStats {
  total_products: number;
  total_stock: number;
  recent_orders: number;
  low_stock_products: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}
