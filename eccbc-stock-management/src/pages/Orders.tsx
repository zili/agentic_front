 
 import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  X, 
  ShoppingCart,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { apiService } from '../services/api';
import type { Order } from '../types';


const Orders: React.FC = () => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calculer les statistiques
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = parseFloat(order.total?.toString() || '0');
    return sum + orderTotal;
  }, 0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orders = await apiService.getAllOrders();
      
      // Adapter les données de l'API au format frontend
      const adaptedOrders = orders.map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_phone: order.customer_phone,
        customer_name: order.customer_name,
        total: order.total_amount,
        payment_status: order.payment_status || 'pending',
        created_at: order.created_at,
        items: order.items || []
      }));
      
              setOrders(adaptedOrders as any);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
      <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commandes
          </h1>
          <p className="text-gray-600">
            Gestion des commandes
          </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl coca-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Commandes
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalOrders}
                </p>
              </div>
                             <div className="p-3 bg-blue-100 rounded-xl">
                 <ShoppingCart className="h-6 w-6 text-blue-600" />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl coca-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Revenus
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(totalRevenue)} MAD
                </p>
              </div>
                             <div className="p-3 bg-green-100 rounded-xl">
                 <DollarSign className="h-6 w-6 text-green-600" />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl coca-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des commandes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="rounded-2xl coca-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Liste des Commandes
          </CardTitle>
          <p className="text-sm text-gray-600">
            {filteredOrders.length} commandes
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro de Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date de Création</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut de Paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(parseFloat(order.total?.toString() || '0'))} MAD
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
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
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune commande trouvée</p>
              <p className="text-sm text-gray-400">
                {searchTerm ? 'Essayez de modifier votre recherche' : 'Aucune commande trouvée'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
                <h3 className="text-2xl font-bold text-gray-900">
                  Détails de la Commande
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
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Informations de Commande
                  </h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Numéro de Commande:</span> {selectedOrder.order_number}</p>
                    <p><span className="font-medium">Date de Création:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p><span className="font-medium">Statut de Paiement:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedOrder.payment_status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Informations Client
                  </h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Client:</span> {selectedOrder.customer_name || 'N/A'}</p>
                    <p><span className="font-medium">Téléphone:</span> {selectedOrder.customer_phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Articles de la Commande
                </h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(parseFloat(item.total_price?.toString() || '0'))} MAD
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucun produit trouvé
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Prix Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(parseFloat(selectedOrder.total?.toString() || '0'))} MAD
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-xl"
                >
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

