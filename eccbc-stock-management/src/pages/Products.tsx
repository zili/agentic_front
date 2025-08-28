import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { productsApi } from '../lib/api';
import type { Product } from '../types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll();
      
      // Adapter les données de l'API pour la compatibilité
      const adaptedProducts = response.data.map((product: any) => ({
        ...product,
        id: product.id.toString(),
        stock_available: product.available_quantity || 0,
        stock_reserved: product.reserved_quantity || 0,
        stock_total: product.stock_quantity || 0,
        price: parseFloat(product.price) || 0,
        units_per_case: product.units_per_case || 1
      }));
      
      setProducts(adaptedProducts);
      setFilteredProducts(adaptedProducts);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    const available = product.stock_available || product.available_quantity || 0;
    if (available === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    } else if (available < 10) {
      return { label: 'Faible', color: 'bg-red-100 text-red-800' };
    } else if (available < 50) {
      return { label: 'Stock moyen', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'En stock', color: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded-xl w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded-xl w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-300 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-coca-black">Produits</h1>
          <p className="text-gray-600 mt-2">Gérez votre catalogue de produits ECCBC</p>
        </div>
        <Button 
          onClick={() => console.log('Ajouter produit - à implémenter')}
          className="bg-coca-red hover:bg-coca-red/90 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Produit
        </Button>
      </div>

      {/* Stats Cards */}
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
                  <p className="text-sm text-gray-600">Total Produits</p>
                  <p className="text-2xl font-bold text-coca-black">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-coca-red" />
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
                    {products.filter(p => (p.stock_available || p.available_quantity || 0) > 10).length}
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
                  <p className="text-sm text-gray-600">Stock Faible</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {products.filter(p => {
                      const available = p.stock_available || p.available_quantity || 0;
                      return available > 0 && available <= 10;
                    }).length}
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
                  <p className="text-sm text-gray-600">Rupture</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => (p.stock_available || p.available_quantity || 0) === 0).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="coca-shadow rounded-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou code produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Button variant="outline" className="border-coca-red text-coca-red hover:bg-coca-red hover:text-white rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="coca-shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Liste des Produits</CardTitle>
            <CardDescription>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="rounded-xl overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom du Produit</TableHead>
                  <TableHead>Unités par caisse</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock Disponible</TableHead>
                  <TableHead>Stock Réservé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => {
                  const status = getStockStatus(product);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-coca-black">
                        {product.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-coca-red rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {product.units_per_case || 1}
                      </TableCell>
                      <TableCell className="font-bold text-coca-red">
                        {product.price.toLocaleString('fr-FR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })} MAD
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{product.stock_available || product.available_quantity || 0}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-orange-600">{product.stock_reserved || product.reserved_quantity || 0}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 rounded-xl">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 rounded-xl">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 rounded-xl">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
                <p className="text-sm text-gray-400">
                  {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter votre premier produit'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Products;
