import { DEFAULT_MENU_ITEMS } from '../data/defaultMenu';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage keys for fallback offline mode
const LOCAL_MENU_KEY = 'aromarcraft_menu_items_v1';
const LOCAL_ORDERS_KEY = 'aromarcraft_orders_v1';

// Seed local storage with default menu if empty
function getLocalMenu() {
  try {
    const saved = localStorage.getItem(LOCAL_MENU_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse local menu from localStorage', e);
  }
  // Initialize with DEFAULT_MENU_ITEMS
  try {
    localStorage.setItem(LOCAL_MENU_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
  } catch (e) {
    // Ignore storage quota
  }
  return DEFAULT_MENU_ITEMS;
}

function saveLocalMenu(items) {
  try {
    localStorage.setItem(LOCAL_MENU_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save menu to localStorage', e);
  }
}

function getLocalOrders() {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse orders from localStorage', e);
  }
  // Initial seed orders for staff demo
  const sampleOrders = [
    {
      _id: 'sample-ord-1',
      orderNumber: 'ORD-20261117-1011',
      customerName: 'Sophia Miller',
      customerPhone: '555-0143',
      tableNumber: 'Table 4',
      orderType: 'dine-in',
      items: [
        { menuItem: 'menu-002', name: 'Velvet Flat White', price: 4.95, quantity: 2 },
        { menuItem: 'menu-009', name: 'Twice-Baked Almond Croissant', price: 4.95, quantity: 1 }
      ],
      subtotal: 14.85,
      tax: 0.74,
      totalAmount: 15.59,
      status: 'preparing',
      notes: 'Extra hot flat white, please!',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
      _id: 'sample-ord-2',
      orderNumber: 'ORD-20261117-1012',
      customerName: 'Marcus Vance',
      customerPhone: '555-0189',
      tableNumber: 'Table 7',
      orderType: 'dine-in',
      items: [
        { menuItem: 'menu-012', name: 'Artisan Avocado Sourdough Tartine', price: 11.50, quantity: 1 },
        { menuItem: 'menu-004', name: 'Single-Origin Cold Brew Reserve', price: 5.25, quantity: 1 }
      ],
      subtotal: 16.75,
      tax: 0.84,
      totalAmount: 17.59,
      status: 'ready',
      notes: 'Side of chilli flakes',
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
    },
    {
      _id: 'sample-ord-3',
      orderNumber: 'ORD-20261117-1013',
      customerName: 'Emily Chen',
      customerPhone: '555-0219',
      tableNumber: 'Takeaway',
      orderType: 'takeaway',
      items: [
        { menuItem: 'menu-006', name: 'Ceremonial Uji Matcha Latte', price: 5.95, quantity: 1 },
        { menuItem: 'menu-020', name: 'San Sebastián Basque Burnt Cheesecake', price: 6.95, quantity: 1 }
      ],
      subtotal: 12.90,
      tax: 0.65,
      totalAmount: 13.55,
      status: 'pending',
      notes: 'Oat milk substitute',
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
    }
  ];
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(sampleOrders));
  } catch (e) {
    // Ignore
  }
  return sampleOrders;
}

function saveLocalOrders(orders) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

