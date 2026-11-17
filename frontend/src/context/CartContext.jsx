import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'aromarcraft_cart_items_v1';
const TABLE_STORAGE_KEY = 'aromarcraft_table_num_v1';

export function CartProvider({ children }) {
  const { addToast } = useToast();

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Table number state, checks query param ?table=X first
  const [tableNumber, setTableNumberState] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable) {
        return `Table ${urlTable.replace(/\D/g, '') || urlTable}`;
      }
      const saved = localStorage.getItem(TABLE_STORAGE_KEY);
      return saved || 'Table 4';
    } catch {
      return 'Table 4';
    }
  });

  const [orderType, setOrderType] = useState(() => {
    return tableNumber === 'Takeaway' ? 'takeaway' : 'dine-in';
  });

  // UI Modals state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeConfirmedOrder, setActiveConfirmedOrder] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  const setTableNumber = (table) => {
    setTableNumberState(table);
    try {
      localStorage.setItem(TABLE_STORAGE_KEY, table);
    } catch {}
    if (table === 'Takeaway') {
      setOrderType('takeaway');
    } else {
      setOrderType('dine-in');
    }
  };

  const addToCart = (item, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    addToast(`Added "${item.name}" to cart`, 'success');
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
    if (item) {
      addToast(`Removed "${item.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const { totalCount, subtotal, tax, totalAmount, maxPrepTime } = useMemo(() => {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
    const totalAmount = Math.round((subtotal + tax) * 100) / 100;
    const maxPrepTime = cartItems.reduce(
      (max, item) => Math.max(max, item.preparationTime || 5),
      5
    );

    return { totalCount, subtotal, tax, totalAmount, maxPrepTime };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        tax,
        totalAmount,
        maxPrepTime,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeConfirmedOrder,
        setActiveConfirmedOrder,
        isTrackerOpen,
        setIsTrackerOpen,
        isQrModalOpen,
        setIsQrModalOpen,
        quickViewItem,
        setQuickViewItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
