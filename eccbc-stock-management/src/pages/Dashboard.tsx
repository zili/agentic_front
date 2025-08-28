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
import { productsApi, ordersApi } from '../lib/api';
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
        
        // Récupérer les produits depuis l'API
        const productsResponse = await productsApi.getAll();
        // Adapter les données de l'API
        const products = productsResponse.data.map((product: any) => ({
          ...product,
          id: product.id.toString(),
          stock_available: product.available_quantity || 0,
          stock_reserved: product.reserved_quantity || 0,
          stock_total: product.stock_quantity || 0
        }));

        // Essayer de récupérer les vraies commandes, sinon utiliser des données vides
        let ordersData = [];
        try {
          const ordersResponse = await ordersApi.getAll();
          ordersData = ordersResponse.data.slice(0, 3); // Prendre les 3 dernières commandes
        } catch (error) {
          console.error('Impossible de récupérer les commandes:', error);
          // Pas de commandes pour le moment
        }
        
        const recentOrders = ordersData.map((order: any) => ({
          id: order.id?.toString() || Math.random().toString(),
          order_number: order.order_number || 'N/A',
          customer_phone: order.customer_phone || 'N/A',
          total: parseFloat(order.total_amount) || 0, // S'assurer que c'est un nombre
          items: [],
          created_at: order.created_at || new Date().toISOString(),
          updated_at: order.updated_at || new Date().toISOString()
        }));

        // Calculer les statistiques depuis les vraies données
        const totalProducts = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.stock_total, 0);
        const recentOrdersCount = recentOrders.length;
        const lowStock = products.filter(p => p.stock_available < 10);

        setStats({
          total_products: totalProducts,
          total_stock: totalStock,
          recent_orders: recentOrdersCount,
          low_stock_products: lowStock.length
        });

        setLowStockProducts(lowStock);
        setRecentOrders(recentOrders);
        
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
      title: 'Stock Total',
      value: stats?.total_stock || 0,
      icon: Warehouse,
      color: 'bg-red-600',
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
      color: 'bg-red-600',
      change: '-2'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer rounded-3xl ${
                index === 2 ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-50'
              }`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-base font-semibold ${
                    index === 2 ? 'text-white' : 'text-gray-600'
                  }`}>
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${
                    index === 2 ? 'bg-white bg-opacity-20' : card.color
                  }`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    index === 2 ? 'text-white' : 'text-gray-900'
                  }`}>
                    {card.value.toLocaleString()}
                  </div>
                  <p className={`text-xs flex items-center mt-1 ${
                    index === 2 ? 'text-white opacity-90' : 'text-green-600'
                  }`}>
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
          <Card className="shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Répartition Stock</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8 -mt-4">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-50 to-red-100 opacity-20"></div>
                <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#991b1b", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#dc2626", stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#dc2626", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#ef4444", stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#ef4444", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#fca5a5", stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#grad1)" strokeWidth="10" 
                    strokeDasharray="96.8 219.8" strokeDashoffset="0" strokeLinecap="round"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#grad2)" strokeWidth="10" 
                    strokeDasharray="70.3 219.8" strokeDashoffset="-96.8" strokeLinecap="round"/>
                  <circle cx="50" cy="50" r="35" fill="none" stroke="url(#grad3)" strokeWidth="10" 
                    strokeDasharray="52.7 219.8" strokeDashoffset="-167.1" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-800">330</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
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
          <Card className="shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">État des Commandes</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="relative h-40">
                {/* Grid background */}
                <div className="absolute inset-0 grid grid-rows-5 opacity-10">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-gray-400"></div>
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pt-4 pb-9">
                  <span className="transform -translate-y-1">100</span>
                  <span className="transform -translate-y-1">75</span>
                  <span className="transform -translate-y-1">50</span>
                  <span className="transform -translate-y-1">25</span>
                  <span className="transform translate-y-1">0</span>
                </div>
                
                {/* Bars with improved design */}
                <div className="h-full flex items-end justify-center space-x-8 px-8 pt-4 pb-6">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="bg-gradient-to-t from-red-800 to-red-700 w-16 h-24 rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-t-lg"></div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
                        <span className="font-semibold">65</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-800"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Livrées</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="bg-gradient-to-t from-red-600 to-red-500 w-16 h-16 rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-t-lg"></div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
                        <span className="font-semibold">36</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-600"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">En cours</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="bg-gradient-to-t from-red-400 to-red-300 w-16 h-10 rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-t-lg"></div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-400 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
                        <span className="font-semibold">21</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-400"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">En attente</span>
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
          <Card className="shadow-lg rounded-3xl">
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
          <Card className="shadow-lg rounded-3xl">
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
                      <p className="font-bold text-red-600">{order.total.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</p>

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
          <Card className="shadow-lg border-orange-200 rounded-3xl">
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
