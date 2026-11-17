import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    cartDrawerOpen,
    setCartDrawerOpen,
    totalCount,
    subtotal,
    tax,
    totalAmount,
    maxPrepTime,
    updateQuantity,
    removeFromCart,
    clearCart,
    tableNumber,
    orderType,
    setIsCheckoutOpen,
    setIsQrModalOpen,
  } = useCart();

  if (!cartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setCartDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark backdrop overlay */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-warm-xl flex flex-col h-full border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold">Your Order Cart</h2>
                <p className="text-xs text-stone-400">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setCartDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table / Order Destination Indicator Bar */}
          <div className="px-6 py-2.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>Ordering for: <strong className="font-bold">{tableNumber}</strong> ({orderType})</span>
            </div>
            <button
              onClick={() => {
                setCartDrawerOpen(false);
                setIsQrModalOpen(true);
              }}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline"
            >
              Change
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-400">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Browse our artisanal coffees, freshly baked pastries, and savory brunch menu to start your order.
                </p>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                >
                  Explore Cafe Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 hover:border-amber-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-200"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-amber-800 block mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                      <span className="text-[10px] text-stone-400 font-normal ml-1">
                        (${item.price.toFixed(2)} ea)
                      </span>
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg bg-white border border-stone-200 shadow-xs">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-stone-400 hover:text-rose-500 p-1 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Total */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200 bg-stone-50/90 space-y-4">
              
              {/* Prep time estimate banner */}
              <div className="flex items-center justify-between text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Estimated Kitchen Prep:</span>
                </div>
                <span className="font-bold text-stone-800">~{maxPrepTime} mins</span>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax (5% Cafe GST)</span>
                  <span className="font-semibold text-stone-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-xl text-amber-900">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-600 py-1 transition-colors"
              >
                Clear all items
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
