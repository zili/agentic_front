interface Translations {
  // Navigation
  dashboard: string;
  products: string;
  stock: string;
  orders: string;
  
  // Dashboard
  totalStock: string;
  orders7d: string;
  criticalStock: string;
  revenue: string;
  vsLastMonth: string;
  stockDistribution: string;
  orderStatus: string;
  monthlyPerformance: string;
  recentOrders: string;
  lastOrdersPassed: string;
  criticalStockTitle: string;
  productsNeedingRestock: string;
  sales: string;
  stockRotation: string;
  deliveries: string;
  satisfaction: string;
  total: string;
  delivered: string;
  inProgress: string;
  pending: string;
  
  // Products
  manageProducts: string;
  totalProducts: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
  newProduct: string;
  searchProducts: string;
  filters: string;
  productsList: string;
  productsFound: string;
  code: string;
  productName: string;
  unitsPerCase: string;
  price: string;
  availableStock: string;
  reservedStock: string;
  status: string;
  actions: string;
  noProductsFound: string;
  modifySearch: string;
  addFirstProduct: string;
  
  // Stock
  stockManagement: string;
  lowLevel: string;
  stockLevel: string;
  rupture: string;
  faible: string;
  moyen: string;
  enStock: string;
  
  // Orders
  orderManagement: string;
  searchOrders: string;
  ordersList: string;
  orderNumber: string;
  customer: string;
  paymentStatus: string;
  createdAt: string;
  viewDetails: string;
  orderDetails: string;
  customerInfo: string;
  phone: string;
  orderItems: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  paid: string;
  pending: string;
  close: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  search: string;
  logout: string;
  
  // Language names
  french: string;
  arabic: string;
  english: string;
  
  // Notifications
  viewAllOrders: string;
  secureConnection: string;
  advancedManagementSystem: string;
  allRightsReserved: string;
  
  // Time
  updatedMinutesAgo: string;
  units: string;
  threshold: string;
}

