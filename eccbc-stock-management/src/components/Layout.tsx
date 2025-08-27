import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Menu, 
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'stock', label: 'Stock', icon: Warehouse },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
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
            <div className="flex items-center space-x-8 ml-32">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`relative font-semibold pb-1 transition-all duration-300 ${
                    currentPage === item.id
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  {item.label.toUpperCase()}
                  {currentPage === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-all duration-300 ease-in-out"></span>
                  )}
                  {currentPage !== item.id && (
                    <span className="absolute bottom-0 left-0 h-0.5 bg-red-400 transition-all duration-300 ease-in-out w-0 hover:w-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`shadow-lg ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`} style={{backgroundColor: '#b91c1c'}}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex flex-col items-center space-y-2 px-4 py-6 rounded-lg text-left transition-all duration-500 ease-in-out text-white ${
                    isActive
                      ? 'shadow-lg transform scale-105'
                      : 'hover:bg-red-700 hover:bg-opacity-70 hover:scale-102'
                  }`}
                  style={isActive ? {backgroundColor: '#991b1b'} : {}}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out ${
                    isActive 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-20'
                  }`}>
                    <Icon size={24} className={isActive ? 'text-red-900' : 'text-white'} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Branding */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 bg-red-950 rounded-lg text-white text-center">
              <h3 className="font-bold text-lg">Coca-Cola</h3>
              <p className="text-xs opacity-90">Embouteilleur ECCBC</p>
            </div>
          </div>
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