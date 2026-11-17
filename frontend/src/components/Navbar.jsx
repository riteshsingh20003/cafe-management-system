import React from 'react';
import { Coffee, ShoppingBag, Search, QrCode, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentView, setCurrentView }) {
  const { totalCount, setCartDrawerOpen, tableNumber, setIsQrModalOpen, setIsTrackerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Cafe Branding */}
          <div 
            onClick={() => setCurrentView('customer')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/40 group-hover:scale-105 transition-transform duration-300">
              <Coffee className="w-6 h-6 text-amber-50" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  AromaCraft
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> Roastery
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium tracking-wide">
                Specialty Coffee & Artisan Kitchen
              </p>
            </div>
          </div>

          {/* Center / Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Table Badge & QR Dine-in experience */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 text-xs sm:text-sm font-medium text-amber-200 hover:text-amber-100 transition-all shadow-sm group"
              title="Change Table or Scan QR Code"
            >
              <QrCode className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden xs:inline text-stone-300 font-normal">Dine-in:</span>
              <span className="font-semibold text-amber-300">{tableNumber}</span>
            </button>

            {/* Order Tracker Button */}
            <button
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 text-xs sm:text-sm font-medium text-stone-300 hover:text-white transition-all shadow-sm"
              title="Track Order Status"
            >
              <Search className="w-4 h-4 text-stone-400" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* View Switcher: Customer vs Staff Portal */}
            <button
              onClick={() => setCurrentView(currentView === 'customer' ? 'staff' : 'customer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                currentView === 'staff'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/50'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
              }`}
              title="Switch to Staff Management Portal"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {currentView === 'staff' ? 'Customer Menu' : 'Staff Portal'}
              </span>
              <span className="sm:hidden">
                {currentView === 'staff' ? 'Menu' : 'Staff'}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center justify-center p-2.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm shadow-md shadow-amber-900/40 hover:shadow-amber-900/60 transition-all group active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline ml-2 font-semibold">Cart</span>
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce-short">
                  {totalCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
