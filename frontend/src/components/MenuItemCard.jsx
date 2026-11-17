import React from 'react';
import { Plus, Minus, Star, Clock, Leaf, Wheat, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MenuItemCard({ item }) {
  const { cartItems, addToCart, updateQuantity, setQuickViewItem } = useCart();

  const cartItem = cartItems.find((i) => i._id === item._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/80 shadow-warm hover:shadow-warm-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      
      {/* Image Container */}
      <div 
        onClick={() => setQuickViewItem(item)}
        className="relative w-full h-48 sm:h-52 overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay for badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Rating & Prep Time Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{item.rating?.toFixed(1) || '4.8'}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-stone-200 text-xs font-medium shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{item.preparationTime || 5}m</span>
          </div>
        </div>

        {/* Dietary Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {item.isVegan && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm shadow-sm flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5" /> Vegan
            </span>
          )}
          {!item.isVegan && item.isVegetarian && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-700/90 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm shadow-sm flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </span>
          )}
          {item.isGlutenFree && (
            <span className="px-2 py-0.5 rounded-full bg-amber-600/90 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm shadow-sm flex items-center gap-1">
              <Wheat className="w-2.5 h-2.5" /> GF
            </span>
          )}
        </div>

        {/* Quick View Pill (Hover indicator) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-stone-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-300" /> Quick View
          </span>
        </div>

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-widest rounded-full shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Item Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {item.category}
            </span>
          </div>

          <h3 
            onClick={() => setQuickViewItem(item)}
            className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
          >
            {item.name}
          </h3>

          <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Price & Add to Cart */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-400 block font-normal">Price</span>
            <span className="font-serif text-xl font-extrabold text-stone-900">
              ${item.price.toFixed(2)}
            </span>
          </div>

          <div>
            {!item.isAvailable ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : quantityInCart === 0 ? (
              <button
                onClick={() => addToCart(item)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-warm transition-all duration-200 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center rounded-xl bg-amber-50 border border-amber-300 p-1 shadow-sm">
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-amber-100 text-stone-700 flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-extrabold text-amber-950">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
