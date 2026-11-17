import React, { useState } from 'react';
import { X, User, Phone, MapPin, MessageSquare, ShoppingBag, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotal,
    tax,
    totalAmount,
    maxPrepTime,
    tableNumber,
    setTableNumber,
    orderType,
    setOrderType,
    clearCart,
    setActiveConfirmedOrder,
  } = useCart();

  const { addToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedTable, setSelectedTable] = useState(
    tableNumber === 'Takeaway' ? 'Table 4' : tableNumber
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your name';
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      errs.customerPhone = 'Please provide a valid contact phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      setIsCheckoutOpen(false);
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      tableNumber: orderType === 'takeaway' ? 'Takeaway' : selectedTable,
      orderType: orderType,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      totalAmount,
      notes: specialNotes.trim(),
    };

    try {
      const res = await api.placeOrder(orderPayload);
      if (res.success) {
        addToast(`Order placed successfully! Order #${res.data.orderNumber}`, 'success');
        clearCart();
        setIsCheckoutOpen(false);
        setActiveConfirmedOrder(res.data);
      } else {
        throw new Error(res.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order error:', err);
      addToast(err.message || 'Could not place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-warm-xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Complete Your Order</h3>
              <p className="text-xs text-stone-400">Direct instant checkout — no login required</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5">
          
          {/* Order Type Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Dining Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                  orderType === 'dine-in'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>🍽️ Dine-In Table</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`py-3 px-4 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>🛍️ Takeaway / Pickup</span>
              </button>
            </div>
          </div>

          {/* Table selection if dine-in */}
          {orderType === 'dine-in' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Table Number
              </label>
              <select
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value);
                  setTableNumber(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {Array.from({ length: 15 }, (_, i) => `Table ${i + 1}`).map((tbl) => (
                  <option key={tbl} value={tbl}>
                    {tbl}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors({ ...errors, customerName: null });
                }}
                placeholder="e.g. Alexander Wright"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.customerName ? 'border-rose-400 ring-1 ring-rose-400' : 'border-stone-300'
                }`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerName}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Phone Number (For Order Updates) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.customerPhone) setErrors({ ...errors, customerPhone: null });
                }}
                placeholder="e.g. (555) 234-5678"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.customerPhone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-stone-300'
                }`}
              />
            </div>
            {errors.customerPhone && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customerPhone}</p>
            )}
          </div>

          {/* Preparation Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Special Requests or Dietary Notes (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Oat milk substitute, sugar on the side, extra hot espresso..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Order Summary Snapshot */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-stone-700">
              <span>{cartItems.reduce((a, b) => a + b.quantity, 0)} Items Selected</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Tax (5%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-serif font-bold text-stone-900 pt-2 border-t border-amber-200">
              <span>Total Payable</span>
              <span className="text-base text-amber-900">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-amber-400 text-white font-bold text-sm shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting Your Order...</span>
              </>
            ) : (
              <>
                <span>Confirm & Place Order • ${totalAmount.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pay at counter or seamlessly when order arrives.</span>
          </p>

        </form>

      </div>
    </div>
  );
}
