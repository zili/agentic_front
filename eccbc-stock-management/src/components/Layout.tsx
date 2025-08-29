import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  LogOut,
  ChevronDown,
  Globe,
  BarChart3,
  Package,
  Box,
  Warehouse,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { apiService } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { logout } = useAuth();
  const { t, language, changeLanguage } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'orders', label: t('orders'), icon: Package },
    { id: 'products', label: t('products'), icon: Box },
    { id: 'stock', label: t('stock'), icon: Warehouse },
  ];

  const languages = [
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'AR', name: 'العربية', flag: '🇸🇦' },
  ];

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
      setShowLanguageMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setShowLanguageMenu(false);
  };

  // Charger les commandes récentes pour les notifications
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const orders = await apiService.getAllOrders(3);
        setRecentOrders(orders);
        setNotificationCount(orders.length);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
                          <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3">
                <img 
                  src="/ECCBC_Logo.png" 
                  alt="ECCBC Logo" 
                  className="h-20 w-auto"
                />
                <span className="text-lg text-red-600 hidden sm:block">
                  Stock Management System
                </span>
              </div>
            </div>
            
            {/* Navigation centrale */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                onClick={() => onPageChange('dashboard')}
                className={`px-6 py-3 font-medium text-lg transition-all duration-300 relative ${
                  currentPage === 'dashboard' 
                    ? 'text-red-600' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
                {currentPage === 'dashboard' && (
                  <motion.div
                    className="absolute bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => onPageChange('orders')}
                className={`px-6 py-3 font-medium text-lg transition-all duration-300 relative ${
                  currentPage === 'orders' 
                    ? 'text-red-600' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Commandes
                {currentPage === 'orders' && (
                  <motion.div
                    className="absolute bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => onPageChange('products')}
                className={`px-6 py-3 font-medium text-lg transition-all duration-300 relative ${
                  currentPage === 'products' 
                      ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Produits
                {currentPage === 'products' && (
                  <motion.div
                    className="absolute bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => onPageChange('stock')}
                className={`px-6 py-3 font-medium text-lg transition-all duration-300 relative ${
                  currentPage === 'stock' 
                    ? 'text-red-600' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Stock
                {currentPage === 'stock' && (
                  <motion.div
                    className="absolute bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
            
            {/* Actions de droite */}
            <div className="flex items-center space-x-4">
              {/* Barre de recherche */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              {/* Sélecteur de langue */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLanguageMenu(!showLanguageMenu);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Globe size={20} />
                  <span className="text-sm font-medium">
                    {languages.find(lang => lang.code === language)?.flag}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                            language === lang.code
                              ? 'bg-red-50 text-red-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Séparateur vertical */}
              <div className="w-px h-6 bg-gray-300"></div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                  }}
                  className="relative p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Bell size={24} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
              </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order: any) => (
                            <div key={order.id} className="p-3 bg-blue-50 rounded-xl">
                              <p className="text-sm text-blue-800">
                                Commande #{order.order_number} - {order.customer_name || order.customer_phone}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600">
                              Aucune commande récente
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu utilisateur */}
              <div className="relative">
              <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <User size={24} className="text-red-600 transition-colors duration-700" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="shadow-lg h-screen sticky top-0 w-48 transition-all duration-300 overflow-hidden" style={{backgroundColor: '#b91c1c'}}>
          <nav className="space-y-2 pt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex flex-col items-center space-y-2 px-4 py-6 text-left transition-all duration-700 ease-out text-white ${
                    isActive
                      ? 'shadow-lg'
                      : 'hover:bg-red-700 hover:bg-opacity-70'
                  }`}
                  style={isActive ? {backgroundColor: '#991b1b'} : {}}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 ease-out shadow-lg ${
                    isActive 
                      ? 'bg-white shadow-xl' 
                      : 'shadow-md'
                  }`}
                  style={!isActive ? {backgroundColor: '#dc2626'} : {}}>
                    <Icon size={24} className={isActive ? 'text-red-900' : 'text-white'} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;