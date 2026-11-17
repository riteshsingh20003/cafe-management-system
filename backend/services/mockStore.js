const mongoose = require('mongoose');
const seedMenuItems = require('../data/seedData');

/**
 * In-memory Mock Store
 * Activated automatically when MongoDB Atlas is not yet configured or reachable.
 * Allows zero-setup testing, frontend development, and automated test execution.
 */
class MockStore {
  constructor() {
    this.menuItems = [];
    this.orders = [];
    this.reset();
  }

  reset() {
    // Generate valid 24-hex-char MongoDB ObjectIds for all seed items
    this.menuItems = seedMenuItems.map((item, index) => {
      const hexId = (index + 1).toString(16).padStart(24, '0');
      return {
        _id: hexId,
        id: hexId,
        ...item,
        createdAt: new Date(Date.now() - (20 - index) * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - (20 - index) * 3600000).toISOString()
      };
    });
    this.orders = [];
  }

  // --- MENU ITEMS ---

  getMenuItems({ category, search, sortBy, availableOnly } = {}) {
    let result = [...this.menuItems];

    if (category && category !== 'All') {
      result = result.filter(
        (i) => i.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (availableOnly === 'true' || availableOnly === true) {
      result = result.filter((i) => i.isAvailable === true);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.category.toLowerCase().includes(term)
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    } else {
      // Default sort by createdAt descending
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  getCategoriesWithCounts() {
    const counts = {};
    for (const item of this.menuItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count
    }));
  }

  getMenuItemById(id) {
    return this.menuItems.find((i) => i._id.toString() === id.toString()) || null;
  }

  createMenuItem(data) {
    const newId = new mongoose.Types.ObjectId().toString();
    const item = {
      _id: newId,
      id: newId,
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      category: data.category,
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
      isVegetarian: Boolean(data.isVegetarian),
      isVegan: Boolean(data.isVegan),
      isGlutenFree: Boolean(data.isGlutenFree),
      rating: data.rating !== undefined ? Number(data.rating) : 4.8,
      preparationTime:
        data.preparationTime !== undefined ? Number(data.preparationTime) : 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.menuItems.unshift(item);
    return item;
  }

  updateMenuItem(id, data) {
    const index = this.menuItems.findIndex(
      (i) => i._id.toString() === id.toString()
    );
    if (index === -1) return null;

    const existing = this.menuItems[index];
    const updated = {
      ...existing,
      ...data,
      _id: existing._id,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };
    if (data.price !== undefined) updated.price = Number(data.price);
    if (data.rating !== undefined) updated.rating = Number(data.rating);
    if (data.preparationTime !== undefined)
      updated.preparationTime = Number(data.preparationTime);

    this.menuItems[index] = updated;
    return updated;
  }

  deleteMenuItem(id) {
    const index = this.menuItems.findIndex(
      (i) => i._id.toString() === id.toString()
    );
    if (index === -1) return null;
    const [deleted] = this.menuItems.splice(index, 1);
    return deleted;
  }

  // --- ORDERS ---

  getOrders({ status, phone, date } = {}) {
    let result = [...this.orders];

    if (status) {
      result = result.filter(
        (o) => o.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (phone) {
      result = result.filter((o) => o.customerPhone.includes(phone.trim()));
    }

    if (date) {
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().slice(0, 10);
        return orderDate === date;
      });
    }

    // Sort descending by creation date
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }

  getOrderById(id) {
    return (
      this.orders.find(
        (o) => o._id.toString() === id.toString() || o.id === id
      ) || null
    );
  }

  getOrderByOrderNumber(orderNumber) {
    return (
      this.orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === orderNumber.toUpperCase().trim()
      ) || null
    );
  }

  createOrder(orderData) {
    const newId = new mongoose.Types.ObjectId().toString();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      _id: newId,
      id: newId,
      orderNumber,
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      tableNumber: orderData.tableNumber || 'Takeaway',
      orderType: orderData.orderType || 'dine-in',
      items: orderData.items,
      subtotal: Number(orderData.subtotal),
      tax: Number(orderData.tax || 0),
      totalAmount: Number(orderData.totalAmount),
      status: 'pending',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(id, newStatus) {
    const order = this.orders.find(
      (o) => o._id.toString() === id.toString() || o.id === id
    );
    if (!order) return null;

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

const mockStore = new MockStore();

module.exports = mockStore;