// Helper fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 4000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  // Check if API backend is reachable
  async ping() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, { timeout: 2000 });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 1. MENU APIS
  async getMenuItems(params = {}) {
    const { category, search, dietary, sort } = params;
    try {
      const queryParams = new URLSearchParams();
      if (category && category !== 'All') queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      if (dietary?.vegetarian) queryParams.append('vegetarian', 'true');
      if (dietary?.vegan) queryParams.append('vegan', 'true');
      if (dietary?.glutenFree) queryParams.append('glutenFree', 'true');
      if (sort) queryParams.append('sort', sort);

      const url = `${API_BASE_URL}/menu?${queryParams.toString()}`;
      const response = await fetchWithTimeout(url);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, using rich local menu store', err.message);
      // Local filtering fallback
      let items = [...getLocalMenu()];

      if (category && category !== 'All') {
        items = items.filter(item => item.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      if (dietary?.vegetarian) {
        items = items.filter(item => item.isVegetarian);
      }
      if (dietary?.vegan) {
        items = items.filter(item => item.isVegan);
      }
      if (dietary?.glutenFree) {
        items = items.filter(item => item.isGlutenFree);
      }

      // Sorting
      if (sort === 'price-low') {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        items.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'prep-time') {
        items.sort((a, b) => (a.preparationTime || 0) - (b.preparationTime || 0));
      }

      return { success: true, data: items, source: 'local' };
    }
  },

  async createMenuItem(itemData) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) throw new Error('Failed to create menu item on server');
      const data = await response.json();
      // Keep local store in sync
      const local = getLocalMenu();
      const newItem = data.data || data;
      saveLocalMenu([newItem, ...local]);
      return { success: true, data: newItem, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, creating menu item locally', err.message);
      const local = getLocalMenu();
      const newItem = {
        ...itemData,
        _id: `menu-custom-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveLocalMenu([newItem, ...local]);
      return { success: true, data: newItem, source: 'local' };
    }
  },

  async updateMenuItem(id, itemData) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) throw new Error('Failed to update menu item on server');
      const data = await response.json();
      const updated = data.data || data;
      const local = getLocalMenu().map(it => (it._id === id ? updated : it));
      saveLocalMenu(local);
      return { success: true, data: updated, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, updating item locally', err.message);
      const local = getLocalMenu().map(it => {
        if (it._id === id) {
          return { ...it, ...itemData, updatedAt: new Date().toISOString() };
        }
        return it;
      });
      saveLocalMenu(local);
      const updated = local.find(it => it._id === id);
      return { success: true, data: updated, source: 'local' };
    }
  },

  async toggleAvailability(id, currentStatus) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
      if (!response.ok) {
        // Fallback to normal PUT if specific PATCH endpoint isn't present
        return this.updateMenuItem(id, { isAvailable: !currentStatus });
      }
      const data = await response.json();
      const updated = data.data || data;
      const local = getLocalMenu().map(it => (it._id === id ? { ...it, isAvailable: !currentStatus } : it));
      saveLocalMenu(local);
      return { success: true, data: updated, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, toggling availability locally', err.message);
      const local = getLocalMenu().map(it => {
        if (it._id === id) {
          return { ...it, isAvailable: !currentStatus, updatedAt: new Date().toISOString() };
        }
        return it;
      });
      saveLocalMenu(local);
      const updated = local.find(it => it._id === id);
      return { success: true, data: updated, source: 'local' };
    }
  },

  async deleteMenuItem(id) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item on server');
      const local = getLocalMenu().filter(it => it._id !== id);
      saveLocalMenu(local);
      return { success: true };
    } catch (err) {
      console.warn('Backend unavailable, deleting item locally', err.message);
      const local = getLocalMenu().filter(it => it._id !== id);
      saveLocalMenu(local);
      return { success: true, source: 'local' };
    }
  },

  // 2. ORDER APIS
  async placeOrder(orderPayload) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}`);
      }
      const data = await response.json();
      const createdOrder = data.data || data;
      // Sync to local
      const orders = getLocalOrders();
      saveLocalOrders([createdOrder, ...orders]);
      return { success: true, data: createdOrder, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, placing order into local store', err.message);
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

      const createdOrder = {
        _id: `ord-local-${Date.now()}`,
        orderNumber,
        ...orderPayload,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orders = getLocalOrders();
      saveLocalOrders([createdOrder, ...orders]);
      return { success: true, data: createdOrder, source: 'local' };
    }
  },

  async getOrders(params = {}) {
    const { status, search } = params;
    try {
      const queryParams = new URLSearchParams();
      if (status && status !== 'all') queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const response = await fetchWithTimeout(`${API_BASE_URL}/orders?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, fetching orders from local store', err.message);
      let orders = [...getLocalOrders()];

      if (status && status !== 'all') {
        orders = orders.filter(o => o.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        orders = orders.filter(o =>
          (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          (o.customerPhone && o.customerPhone.includes(q))
        );
      }
      return { success: true, data: orders, source: 'local' };
    }
  },

  async getOrderById(idOrOrderNumber) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders/${idOrOrderNumber}`);
      if (!response.ok) throw new Error('Order not found on server');
      const data = await response.json();
      return { success: true, data: data.data || data, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, searching order in local store', err.message);
      const orders = getLocalOrders();
      const found = orders.find(o =>
        o._id === idOrOrderNumber ||
        o.orderNumber?.toUpperCase() === idOrOrderNumber?.toUpperCase() ||
        o.customerPhone?.replace(/\D/g, '') === idOrOrderNumber?.replace(/\D/g, '')
      );
      if (found) {
        return { success: true, data: found, source: 'local' };
      }
      return { success: false, error: 'Order not found' };
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        // Fallback to PUT
        const fallbackRes = await fetchWithTimeout(`${API_BASE_URL}/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (!fallbackRes.ok) throw new Error('Failed to update status on server');
        const data = await fallbackRes.json();
        return { success: true, data: data.data || data, source: 'backend' };
      }
      const data = await response.json();
      const updated = data.data || data;
      // Sync local
      const orders = getLocalOrders().map(o => (o._id === orderId ? { ...o, status: newStatus } : o));
      saveLocalOrders(orders);
      return { success: true, data: updated, source: 'backend' };
    } catch (err) {
      console.warn('Backend unavailable, updating order status in local store', err.message);
      const orders = getLocalOrders().map(o => {
        if (o._id === orderId || o.orderNumber === orderId) {
          return { ...o, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return o;
      });
      saveLocalOrders(orders);
      const updated = orders.find(o => o._id === orderId || o.orderNumber === orderId);
      return { success: true, data: updated, source: 'local' };
    }
  },

  async getOrderStats() {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders/stats/summary`, { timeout: 3000 });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.data || data };
      }
    } catch {
      // Fallback calculation below
    }

    const orders = getLocalOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum), 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
    const readyOrders = orders.filter(o => o.status === 'ready').length;

    return {
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        activeOrders,
        readyOrders,
        todayOrdersCount: totalOrders
      }
    };
  }
};
