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
import { dashboardApi, productsApi, ordersApi } from '../lib/api';
import { DashboardStats, Product, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const [productsResponse, ordersResponse] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll()
        ]);

        const products = productsResponse.data;
        const orders = ordersResponse.data;

        // Calculate stats
        const totalProducts = products.length;
        const totalStock = products.reduce((sum, p) => sum + p.stock_total, 0);
        const recentOrdersCount = orders.filter(order => {
          const orderDate = new Date(order.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        }).length;
        const lowStock = products.filter(p => p.stock_available < 10);

        setStats({
          total_products: totalProducts,
          total_stock: totalStock,
          recent_orders: recentOrdersCount,
          low_stock_products: lowStock.length
        });

        setLowStockProducts(lowStock);
        setRecentOrders(orders.slice(0, 5));
        
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
      color: 'bg-coca-red',
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
          <h1 className="text-3xl font-bold text-coca-black">Dashboard</h1>
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
              <Card className="hover:shadow-lg transition-shadow duration-300 coca-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-coca-black">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="coca-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-coca-red" />
                <span>Stock par Produit</span>
              </CardTitle>
              <CardDescription>
                Répartition du stock disponible et réservé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#E50914" name="Disponible" />
                  <Bar dataKey="reserved" fill="#FFA500" name="Réservé" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="coca-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-coca-red" />
                <span>État du Stock</span>
              </CardTitle>
              <CardDescription>
                Répartition globale de l'état des stocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
          <Card className="coca-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-coca-red" />
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
                      <p className="font-medium text-coca-black">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coca-red">{order.total.toLocaleString()} FCFA</p>
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
          <Card className="coca-shadow border-orange-200">
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
                        <p className="font-medium text-coca-black">{product.name}</p>
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
