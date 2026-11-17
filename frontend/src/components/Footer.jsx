import React from 'react';
import { Coffee, MapPin, Phone, Clock, Heart, QrCode, Search, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Footer({ setCurrentView }) {
  const { setIsQrModalOpen, setIsTrackerOpen } = useCart();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white">AromaCraft</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Crafting exceptional single-origin brews, fresh-laminated pastries, and hearty artisan brunch since 2018. Experience seamless table dining or takeaway.
            </p>
          </div>

          {/* Quick Dining Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Dine-In & Orders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan / Select Table QR</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Existing Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('staff')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-stone-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Staff & Kitchen Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Cafe Hours
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="text-stone-200 font-semibold">6:30 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday:</span>
                <span className="text-stone-200 font-semibold">7:00 AM – 9:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Kitchen opens daily with fresh morning bakes</span>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Visit Us
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>482 Roastery Lane, Artisan Quarter, Seattle, WA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(555) 749-2633</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 AromaCraft Cafe & Roastery. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Powered by</span>
            <span className="text-amber-400 font-semibold">AromaCraft Order Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
