import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Phone, ChefHat, Sparkles, Check, ArrowRight, X, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function OrderConfirmationModal() {
  const { activeConfirmedOrder, setActiveConfirmedOrder, setIsTrackerOpen } = useCart();
  const [currentOrder, setCurrentOrder] = useState(activeConfirmedOrder);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCurrentOrder(activeConfirmedOrder);
  }, [activeConfirmedOrder]);

  // Periodic poll to check for order status updates from backend or local store
  useEffect(() => {
    if (!activeConfirmedOrder?._id && !activeConfirmedOrder?.orderNumber) return;

    const interval = setInterval(async () => {
      try {
        const idToQuery = activeConfirmedOrder.orderNumber || activeConfirmedOrder._id;
        const res = await api.getOrderById(idToQuery);
        if (res.success && res.data) {
          setCurrentOrder(res.data);
        }
      } catch (e) {
        // Ignore poll error
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeConfirmedOrder]);

  if (!activeConfirmedOrder || !currentOrder) return null;

  const statuses = [
    { key: 'pending', label: 'Placed', icon: CheckCircle2, desc: 'Received in kitchen queue' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Barista & kitchen crafted' },
    { key: 'ready', label: 'Ready', icon: Sparkles, desc: 'Ready for table or pickup' },
    { key: 'completed', label: 'Served', icon: Check, desc: 'Order delivered & enjoyed' },
  ];

  const getStatusIndex = (st) => {
    switch (st?.toLowerCase()) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(currentOrder.status);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.getOrderById(currentOrder.orderNumber || currentOrder._id);
      if (res.success && res.data) {
        setCurrentOrder(res.data);
      }
    } catch {}
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-warm-xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Confirmed Banner with celebration */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-stone-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={() => setActiveConfirmedOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-9 h-9 text-emerald-200" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Thank you, <strong className="text-white">{currentOrder.customerName}</strong>! Our kitchen has received your order.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-black/30 border border-white/20 text-xs font-mono font-bold tracking-wider text-emerald-300">
            <span>Order #: {currentOrder.orderNumber}</span>
          </div>
        </div>

        {/* Live Stepper Tracker */}
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <span>Live Preparation Stepper</span>
            </span>
            <button
              onClick={handleManualRefresh}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative flex items-center justify-between">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-stone-200 z-0" />
            
            {/* Active filled line */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 z-0"
              style={{
                width: `${currentIndex >= 0 ? (currentIndex / (statuses.length - 1)) * 100 : 0}%`,
              }}
            />

            {statuses.map((step, idx) => {
              const isPastOrCurrent = currentIndex >= idx;
              const isCurrent = currentIndex === idx;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-stone-400 border-2 border-stone-300'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                      isCurrent
                        ? 'text-emerald-700'
                        : isPastOrCurrent
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {currentOrder.status === 'cancelled' && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
              This order has been cancelled by staff.
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        <div className="p-6 space-y-4 max-h-72 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-stone-400 block font-normal">Table / Mode</span>
              <strong className="text-stone-800 font-bold text-sm">
                {currentOrder.tableNumber} ({currentOrder.orderType})
              </strong>
            </div>
            <div>
              <span className="text-stone-400 block font-normal">Estimated Prep Time</span>
              <strong className="text-amber-800 font-bold text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> ~10-15 mins
              </strong>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Ordered Items
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-[11px]">
                      {item.quantity}×
                    </span>
                    <span className="font-semibold text-stone-800">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>${currentOrder.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Tax (5%)</span>
              <span>${currentOrder.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-amber-200">
              <span>Total Paid / Due</span>
              <span className="text-amber-900 font-serif text-base">
                ${currentOrder.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          {currentOrder.notes && (
            <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              Special note: "{currentOrder.notes}"
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setActiveConfirmedOrder(null);
              setIsTrackerOpen(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Open in Order Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveConfirmedOrder(null)}
            className="py-3 px-5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-xs transition-colors"
          >
            Order More Items
          </button>
        </div>

      </div>
    </div>
  );
}
