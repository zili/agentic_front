import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Menu, 
  X,
  BarChart3,
  User,
  Bell,
  Search,
  Clock,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [seenOrderIds, setSeenOrderIds] = useState<Set<string>>(new Set());
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'stock', label: 'Stock', icon: Warehouse },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  ];

  // Fonction pour récupérer les dernières commandes
  const fetchRecentOrders = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders/all');
      const data = await response.json();
      // Prendre les 3 dernières commandes et les trier par date
      const sortedOrders = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latestOrders = sortedOrders.slice(0, 3);
      
      // Compter les nouvelles commandes (non vues)
      const newOrders = latestOrders.filter((order: any) => !seenOrderIds.has(order.id.toString()));
      
      // Remplacer le compteur par le nombre exact de nouvelles commandes (ne pas accumuler)
      setUnreadCount(newOrders.length);
      
      setRecentOrders(latestOrders);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  }, [seenOrderIds]);

  useEffect(() => {
    // Chargement initial
    fetchRecentOrders();
    
    // Actualiser les notifications toutes les 30 secondes
    const interval = setInterval(fetchRecentOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchRecentOrders]); // Dépendance sur fetchRecentOrders

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showUserMenu && !target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <div className="flex items-center space-x-4 ml-6">
                <img 
                  src="/ECCBC_Logo.png" 
                  alt="ECCBC Logo" 
                  className="h-24 w-auto"
                />
                <div>
                  <h1 className="text-base font-semibold text-red-600">Stock Management System</h1>
                </div>
              </div>
            </div>
            
            {/* Navbar Pages - vraiment séparées maintenant */}
            <div className="flex items-center space-x-12 ml-24">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`relative font-medium text-base pb-1 px-2 py-1 rounded-md transition-all duration-700 ease-out ${
                    currentPage === item.id
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-red-500 hover:bg-gray-100'
                  }`}
                >
                  {item.label.toUpperCase()}
                  {currentPage === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-700 ease-out"></span>
                  )}
                  {currentPage !== item.id && (
                    <span className="absolute bottom-0 left-0 h-0.5 bg-red-400 transition-all duration-700 ease-out w-0 hover:w-full"></span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="ml-auto flex items-center space-x-6 mr-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
              
              {/* User & Notifications */}
              <div className="flex items-center space-x-4">
                <div className="relative notification-dropdown">
                  <button 
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out shadow-lg hover:shadow-xl group relative" 
                    style={{backgroundColor: '#fecaca'}}
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) {
                        // Marquer toutes les commandes actuelles comme vues
                        const currentOrderIds = recentOrders.map((order: any) => order.id.toString());
                        setSeenOrderIds(prev => new Set([...prev, ...currentOrderIds]));
                        setUnreadCount(0); // Remettre le badge à 0
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#dc2626';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                  >
                    <Bell size={24} className="text-red-600 transition-colors duration-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown des notifications */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Dernières commandes</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto select-none" style={{userSelect: 'none'}}>
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order: any) => (
                            <div key={order.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 select-none" style={{userSelect: 'none'}}>
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <ShoppingCart size={16} className="text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {order.order_number}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.customer_name || 'Client non spécifié'}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Clock size={12} className="text-gray-400" />
                                    <p className="text-xs text-gray-500">
                                      {new Date(order.created_at).toLocaleString('fr-FR')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-red-600">
                                    {parseFloat(order.total_amount || 0).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                            <p>Aucune commande récente</p>
                          </div>
                        )}
                      </div>
                      {recentOrders.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              setShowNotifications(false);
                              onPageChange('orders');
                            }}
                            className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Voir toutes les commandes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                              <div className="relative user-menu">
                  <button 
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out shadow-lg hover:shadow-xl group" 
                    style={{backgroundColor: '#fecaca'}}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#dc2626';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = 'white';
                    }}
                  >
                    <User size={24} className="text-red-600 transition-colors duration-700" />
                  </button>

                  {/* Menu utilisateur */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            // Logique de déconnexion directe
                            localStorage.clear();
                            sessionStorage.clear();
                            // Recharger la page pour revenir à l'état initial
                            window.location.reload();
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`shadow-lg h-screen sticky top-0 ${isSidebarOpen ? 'w-48' : 'w-0'} transition-all duration-300 overflow-hidden`} style={{backgroundColor: '#b91c1c'}}>
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