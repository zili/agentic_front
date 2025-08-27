import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Search,
  Phone,
  User,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ordersApi, productsApi } from '../lib/api';
import { Order, Product } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse] = await Promise.all([
        productsApi.getAll()
      ]);
      
      setProducts(productsResponse.data);

      // Mock orders for demo
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'CMD-2024-001',
          customer_phone: '+237 677 123 456',
          customer_name: 'Jean Dupont',
          status: 'pending',
          total: 2400,
          items: [
            {
              id: '1',
              product_id: '1',
              product: productsResponse.data[0],
              quantity: 4,
              unit_price: 300,
              total_price: 1200
            },
            {
              id: '2',
              product_id: '2',
              product: productsResponse.data[1],
              quantity: 4,
              unit_price: 300,
              total_price: 1200
            }
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          order_number: 'CMD-2024-002',
          customer_phone: '+237 655 987 654',
          customer_name: 'Marie Kamga',
          status: 'confirmed',
          total: 1600,
          items: [
            {
              id: '3',
              product_id: '4',
              product: productsResponse.data[3] || productsResponse.data[0],
              quantity: 2,
              unit_price: 800,
              total_price: 1600
            }
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          order_number: 'CMD-2024-003',
          customer_phone: '+237 699 456 789',
          customer_name: 'Paul Mballa',
          status: 'delivered',
          total: 900,
          items: [
            {
              id: '4',
              product_id: '3',
              product: productsResponse.data[2] || productsResponse.data[0],
              quantity: 3,
              unit_price: 300,
              total_price: 900
            }
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);

    } catch (error) {
      console.error('Error fetching orders data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          label: 'En attente',
          textColor: 'text-yellow-600'
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          label: 'Confirmée',
          textColor: 'text-blue-600'
        };
      case 'delivered':
        return { 
          icon: Truck, 
          color: 'bg-green-100 text-green-800 border-green-200', 
          label: 'Livrée',
          textColor: 'text-green-600'
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          color: 'bg-red-100 text-red-800 border-red-200', 
          label: 'Annulée',
          textColor: 'text-red-600'
        };
      default:
        return { 
          icon: Clock, 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          label: 'Inconnu',
          textColor: 'text-gray-600'
        };
    }
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    return { total, pending, confirmed, delivered, revenue };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-coca-black">Commandes</h1>
          <p className="text-gray-600 mt-2">Gérez toutes les commandes de vos clients</p>
        </div>
        <Button 
          onClick={() => setShowNewOrderModal(true)}
          className="bg-coca-red hover:bg-coca-red/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Commande
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="coca-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-coca-black">{stats.total}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-coca-red" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="coca-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="coca-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmées</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="coca-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Livrées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <Truck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="coca-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                  <p className="text-xl font-bold text-coca-red">{stats.revenue.toLocaleString()} FCFA</p>
                </div>
                <div className="w-8 h-8 bg-coca-red rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">₣</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="coca-shadow">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro de commande, téléphone ou nom client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="coca-shadow">
          <CardHeader>
            <CardTitle>Liste des Commandes</CardTitle>
            <CardDescription>
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                    >
                      <TableCell className="font-medium text-coca-black">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{order.customer_name || 'Client'}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.customer_phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Package className="h-4 w-4 mr-2 text-gray-400" />
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-coca-red text-lg">
                          {order.total.toLocaleString()} FCFA
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-coca-red hover:text-coca-red/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande trouvée</p>
                <p className="text-sm text-gray-400">
                  {searchTerm ? 'Essayez de modifier votre recherche' : 'Les nouvelles commandes apparaîtront ici'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-coca-black">
                  Détail de la commande
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-coca-black mb-2">Informations de la commande</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Numéro:</span> {selectedOrder.order_number}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                    <p>
                      <span className="font-medium">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-coca-black mb-2">Informations client</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nom:</span> {selectedOrder.customer_name || 'Non spécifié'}</p>
                    <p><span className="font-medium">Téléphone:</span> {selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-coca-black mb-4">Articles commandés</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-coca-red rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">{item.product.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity} × {item.unit_price.toLocaleString()} FCFA</p>
                        <p className="text-lg font-bold text-coca-red">{item.total_price.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-coca-black">Total de la commande</span>
                  <span className="text-2xl font-bold text-coca-red">{selectedOrder.total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowOrderModal(false)}>
                  Fermer
                </Button>
                {selectedOrder.status === 'pending' && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Confirmer la commande
                  </Button>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    Marquer comme livrée
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