export const translations: Record<string, Translations> = {
  FR: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Produits',
    stock: 'Stock',
    orders: 'Commandes',
    
    // Dashboard
    totalStock: 'Stock Total',
    orders7d: 'Commandes (7j)',
    criticalStock: 'Stock Critique',
    revenue: 'Chiffre d\'affaires',
    vsLastMonth: 'vs mois dernier',
    stockDistribution: 'Répartition Stock',
    orderStatus: 'État des Commandes',
    monthlyPerformance: 'Performance Mensuelle',
    recentOrders: 'Commandes Récentes',
    lastOrdersPassed: 'Dernières commandes passées',
    criticalStockTitle: 'Stock Critique',
    productsNeedingRestock: 'Produits nécessitant un réapprovisionnement',
    sales: 'Ventes',
    stockRotation: 'Rotation Stock',
    deliveries: 'Livraisons',
    satisfaction: 'Satisfaction',
    total: 'Total',
    delivered: 'Livrées',
    inProgress: 'En cours',
    pending: 'En attente',
    
    // Products
    manageProducts: 'Gérez votre catalogue de produits ECCBC',
    totalProducts: 'Total Produits',
    inStock: 'En Stock',
    lowStock: 'Stock Faible',
    outOfStock: 'Rupture',
    newProduct: 'Nouveau Produit',
    searchProducts: 'Rechercher par nom ou code produit...',
    filters: 'Filtres',
    productsList: 'Liste des Produits',
    productsFound: 'produits trouvés',
    code: 'Code',
    productName: 'Nom du Produit',
    unitsPerCase: 'Unités par caisse',
    price: 'Prix',
    availableStock: 'Stock Disponible',
    reservedStock: 'Stock Réservé',
    status: 'Statut',
    actions: 'Actions',
    noProductsFound: 'Aucun produit trouvé',
    modifySearch: 'Essayez de modifier votre recherche',
    addFirstProduct: 'Commencez par ajouter votre premier produit',
    
    // Stock
    stockManagement: 'Gestion du Stock',
    lowLevel: 'Niveau Faible',
    stockLevel: 'Niveau de Stock',
    rupture: 'Rupture',
    faible: 'Faible',
    moyen: 'Stock moyen',
    enStock: 'En stock',
    
    // Orders
    orderManagement: 'Gestion des Commandes',
    searchOrders: 'Rechercher par numéro de commande ou client...',
    ordersList: 'Liste des Commandes',
    orderNumber: 'N° Commande',
    customer: 'Client',
    paymentStatus: 'Statut Paiement',
    createdAt: 'Date',
    viewDetails: 'Voir détails',
    orderDetails: 'Détails de la commande',
    customerInfo: 'Informations client',
    phone: 'Téléphone',
    orderItems: 'Articles commandés',
    quantity: 'Quantité',
    unitPrice: 'Prix unitaire',
    totalPrice: 'Prix total',
    paid: 'Payé',
    pending: 'En attente',
    close: 'Fermer',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    logout: 'Se déconnecter',
    
    // Language names
    french: 'Français',
    arabic: 'العربية',
    english: 'English',
    
    // Notifications
    viewAllOrders: 'Voir toutes les commandes',
    secureConnection: 'Connexion sécurisée SSL',
    advancedManagementSystem: 'Système de gestion avancé',
    allRightsReserved: 'Tous droits réservés',
    
    // Time
    updatedMinutesAgo: 'Mis à jour il y a 2 minutes',
    units: 'unités',
    threshold: 'Seuil',
  },
  
  EN: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    stock: 'Stock',
    orders: 'Orders',
    
    // Dashboard
    totalStock: 'Total Stock',
    orders7d: 'Orders (7d)',
    criticalStock: 'Critical Stock',
    revenue: 'Revenue',
    vsLastMonth: 'vs last month',
    stockDistribution: 'Stock Distribution',
    orderStatus: 'Order Status',
    monthlyPerformance: 'Monthly Performance',
    recentOrders: 'Recent Orders',
    lastOrdersPassed: 'Latest orders placed',
    criticalStockTitle: 'Critical Stock',
    productsNeedingRestock: 'Products needing restocking',
    sales: 'Sales',
    stockRotation: 'Stock Rotation',
    deliveries: 'Deliveries',
    satisfaction: 'Satisfaction',
    total: 'Total',
    delivered: 'Delivered',
    inProgress: 'In Progress',
    pending: 'Pending',
    
    // Products
    manageProducts: 'Manage your ECCBC product catalog',
    totalProducts: 'Total Products',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    newProduct: 'New Product',
    searchProducts: 'Search by name or product code...',
    filters: 'Filters',
    productsList: 'Product List',
    productsFound: 'products found',
    code: 'Code',
    productName: 'Product Name',
    unitsPerCase: 'Units per case',
    price: 'Price',
    availableStock: 'Available Stock',
    reservedStock: 'Reserved Stock',
    status: 'Status',
    actions: 'Actions',
    noProductsFound: 'No products found',
    modifySearch: 'Try modifying your search',
    addFirstProduct: 'Start by adding your first product',
    
    // Stock
    stockManagement: 'Stock Management',
    lowLevel: 'Low Level',
    stockLevel: 'Stock Level',
    rupture: 'Out of Stock',
    faible: 'Low',
    moyen: 'Medium Stock',
    enStock: 'In Stock',
    
    // Orders
    orderManagement: 'Order Management',
    searchOrders: 'Search by order number or customer...',
    ordersList: 'Order List',
    orderNumber: 'Order #',
    customer: 'Customer',
    paymentStatus: 'Payment Status',
    createdAt: 'Date',
    viewDetails: 'View details',
    orderDetails: 'Order details',
    customerInfo: 'Customer information',
    phone: 'Phone',
    orderItems: 'Ordered items',
    quantity: 'Quantity',
    unitPrice: 'Unit price',
    totalPrice: 'Total price',
    paid: 'Paid',
    pending: 'Pending',
    close: 'Close',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    logout: 'Logout',
    
    // Language names
    french: 'Français',
    arabic: 'العربية',
    english: 'English',
    
    // Notifications
    viewAllOrders: 'View all orders',
    secureConnection: 'Secure SSL connection',
    advancedManagementSystem: 'Advanced management system',
    allRightsReserved: 'All rights reserved',
    
    // Time
    updatedMinutesAgo: 'Updated 2 minutes ago',
    units: 'units',
    threshold: 'Threshold',
  },
  
  AR: {
    // Navigation
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    stock: 'المخزون',
    orders: 'الطلبات',
    
    // Dashboard
    totalStock: 'إجمالي المخزون',
    orders7d: 'الطلبات (7 أيام)',
    criticalStock: 'مخزون حرج',
    revenue: 'رقم الأعمال',
    vsLastMonth: 'مقارنة بالشهر الماضي',
    stockDistribution: 'توزيع المخزون',
    orderStatus: 'حالة الطلبات',
    monthlyPerformance: 'الأداء الشهري',
    recentOrders: 'الطلبات الأخيرة',
    lastOrdersPassed: 'آخر الطلبات المرسلة',
    criticalStockTitle: 'مخزون حرج',
    productsNeedingRestock: 'المنتجات التي تحتاج إعادة تموين',
    sales: 'المبيعات',
    stockRotation: 'دوران المخزون',
    deliveries: 'التسليم',
    satisfaction: 'الرضا',
    total: 'المجموع',
    delivered: 'تم التسليم',
    inProgress: 'قيد التنفيذ',
    pending: 'في الانتظار',
    
    // Products
    manageProducts: 'إدارة كتالوج منتجات ECCBC',
    totalProducts: 'إجمالي المنتجات',
    inStock: 'في المخزون',
    lowStock: 'مخزون منخفض',
    outOfStock: 'نفد المخزون',
    newProduct: 'منتج جديد',
    searchProducts: 'البحث بالاسم أو كود المنتج...',
    filters: 'المرشحات',
    productsList: 'قائمة المنتجات',
    productsFound: 'منتج موجود',
    code: 'الكود',
    productName: 'اسم المنتج',
    unitsPerCase: 'وحدات لكل صندوق',
    price: 'السعر',
    availableStock: 'المخزون المتاح',
    reservedStock: 'المخزون المحجوز',
    status: 'الحالة',
    actions: 'الإجراءات',
    noProductsFound: 'لم يتم العثور على منتجات',
    modifySearch: 'جرب تعديل البحث',
    addFirstProduct: 'ابدأ بإضافة منتجك الأول',
    
    // Stock
    stockManagement: 'إدارة المخزون',
    lowLevel: 'مستوى منخفض',
    stockLevel: 'مستوى المخزون',
    rupture: 'نفد المخزون',
    faible: 'منخفض',
    moyen: 'مخزون متوسط',
    enStock: 'في المخزون',
    
    // Orders
    orderManagement: 'إدارة الطلبات',
    searchOrders: 'البحث برقم الطلب أو العميل...',
    ordersList: 'قائمة الطلبات',
    orderNumber: 'رقم الطلب',
    customer: 'العميل',
    paymentStatus: 'حالة الدفع',
    createdAt: 'التاريخ',
    viewDetails: 'عرض التفاصيل',
    orderDetails: 'تفاصيل الطلب',
    customerInfo: 'معلومات العميل',
    phone: 'الهاتف',
    orderItems: 'العناصر المطلوبة',
    quantity: 'الكمية',
    unitPrice: 'سعر الوحدة',
    totalPrice: 'السعر الإجمالي',
    paid: 'مدفوع',
    pending: 'في الانتظار',
    close: 'إغلاق',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    search: 'بحث',
    logout: 'تسجيل الخروج',
    
    // Language names
    french: 'Français',
    arabic: 'العربية',
    english: 'English',
    
    // Notifications
    viewAllOrders: 'عرض جميع الطلبات',
    secureConnection: 'اتصال آمن SSL',
    advancedManagementSystem: 'نظام إدارة متقدم',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Time
    updatedMinutesAgo: 'تم التحديث منذ دقيقتين',
    units: 'وحدة',
    threshold: 'العتبة',
  }
};

export const getTranslation = (language: string): Translations => {
  return translations[language] || translations.FR;
};

export type { Translations };
