import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Leaf, Wheat, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { MENU_CATEGORIES } from '../data/defaultMenu';
import MenuItemCard from './MenuItemCard';

export default function MenuSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });

  // Fetch menu items from API or fallback
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.getMenuItems({
        category: activeCategory,
        search: searchQuery,
        sort: sortOption,
        dietary: dietaryFilters,
      });
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [activeCategory, searchQuery, sortOption, dietaryFilters]);

  const toggleDietary = (key) => {
    setDietaryFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasActiveFilters =
    activeCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    dietaryFilters.vegetarian ||
    dietaryFilters.vegan ||
    dietaryFilters.glutenFree ||
    sortOption !== 'recommended';

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortOption('recommended');
    setDietaryFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 p-6 sm:p-10 text-white shadow-warm-xl overflow-hidden mb-8 border border-stone-800">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Daily
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Artisanal Roasts & Gourmet Dining
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
            From single-origin pour-overs to freshly laminated croissants and chef-curated brunch plates. Place your order directly from your table or pick up on the go.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="space-y-4 mb-8">
        
        {/* Top Controls: Search Input & Sort Options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, pastries, breakfast, sandwiches..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-stone-300/80 shadow-sm text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap hidden md:inline">
              Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white border border-stone-300/80 shadow-sm text-xs sm:text-sm font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="prep-time">Prep Time: Quickest</option>
            </select>
          </div>

        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-md shadow-amber-900/20 scale-[1.02]'
                    : 'bg-white text-stone-600 border-stone-200/90 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dietary Filter Badges & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Dietary:
            </span>

            <button
              onClick={() => toggleDietary('vegetarian')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                dietaryFilters.vegetarian
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-stone-100/80 text-stone-600 border-stone-200 hover:bg-stone-200/80'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Vegetarian</span>
            </button>

            <button
              onClick={() => toggleDietary('vegan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                dietaryFilters.vegan
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-stone-100/80 text-stone-600 border-stone-200 hover:bg-stone-200/80'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Vegan</span>
            </button>

            <button
              onClick={() => toggleDietary('glutenFree')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                dietaryFilters.glutenFree
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                  : 'bg-stone-100/80 text-stone-600 border-stone-200 hover:bg-stone-200/80'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span>Gluten-Free</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-4 flex items-center gap-1"
            >
              Reset all filters
            </button>
          )}
        </div>

      </div>

      {/* Menu Item Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-white border border-stone-200/80 p-4 space-y-4 animate-pulse">
              <div className="w-full h-48 bg-stone-200 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-full" />
              <div className="h-3 bg-stone-200 rounded w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-stone-200 rounded w-16" />
                <div className="h-8 bg-stone-200 rounded-xl w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-warm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">No menu items found</h3>
          <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
            We couldn't find any items matching your selected criteria. Try adjusting your search query or dietary filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 text-xs font-medium text-stone-500">
            <span>Showing <strong className="text-stone-800">{items.length}</strong> items in <span className="text-amber-800 font-bold">{activeCategory}</span></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
