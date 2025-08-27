import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Menu, 
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { healthApi } from '../lib/api';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isApiOnline, setIsApiOnline] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'stock', label: 'Stock', icon: Warehouse },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  ];

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await healthApi.check();
        setIsApiOnline(true);
      } catch (error) {
        setIsApiOnline(false);
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 coca-shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-coca-red hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-coca-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-coca-black">ECCBC</h1>
                  <p className="text-xs text-gray-500">Stock Management</p>
                </div>
              </div>
            </div>

            {/* API Status */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isApiOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isApiOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span>{isApiOnline ? 'API Online' : 'API Offline'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`bg-white shadow-lg border-r border-gray-200 overflow-hidden ${
            isSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-coca-red text-white coca-shadow'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-coca-red'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Coca-Cola Branding */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 bg-gradient-to-r from-coca-red to-red-600 rounded-lg text-white text-center">
              <h3 className="font-bold text-lg">Coca-Cola</h3>
              <p className="text-xs opacity-90">Embouteilleur ECCBC</p>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
