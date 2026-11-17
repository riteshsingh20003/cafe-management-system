import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Leaf, Wheat, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ItemQuickViewModal() {
  const { quickViewItem, setQuickViewItem, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [quickViewItem]);

  if (!quickViewItem) return null;

  const handleAdd = () => {
    addToCart(quickViewItem, quantity);
    setQuickViewItem(null);
  };

  const itemTotal = (quickViewItem.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-warm-xl border border-stone-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewItem(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Container */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-stone-100 overflow-hidden">
          <img
            src={quickViewItem.imageUrl}
            alt={quickViewItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
          
          {/* Dietary tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {quickViewItem.isVegan && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Leaf className="w-3 h-3" /> Vegan
              </span>
            )}
            {!quickViewItem.isVegan && quickViewItem.isVegetarian && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Leaf className="w-3 h-3" /> Vegetarian
              </span>
            )}
            {quickViewItem.isGlutenFree && (
              <span className="px-2.5 py-1 rounded-full bg-amber-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-sm">
                <Wheat className="w-3 h-3" /> Gluten Free
              </span>
            )}
          </div>
        </div>

        {/* Right: Details & Order Stepper */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {quickViewItem.category}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
              {quickViewItem.name}
            </h2>

            {/* Rating and prep time pills */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-stone-800">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{quickViewItem.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-xs text-stone-400 font-normal">(Customer Pick)</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1 text-sm text-stone-600 font-medium">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{quickViewItem.preparationTime || 5} min prep</span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mt-2">
              {quickViewItem.description}
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Prepared freshly to order by our artisan barista & kitchen team.</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 pt-5 border-t border-stone-100 space-y-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Select Quantity:
              </span>
              <div className="flex items-center rounded-xl bg-stone-100 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold transition-colors shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            {quickViewItem.isAvailable ? (
              <button
                onClick={handleAdd}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-900/30 flex items-center justify-between transition-all active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Order</span>
                </div>
                <span className="font-serif text-base">${itemTotal}</span>
              </button>
            ) : (
              <div className="py-3 px-4 rounded-xl bg-stone-100 text-stone-400 text-center text-sm font-semibold">
                Item currently unavailable
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
