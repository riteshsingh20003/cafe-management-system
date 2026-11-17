import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShoppingBag,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Eye,
  Coffee
} from 'lucide-react';
import { api } from '../services/api';
import { MENU_CATEGORIES } from '../data/defaultMenu';
import { useToast } from '../context/ToastContext';

export default function StaffDashboard({ onReturnToCustomer }) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    readyOrders: 0,
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Menu State
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State for Add / Edit Item
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Coffee',
    price: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    preparationTime: 5,
    rating: 4.8,
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await api.getOrderStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {}
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.getOrders({
        status: orderStatusFilter,
        search: orderSearchQuery,
      });
      if (res.success) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Menu Items
  const fetchMenu = async () => {
    setMenuLoading(true);
    try {
      const res = await api.getMenuItems({
        category: menuCategoryFilter,
        search: menuSearchQuery,
      });
      if (res.success) {
        setMenuItems(res.data);
      }
    } catch (e) {
      console.error('Failed to load menu', e);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [orderStatusFilter, orderSearchQuery]);

  useEffect(() => {
    fetchMenu();
  }, [menuCategoryFilter, menuSearchQuery]);

  // Advance Order Status
  const handleAdvanceStatus = async (orderId, nextStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        addToast(`Order marked as "${nextStatus}"`, 'success');
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  // Toggle item availability
  const handleToggleAvailability = async (item) => {
    try {
      const res = await api.toggleAvailability(item._id, item.isAvailable);
      if (res.success) {
        addToast(
          `"${item.name}" is now ${!item.isAvailable ? 'In Stock' : 'Marked Sold Out'}`,
          'info'
        );
        fetchMenu();
      }
    } catch {
      addToast('Failed to update availability', 'error');
    }
  };

  // Open Add Item Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'Coffee',
      price: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      preparationTime: 5,
      rating: 4.8,
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
    });
    setIsItemModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      preparationTime: item.preparationTime || 5,
      rating: item.rating || 4.8,
      isAvailable: item.isAvailable ?? true,
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
    });
    setIsItemModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price || !itemForm.description) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    const payload = {
      ...itemForm,
      price: parseFloat(itemForm.price),
      preparationTime: parseInt(itemForm.preparationTime, 10) || 5,
    };

    try {
      if (editingItem) {
        const res = await api.updateMenuItem(editingItem._id, payload);
        if (res.success) {
          addToast(`"${payload.name}" updated successfully`, 'success');
        }
      } else {
        const res = await api.createMenuItem(payload);
        if (res.success) {
          addToast(`"${payload.name}" added to menu`, 'success');
        }
      }
      setIsItemModalOpen(false);
      fetchMenu();
    } catch {
      addToast('Failed to save menu item', 'error');
    }
  };

  // Delete Item
  const handleDeleteItem = async (id) => {
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        addToast('Menu item removed', 'info');
        setDeleteConfirmId(null);
        fetchMenu();
      }
    } catch {
      addToast('Failed to delete item', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20">
      
      {/* Top Staff Header */}
      <div className="bg-stone-900 border-b border-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold">Cafe Management Portal</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    Live System
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Kitchen order dispatch, catalog controls, and real-time operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchOrders();
                  fetchMenu();
                  fetchStats();
                  addToast('Refreshed latest data', 'info');
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>

              <button
                onClick={onReturnToCustomer}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-900/30 flex items-center gap-1.5 transition-all"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Return to Customer Menu</span>
              </button>
            </div>

          </div>

          {/* Stats Bar Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Today's Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 font-serif text-2xl font-bold text-emerald-300">
                ${stats.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Active Kitchen Orders</span>
                <ChefHat className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 font-serif text-2xl font-bold text-amber-300">
                {stats.activeOrders || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Ready for Table / Pickup</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 font-serif text-2xl font-bold text-sky-300">
                {stats.readyOrders || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/60">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Total Orders Today</span>
                <TrendingUp className="w-4 h-4 text-stone-400" />
              </div>
              <div className="mt-2 font-serif text-2xl font-bold text-white">
                {stats.totalOrders || 0}
              </div>
            </div>
          </div>

          {/* Portal Navigation Tabs */}
          <div className="flex gap-4 mt-6 border-b border-stone-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'orders'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Orders Management</span>
              {stats.activeOrders > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-900 text-[10px] font-black flex items-center justify-center">
                  {stats.activeOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'menu'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Menu Item Catalog</span>
              <span className="text-xs text-stone-500">({menuItems.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================= TAB 1: ORDERS ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Orders Controls & Filter Chips */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['all', 'pending', 'preparing', 'ready', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      orderStatusFilter === st
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Filter by customer, phone, or order #"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

            </div>

            {/* Orders List / Cards */}
            {ordersLoading ? (
              <div className="text-center py-16 text-stone-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
                <p className="text-sm">Loading cafe orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                <UtensilsCrossed className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                <h3 className="font-serif text-lg font-bold text-stone-800">No matching orders found</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Orders placed by customers from tables or takeaway will show up here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.map((ord) => {
                  const statusColor =
                    ord.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : ord.status === 'ready'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-300/40'
                      : ord.status === 'preparing'
                      ? 'bg-sky-50 border-sky-200 text-sky-800'
                      : 'bg-stone-50 border-stone-200 text-stone-800';

                  return (
                    <div
                      key={ord._id}
                      className="bg-white rounded-3xl border border-stone-200 shadow-warm p-5 flex flex-col justify-between hover:shadow-warm-lg transition-all"
                    >
                      <div>
                        {/* Top info */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                          <div>
                            <span className="font-mono text-xs font-extrabold text-stone-900">
                              {ord.orderNumber}
                            </span>
                            <div className="text-xs text-stone-500 mt-0.5 font-medium">
                              {new Date(ord.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${statusColor}`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Customer & Location */}
                        <div className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-stone-400 font-normal block">Customer</span>
                            <strong className="text-stone-800 font-bold">{ord.customerName}</strong>
                            <span className="text-stone-500 font-mono text-[11px] block">{ord.customerPhone}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-400 font-normal block">Destination</span>
                            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 inline-block">
                              {ord.tableNumber}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="my-2 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1.5">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-stone-700">
                              <span>
                                <strong className="font-bold text-stone-900 mr-1.5">{item.quantity}×</strong>
                                {item.name}
                              </span>
                              <span className="font-mono text-stone-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.notes && (
                          <div className="my-2 p-2 rounded-xl bg-amber-50 text-[11px] text-amber-900 italic border border-amber-200">
                            Note: "{ord.notes}"
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-stone-100">
                        <div className="flex justify-between items-center mb-3 text-xs">
                          <span className="text-stone-500 font-medium">Total Bill</span>
                          <span className="font-serif font-extrabold text-base text-stone-900">
                            ${ord.totalAmount?.toFixed(2)}
                          </span>
                        </div>

                        {/* One-click Action Buttons based on status */}
                        <div className="flex items-center gap-2">
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => handleAdvanceStatus(ord._id, 'preparing')}
                              className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>Start Preparing</span>
                            </button>
                          )}

                          {ord.status === 'preparing' && (
                            <button
                              onClick={() => handleAdvanceStatus(ord._id, 'ready')}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Mark Ready for Table</span>
                            </button>
                          )}

                          {ord.status === 'ready' && (
                            <button
                              onClick={() => handleAdvanceStatus(ord._id, 'completed')}
                              className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Delivered / Served</span>
                            </button>
                          )}

                          {ord.status === 'completed' && (
                            <div className="flex-1 text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                              ✓ Completed & Paid
                            </div>
                          )}

                          {ord.status !== 'cancelled' && ord.status !== 'completed' && (
                            <button
                              onClick={() => handleAdvanceStatus(ord._id, 'cancelled')}
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Cancel order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ======================= TAB 2: MENU CATALOG ======================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Catalog Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
              
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {MENU_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Menu Item</span>
              </button>

            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-warm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Prep Time</th>
                      <th className="py-3.5 px-4">Dietary</th>
                      <th className="py-3.5 px-4 text-center">Availability</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {menuLoading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          Loading catalog...
                        </td>
                      </tr>
                    ) : menuItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No menu items found
                        </td>
                      </tr>
                    ) : (
                      menuItems.map((item) => (
                        <tr key={item._id} className="hover:bg-stone-50/70 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-stone-900 text-sm block">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px]">
                              {item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900 text-sm">
                            ${item.price?.toFixed(2)}
                          </td>

                          {/* Prep Time */}
                          <td className="py-3.5 px-4 text-stone-600 font-medium">
                            ⏱️ {item.preparationTime || 5} min
                          </td>

                          {/* Dietary Badges */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1">
                              {item.isVegan && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Vegan
                                </span>
                              )}
                              {!item.isVegan && item.isVegetarian && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                  Veg
                                </span>
                              )}
                              {item.isGlutenFree && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  GF
                                </span>
                              )}
                              {!item.isVegetarian && !item.isVegan && !item.isGlutenFree && (
                                <span className="text-stone-400 text-[11px]">—</span>
                              )}
                            </div>
                          </td>

                          {/* Availability Toggle */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleAvailability(item)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                item.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {item.isAvailable ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                                title="Edit item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(item._id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ======================= MODAL: ADD / EDIT ITEM ======================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-warm-xl border border-stone-200 overflow-hidden text-stone-800">
            
            <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Maple Cinnamon Cold Brew"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {MENU_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="e.g. 5.50"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Appealing culinary description of ingredients and flavor profile..."
                  className="w-full px-4 py-2 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.preparationTime}
                    onChange={(e) => setItemForm({ ...itemForm, preparationTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Customer Rating (1-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={itemForm.rating}
                    onChange={(e) => setItemForm({ ...itemForm, rating: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Dietary Flags */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="block text-xs font-bold text-stone-600 mb-1">
                  Dietary Classification & Stock:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isVegetarian}
                      onChange={(e) => setItemForm({ ...itemForm, isVegetarian: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>🌱 Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isVegan}
                      onChange={(e) => setItemForm({ ...itemForm, isVegan: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>🌿 Vegan</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isGlutenFree}
                      onChange={(e) => setItemForm({ ...itemForm, isGlutenFree: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>🌾 Gluten Free</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                    <input
                      type="checkbox"
                      checked={itemForm.isAvailable}
                      onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>✓ Available in Stock</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-900/30 transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================= MODAL: DELETE CONFIRMATION ======================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-warm-xl border border-stone-200 p-6 text-center text-stone-800">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Remove Menu Item?</h3>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Are you sure you want to delete this menu item from the catalog? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
