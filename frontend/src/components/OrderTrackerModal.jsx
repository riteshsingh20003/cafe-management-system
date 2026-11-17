import React, { useState } from 'react';
import { X, Search, Clock, ChefHat, Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw, Calendar, Phone, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function OrderTrackerModal() {
  const { isTrackerOpen, setIsTrackerOpen } = useCart();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searchError, setSearchError] = useState(null);

  if (!isTrackerOpen) return null;

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearchError(null);
    try {
      const res = await api.getOrderById(query.trim());
      if (res.success && res.data) {
        setTrackedOrder(res.data);
      } else {
        setTrackedOrder(null);
        setSearchError('No order found matching that order number or phone number. Please check and try again.');
      }
    } catch (err) {
      setTrackedOrder(null);
      setSearchError('Could not locate order. Please check the order number or phone.');
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { key: 'pending', label: 'Placed', icon: CheckCircle2, desc: 'Received in kitchen queue' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Barista & kitchen crafted' },
    { key: 'ready', label: 'Ready', icon: Sparkles, desc: 'Ready for table or pickup' },
    { key: 'completed', label: 'Completed', icon: Check, desc: 'Enjoy your artisan coffee!' },
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

  const currentIndex = trackedOrder ? getStatusIndex(trackedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-warm-xl border border-stone-200 overflow-hidden text-stone-800">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Track Your Order</h3>
              <p className="text-xs text-stone-400">Real-time status updates directly from our cafe kitchen</p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order # (e.g. ORD-20261117-1011) or Phone #"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Look Up'}
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-stone-500 overflow-x-auto">
            <span className="shrink-0">Try demo orders:</span>
            <button
              onClick={() => {
                setQuery('ORD-20261117-1011');
                api.getOrderById('ORD-20261117-1011').then(r => r.success && setTrackedOrder(r.data));
              }}
              className="px-2 py-0.5 rounded-lg bg-stone-200 hover:bg-stone-300 font-mono text-stone-700"
            >
              ORD-20261117-1011
            </button>
            <button
              onClick={() => {
                setQuery('ORD-20261117-1012');
                api.getOrderById('ORD-20261117-1012').then(r => r.success && setTrackedOrder(r.data));
              }}
              className="px-2 py-0.5 rounded-lg bg-stone-200 hover:bg-stone-300 font-mono text-stone-700"
            >
              ORD-20261117-1012
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
          {searchError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {!trackedOrder && !searchError && (
            <div className="text-center py-10 text-stone-400">
              <Utensils className="w-12 h-12 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold text-stone-700">Enter your order identifier above</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Check progress from when your beans are ground to the moment your plate is ready.
              </p>
            </div>
          )}

          {trackedOrder && (
            <div className="space-y-5">
              
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                    Order Number
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-950">
                    {trackedOrder.orderNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                    Status
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trackedOrder.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : trackedOrder.status === 'ready'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : trackedOrder.status === 'preparing'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-stone-200 text-stone-800'
                  }`}>
                    {trackedOrder.status}
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-stone-200 z-0" />
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
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                              : isPastOrCurrent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-stone-400 border-2 border-stone-300'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-1.5 ${
                            isCurrent ? 'text-emerald-700' : isPastOrCurrent ? 'text-stone-800' : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer and Table Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block font-normal">Customer Name</span>
                  <strong className="text-stone-800 font-bold">{trackedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block font-normal">Destination</span>
                  <strong className="text-stone-800 font-bold">
                    {trackedOrder.tableNumber} ({trackedOrder.orderType})
                  </strong>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                {trackedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="p-3 bg-stone-50 flex justify-between font-bold text-sm text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-amber-900 font-serif">${trackedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
