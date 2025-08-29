import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse, 
  History, 
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table.tsx';
import { apiService } from '../services/api.ts';

import type { Product, StockMovement } from '../types';

const Stock: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const products = await apiService.getProducts();
      
      // Adapter les données de l'API
      const adaptedProducts = products.map((product: any) => ({
        ...product,
        id: product.id.toString(),
        stock_available: product.available_quantity || 0,
        stock_reserved: product.reserved_quantity || 0,
        stock_total: product.stock_quantity || 0
      }));
      setProducts(adaptedProducts);

      // Les mouvements de stock seront ajoutés quand l'endpoint API sera disponible
      setStockMovements([]);

    } catch (error) {
      console.error('Erreur lors de la récupération des données de stock:', error);
      setProducts([]);
      setStockMovements([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockLevel = (product: Product) => {
    const available = product.stock_available || 0;
    const total = product.stock_total || 0;
    
    // Si moins de 10 unités disponibles : Rouge et "Faible"
         if (available < 10) return { level: 'low', color: 'bg-red-500', text: 'Faible' };
    
    // Si stock total est 0 : Rupture
         if (total === 0) return { level: 'empty', color: 'bg-red-500', text: 'Rupture' };
    
    // Calcul basé sur le pourcentage pour les autres cas
    const percentage = (available / total) * 100;
         if (percentage === 0) return { level: 'empty', color: 'bg-red-500', text: 'Rupture' };
    if (percentage < 50) return { level: 'medium', color: 'bg-orange-400', text: 'Moyen' };
    return { level: 'good', color: 'bg-green-500', text: 'Bon' };
  };

  const formatMovementType = (type: string) => {
    switch (type) {
      case 'in': return { icon: TrendingUp, color: 'text-green-600', label: 'Entrée' };
      case 'out': return { icon: TrendingDown, color: 'text-red-600', label: 'Sortie' };
      case 'adjustment': return { icon: RotateCcw, color: 'text-blue-600', label: 'Ajustement' };
      default: return { icon: Package, color: 'text-gray-600', label: 'Inconnu' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded-xl w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded-xl w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-coca-black">Gestion du Stock</h1>
          <p className="text-gray-600 mt-2">Gérez les produits et le stock</p>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="coca-shadow rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Total</p>
                  <p className="text-2xl font-bold text-coca-black">
                    {products.reduce((sum, p) => sum + (p.stock_total || 0), 0)}
                  </p>
                </div>
                <Warehouse className="h-8 w-8 text-coca-red" />
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
                  <p className="text-sm text-gray-600">En Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.reduce((sum, p) => sum + (p.stock_available || 0), 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="coca-shadow rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Réservé</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {products.reduce((sum, p) => sum + (p.stock_reserved || 0), 0)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="coca-shadow rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Faible</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => (p.stock_available || 0) < 10).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stock Management Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="coca-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Warehouse className="h-5 w-5 text-coca-red" />
              <span>Stock par Produit</span>
            </CardTitle>
            <CardDescription>
              Gérez les niveaux de stock de chaque produit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="rounded-xl overflow-hidden">
              <TableHeader>
                <TableRow>
                                     <TableHead>Nom du Produit</TableHead>
                   <TableHead>Stock Total</TableHead>
                   <TableHead>Stock Disponible</TableHead>
                   <TableHead>Stock Réservé</TableHead>
                   <TableHead>Niveau de Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => {
                  const stockLevel = getStockLevel(product);
                  const percentage = ((product.stock_available || 0) / (product.stock_total || 1)) * 100;
                  
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-coca-red rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-coca-black">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{product.stock_total}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{product.stock_available}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-orange-600">{product.stock_reserved}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${stockLevel.color}`}
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            stockLevel.level === 'empty' ? 'bg-red-100 text-red-800' :
                            stockLevel.level === 'critical' ? 'bg-red-100 text-red-800' :
                            stockLevel.level === 'low' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {stockLevel.text}
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Stock Movements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="coca-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-coca-red" />
              <span>Mouvements Récents</span>
            </CardTitle>
            <CardDescription>
              Historique des derniers mouvements de stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockMovements.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun mouvement de stock récent</p>
                  <p className="text-sm text-gray-400">Les mouvements apparaîtront ici</p>
                </div>
              ) : (
                stockMovements.map((movement, index) => {
                  const movementInfo = formatMovementType(movement.movement_type);
                  const Icon = movementInfo.icon;
                  
                  return (
                    <motion.div
                      key={movement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full bg-white ${movementInfo.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-coca-black">{movement.product.name}</p>
                          <p className="text-sm text-gray-600">{movement.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${movementInfo.color}`}>
                          {movement.movement_type === 'out' ? '-' : '+'}
                          {Math.abs(movement.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(movement.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Stock;


