import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Menu, 
  X,
  BarChart3,
  User,
  Bell,
  Search
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'stock', label: 'Stock', icon: Warehouse },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  ];

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
                <button 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out shadow-lg hover:shadow-xl group" 
                style={{backgroundColor: '#fecaca'}}
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
              </button>
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ease-out shadow-lg hover:shadow-xl group" 
                style={{backgroundColor: '#fecaca'}}
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
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`shadow-lg ${isSidebarOpen ? 'w-48' : 'w-0'} transition-all duration-300 overflow-hidden`} style={{backgroundColor: '#b91c1c'}}>
          <nav className="space-y-2">
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