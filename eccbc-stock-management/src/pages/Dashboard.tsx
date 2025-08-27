import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Warehouse, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { Product, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  total_products: number;
  total_stock: number;
  recent_orders: number;
  low_stock_products: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demo purposes (since no backend is running)
        const mockProducts: Product[] = [
          { id: '1', name: 'Coca-Cola 33cl', code: 'CC33', price: 15, stock_total: 150, stock_available: 120, stock_reserved: 30, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: '2', name: 'Fanta Orange 33cl', code: 'FO33', price: 12, stock_total: 100, stock_available: 85, stock_reserved: 15, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
          { id: '3', name: 'Sprite 33cl', code: 'SP33', price: 12, stock_total: 80, stock_available: 5, stock_reserved: 75, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        ];

        const mockOrders: Order[] = [
          { id: '1', order_number: 'CMD001', customer_phone: '0612345678', total: 2450, status: 'confirmed', items: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '2', order_number: 'CMD002', customer_phone: '0687654321', total: 890, status: 'pending', items: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '3', order_number: 'CMD003', customer_phone: '0698765432', total: 5200, status: 'delivered', items: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ];

        // Calculate stats
        const totalProducts = mockProducts.length;
        const totalStock = mockProducts.reduce((sum, p) => sum + p.stock_total, 0);
        const recentOrdersCount = mockOrders.length;
        const lowStock = mockProducts.filter(p => p.stock_available < 10);

        setStats({
          total_products: totalProducts,
          total_stock: totalStock,
          recent_orders: recentOrdersCount,
          low_stock_products: lowStock.length
        });

        setLowStockProducts(lowStock);
        setRecentOrders(mockOrders);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample data for charts
  const stockData = [
    { name: 'Coca-Cola 33cl', stock: 150, reserved: 20 },
    { name: 'Fanta Orange 33cl', stock: 120, reserved: 15 },
    { name: 'Sprite 33cl', stock: 80, reserved: 10 },
    { name: 'Coca-Cola 1.5L', stock: 60, reserved: 8 },
    { name: 'Fanta Orange 1.5L', stock: 45, reserved: 5 },
  ];

  const pieData = [
    { name: 'En stock', value: 85, color: '#22C55E' },
    { name: 'Stock faible', value: 10, color: '#F59E0B' },
    { name: 'Rupture', value: 5, color: '#E50914' },
  ];

  const statCards = [
    {
      title: 'Produits Actifs',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Stock Total',
      value: stats?.total_stock || 0,
      icon: Warehouse,
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      title: 'Commandes (7j)',
      value: stats?.recent_orders || 0,
      icon: ShoppingCart,
      color: 'bg-red-600',
      change: '+8%'
    },
    {
      title: 'Stock Critique',
      value: stats?.low_stock_products || 0,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '-2'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité ECCBC</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity size={16} />
          <span>Mis à jour il y a 2 minutes</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" />
                    {card.change} vs mois dernier
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Diagrams Section */}
      <div className="grid grid-cols-3 gap-8">
        {/* 1. Répartition Stock (Pie Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="animate-fade-in"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Répartition Stock</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#dc2626" strokeWidth="8" 
                    strokeDasharray="110.4 251.2" strokeDashoffset="0"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="8" 
                    strokeDasharray="80.4 251.2" strokeDashoffset="-110.4"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fca5a5" strokeWidth="8" 
                    strokeDasharray="60.4 251.2" strokeDashoffset="-190.8"/>
                </svg>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-800"></div>
                  <span className="text-sm text-gray-600">Coca-Cola (44%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-sm text-gray-600">Fanta (32%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-600">Sprite (24%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. État des Commandes (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="animate-fade-in"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">État des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                {/* Grid background */}
                <div className="absolute inset-0 grid grid-rows-5 opacity-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-gray-300"></div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {/* Bars */}
                <div className="h-full flex items-end justify-around px-4 pt-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-red-800 w-12 h-20 rounded-t transition-all duration-500 hover:shadow-lg relative group">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        85
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">Livrées</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-red-600 w-12 h-12 rounded-t transition-all duration-500 hover:shadow-lg relative group">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        36
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">En cours</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-red-400 w-12 h-8 rounded-t transition-all duration-500 hover:shadow-lg relative group">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        21
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">En attente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Performance Mensuelle (Progress Bars) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="animate-fade-in"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performance Mensuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Ventes</span>
                    <span className="text-sm font-semibold text-red-800">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-800 to-red-700 h-2 rounded-full transition-all duration-500" style={{width: '87%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Rotation Stock</span>
                    <span className="text-sm font-semibold text-red-600">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-500" style={{width: '72%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Livraisons</span>
                    <span className="text-sm font-semibold text-red-500">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-500" style={{width: '94%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <span className="text-sm font-semibold text-red-400">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-400 to-red-300 h-2 rounded-full transition-all duration-500" style={{width: '89%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-red-600" />
                <span>Commandes Récentes</span>
              </CardTitle>
              <CardDescription>
                Dernières commandes passées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{order.total.toLocaleString()} FCFA</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Stock Critique</span>
              </CardTitle>
              <CardDescription>
                Produits nécessitant un réapprovisionnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-green-600 text-center py-4">
                    Aucun produit en stock critique ! 🎉
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Code: {product.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{product.stock_available} unités</p>
                        <p className="text-xs text-gray-500">Seuil: 10 unités</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
