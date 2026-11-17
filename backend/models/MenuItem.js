const mongoose = require('mongoose');

const MENU_CATEGORIES = [
  'Coffee',
  'Tea & Beverages',
  'Bakery & Pastries',
  'Breakfast & Brunch',
  'Sandwiches & Savory',
  'Desserts'
];

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: MENU_CATEGORIES,
        message: '{VALUE} is not a valid category'
      }
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating cannot exceed 5.0']
    },
    preparationTime: {
      type: Number,
      default: 10,
      min: [1, 'Preparation time must be at least 1 minute']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = {
  MenuItem,
  MENU_CATEGORIES
};
