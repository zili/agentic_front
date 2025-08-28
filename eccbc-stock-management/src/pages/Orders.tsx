import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Eye, 
  Search,
  Phone,
  User,
  Calendar,
  Package,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { productsApi, ordersApi } from '../lib/api';
import type { Order } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
      
      let ordersResponse;
      try {
        ordersResponse = await ordersApi.getAll();
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        console.log('L\'API orders n\'est pas disponible. Vérifiez que le serveur backend est démarré sur http://localhost:8000');
        // Fallback avec des données vides si l'API n'est pas prête
        ordersResponse = { data: [] };
      }
      
      // Adapter les données de l'API
      const adaptedProducts = productsResponse.data.map((product: any) => ({
        ...product,
        id: product.id.toString(),
        stock_available: product.available_quantity || 0,
        stock_reserved: product.reserved_quantity || 0,
        stock_total: product.stock_quantity || 0
      }));
      // Products are now used inline for mapping

      // Adapter les données de l'API pour les commandes
      const adaptedOrders = ordersResponse.data.map((order: any) => ({
        id: order.id.toString(),
        order_number: order.order_number,
        created_at: order.created_at,
        customer_phone: order.customer_phone,
        customer_name: order.customer_name,
        total: parseFloat(order.total_amount) || 0, // S'assurer que c'est un nombre
        status: order.status || 'pending', // Par défaut pending si pas défini
        payment_status: order.payment_status || 'pending', // Par défaut pending si pas défini
        items: order.items ? order.items.filter((item: any) => item.id).map((item: any) => ({
          id: item.id.toString(),
          product_id: item.product_id.toString(),
          product: adaptedProducts.find((p: any) => p.id === item.product_id.toString()) || {
            id: item.product_id.toString(),
            name: item.product_name || 'Produit inconnu',
            code: '',
            price: item.unit_price,
            stock_available: 0,
            stock_reserved: 0,
            stock_total: 0,
            created_at: '',
            updated_at: ''
          },
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price) || 0,
          total_price: parseFloat(item.total_price) || 0
        })) : [],
        updated_at: order.updated_at
      }));
      
      setOrders(adaptedOrders);
      setFilteredOrders(adaptedOrders);

    } catch (error) {
      console.error('Error fetching orders data:', error);
    } finally {
      setLoading(false);
    }
  };



  const getOrderStats = () => {
    const total = orders.length;
    const revenue = orders.reduce((sum, o) => {
      const orderTotal = typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0;
      return sum + orderTotal;
    }, 0);

    return { total, revenue };
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
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="coca-shadow rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Commandes</p>
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
          <Card className="coca-shadow rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                                      <p className="text-xl font-bold text-coca-red">{stats.revenue.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</p>
                </div>
                <div className="w-8 h-8 bg-coca-red rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">د.م</span>
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
        <Card className="coca-shadow rounded-2xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro de commande, téléphone ou nom client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
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
        <Card className="coca-shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Commandes</CardTitle>
            <CardDescription>
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="rounded-xl overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut Paiement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
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
                          {order.total.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.payment_status === 'paid' ? 'Payé' : 'Pending'}
                        </span>
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
                          className="text-coca-red hover:text-coca-red/80 rounded-xl"
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
                  {searchTerm ? 'Essayez de modifier votre recherche' : 'Vérifiez que le serveur backend est démarré sur http://localhost:8000'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  L'API Swagger fonctionne - les commandes s'afficheront une fois la connexion établie
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
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-coca-black mb-2">Informations de la commande</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Numéro:</span> {selectedOrder.order_number}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                    <p><span className="font-medium">Statut Paiement:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedOrder.payment_status === 'paid' ? 'Payé' : 'Pending'}
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
                  {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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
                        <p className="font-medium">{item.quantity} × {item.unit_price.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</p>
                        <p className="text-lg font-bold text-coca-red">{item.total_price.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Aucun article dans cette commande</p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-coca-black">Total de la commande</span>
                  <span className="text-2xl font-bold text-coca-red">{(selectedOrder.total || 0).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowOrderModal(false)} className="rounded-xl">
                  Fermer
                </Button>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
