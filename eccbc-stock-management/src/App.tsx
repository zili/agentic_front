import React, { useState } from 'react';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Produits' },
    { id: 'stock', label: 'Stock' },
    { id: 'orders', label: 'Commandes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header blanc propre */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="px-12 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-4">
                <img 
                  src="/ECCBC_Logo.png" 
                  alt="ECCBC Logo" 
                  className="h-20 w-auto object-contain"
                />
                <div>
                  <p className="text-red-600 text-sm font-medium">Stock Management System</p>
                </div>
              </div>
              
              <nav className="flex space-x-10">
                <button className="text-red-600 font-semibold border-b-3 border-red-600 pb-1">
                  DASHBOARD
                </button>
                <button className="text-gray-500 font-semibold hover:text-gray-700 pb-1">
                  PRODUITS
                </button>
                <button className="text-gray-500 font-semibold hover:text-gray-700 pb-1">
                  STOCK
                </button>
                <button className="text-gray-500 font-semibold hover:text-gray-700 pb-1">
                  COMMANDES
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by Name, URL..."
                  className="bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-80"
                />
                <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM15 7h5l-5-5v5zM9 7H4l5-5v5z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar rouge foncé plus spacieuse */}
        <aside className="w-40 bg-red-700 min-h-screen shadow-xl">
          <nav className="py-12">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full px-4 py-8 flex flex-col items-center space-y-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-red-800 text-white shadow-lg'
                      : 'text-red-200 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                    isActive ? 'bg-white text-red-700' : 'bg-red-600 text-white'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.id === 'dashboard' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      )}
                      {item.id === 'products' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4.5-8-4.5m16 0v10l-8 4.5-8-4.5V7" />
                      )}
                      {item.id === 'stock' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      )}
                      {item.id === 'orders' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                      )}
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight uppercase tracking-wider">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom icons */}
          <div className="absolute bottom-12 left-3 right-3 space-y-8">
            <button className="w-full flex flex-col items-center space-y-2 text-red-300 hover:text-white transition-colors">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Monétisation</span>
            </button>
            <button className="w-full flex flex-col items-center space-y-2 text-red-300 hover:text-white transition-colors">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Messages</span>
            </button>
            <button className="w-full flex flex-col items-center space-y-2 text-red-300 hover:text-white transition-colors">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Paramètres</span>
            </button>
          </div>
        </aside>

        {/* Main Content plus spacieux */}
        <main className="flex-1 bg-gray-50 p-12">
          {currentPage === 'dashboard' && (
            <div className="space-y-12">
              {/* Stats Cards rouges */}
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">25</div>
                    <div className="text-red-100 text-sm font-medium">Produits Actifs</div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <svg className="w-16 h-16 text-red-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4" />
                    </svg>
                  </div>
                </div>

                <div className="bg-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">12,450</div>
                    <div className="text-red-100 text-sm font-medium">Stock Total</div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <svg className="w-16 h-16 text-red-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                <div className="bg-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">142</div>
                    <div className="text-red-100 text-sm font-medium">Commandes (7j)</div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <svg className="w-16 h-16 text-red-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Profile Card blanc plus spacieux */}
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Manager ECCBC</h2>
                      <p className="text-gray-600 text-lg">DOUALA, CAMEROUN</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center space-x-3 font-medium transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span>SAVE PROFILE</span>
                    </button>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center space-x-3 font-medium transition-colors shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>CONTACT DETAILS</span>
                    </button>
                    <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Platform Stats - Cards blanches plus spacieuses */}
              <div className="grid grid-cols-3 gap-8">
                {/* Coca-Cola Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">Coca-Cola</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">1,250</div>
                  <div className="text-sm text-gray-600 mb-8 font-medium">UNITÉS EN STOCK</div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-gray-600 font-semibold text-sm mb-1">DISPONIBLE</div>
                      <div className="text-xl font-bold text-gray-900">87%</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold text-sm mb-1">RÉSERVÉ</div>
                      <div className="text-xl font-bold text-green-600">10%</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm mb-1">VENDU</div>
                      <div className="text-xl font-bold text-blue-600">450</div>
                    </div>
                  </div>
                </div>

                {/* Fanta Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-sm font-bold">F</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">Fanta</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">890</div>
                  <div className="text-sm text-gray-600 mb-8 font-medium">UNITÉS EN STOCK</div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-gray-600 font-semibold text-sm mb-1">DISPONIBLE</div>
                      <div className="text-xl font-bold text-gray-900">75%</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold text-sm mb-1">RÉSERVÉ</div>
                      <div className="text-xl font-bold text-green-600">15%</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm mb-1">VENDU</div>
                      <div className="text-xl font-bold text-blue-600">320</div>
                    </div>
                  </div>
                </div>

                {/* Sprite Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">Sprite</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">675</div>
                  <div className="text-sm text-gray-600 mb-8 font-medium">UNITÉS EN STOCK</div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-gray-600 font-semibold text-sm mb-1">DISPONIBLE</div>
                      <div className="text-xl font-bold text-gray-900">68%</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-semibold text-sm mb-1">RÉSERVÉ</div>
                      <div className="text-xl font-bold text-green-600">12%</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-semibold text-sm mb-1">VENDU</div>
                      <div className="text-xl font-bold text-blue-600">280</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table plus spacieux */}
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Commandes Récentes</h3>
                  <div className="flex space-x-6">
                    <button className="text-red-600 font-bold border-b-3 border-red-600 pb-2">Temps Réel</button>
                    <button className="text-gray-500 font-semibold hover:text-gray-700 pb-2">Aujourd'hui</button>
                    <button className="text-gray-500 font-semibold hover:text-gray-700 pb-2">Mois Passé</button>
                    <button className="text-gray-500 font-semibold hover:text-gray-700 pb-2">Tout</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 text-left">
                        <th className="pb-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Commande</th>
                        <th className="pb-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Client</th>
                        <th className="pb-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                        <th className="pb-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                        <th className="pb-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900">CMD-2024-001</td>
                        <td className="py-6 text-gray-700 font-medium">+237 677 123 456</td>
                        <td className="py-6 font-bold text-gray-900 text-lg">2,400 FCFA</td>
                        <td className="py-6">
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-bold text-xs uppercase tracking-wider">EN ATTENTE</span>
                        </td>
                        <td className="py-6 text-gray-600 font-medium">Il y a 2h</td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900">CMD-2024-002</td>
                        <td className="py-6 text-gray-700 font-medium">+237 655 987 654</td>
                        <td className="py-6 font-bold text-gray-900 text-lg">1,600 FCFA</td>
                        <td className="py-6">
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-xl font-bold text-xs uppercase tracking-wider">CONFIRMÉE</span>
                        </td>
                        <td className="py-6 text-gray-600 font-medium">Il y a 5h</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900">CMD-2024-003</td>
                        <td className="py-6 text-gray-700 font-medium">+237 699 456 789</td>
                        <td className="py-6 font-bold text-gray-900 text-lg">900 FCFA</td>
                        <td className="py-6">
                          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-bold text-xs uppercase tracking-wider">LIVRÉE</span>
                        </td>
                        <td className="py-6 text-gray-600 font-medium">Hier</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other pages */}
          {currentPage !== 'dashboard' && (
            <div className="bg-white rounded-3xl p-16 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {currentPage === 'products' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4.5-8-4.5m16 0v10l-8 4.5-8-4.5V7" />
                    )}
                    {currentPage === 'stock' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    )}
                    {currentPage === 'orders' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    )}
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Module {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                </h3>
                <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto">
                  Interface détaillée en cours de développement.<br/>
                  Toutes les fonctionnalités seront disponibles prochainement.
                </p>
                <button className="px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-bold shadow-lg">
                  DÉVELOPPER CE MODULE
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;