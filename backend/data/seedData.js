/**
 * Initial seed data for Cafe Menu
 * Contains 20 realistic, high quality cafe items across all 6 categories
 */
const seedMenuItems = [
  // COFFEE
  {
    name: 'Artisan Espresso',
    description: 'Double shot of single-origin Ethiopian Yirgacheffe with bright floral notes of bergamot, jasmine, and dark chocolate.',
    price: 3.75,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    rating: 4.9,
    preparationTime: 3
  },
  {
    name: 'Velvet Flat White',
    description: 'Silky microfoam delicately poured over a double ristretto espresso, delivering a rich, velvety texture and balanced sweetness.',
    price: 4.95,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.8,
    preparationTime: 5
  },
  {
    name: 'Madagascar Vanilla Bean Latte',
    description: 'House-infused Madagascar vanilla bean syrup, espresso, and silky steamed oat milk dusted with organic cinnamon.',
    price: 5.50,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    rating: 4.9,
    preparationTime: 5
  },
  {
    name: 'Single-Origin Cold Brew Reserve',
    description: 'Slow-steeped for 18 hours using Colombian Supremo beans. Naturally sweet, ultra-smooth, served over crystal clear ice with citrus aroma.',
    price: 5.25,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    rating: 4.7,
    preparationTime: 2
  },
  {
    name: 'Sea Salt Caramel Macchiato',
    description: 'Freshly steamed whole milk marked with bold espresso, layered with house-made fleur de sel caramel drizzle.',
    price: 5.75,
    category: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.8,
    preparationTime: 6
  },

  // TEA & BEVERAGES
  {
    name: 'Ceremonial Uji Matcha Latte',
    description: 'First-harvest Japanese ceremonial grade matcha whisked with warm oat milk and a touch of wild organic agave nectar.',
    price: 5.95,
    category: 'Tea & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    rating: 4.9,
    preparationTime: 5
  },
  {
    name: 'Royal Spiced Chai Blossom',
    description: 'Slow-simmered Assam black tea with crushed green cardamom, cinnamon bark, fresh ginger root, and clover honey.',
    price: 5.25,
    category: 'Tea & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.8,
    preparationTime: 5
  },
  {
    name: 'Sparkling White Peach Hibiscus',
    description: 'Cold-steeped organic Egyptian hibiscus blossoms infused with white peach puree and effervescent sparkling water.',
    price: 4.75,
    category: 'Tea & Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    rating: 4.7,
    preparationTime: 3
  },

  // BAKERY & PASTRIES
  {
    name: 'Twice-Baked Almond Croissant',
    description: 'Flaky artisanal French butter croissant filled with rich almond frangipane cream, topped with toasted sliced almonds and powdered sugar.',
    price: 4.95,
    category: 'Bakery & Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.9,
    preparationTime: 4
  },
  {
    name: 'Wild Blueberry & Meyer Lemon Scone',
    description: 'Tender golden scone bursting with sweet wild blueberries, topped with a zesty, fragrant Meyer lemon sugar glaze.',
    price: 4.50,
    category: 'Bakery & Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.6,
    preparationTime: 3
  },
  {
    name: 'Pistachio Cardamom Danish',
    description: 'Crisp laminated pastry swirl baked with roasted Bronte pistachio paste and delicate hints of ground green cardamom.',
    price: 5.25,
    category: 'Bakery & Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    preparationTime: 4
  },

  // BREAKFAST & BRUNCH
  {
    name: 'Artisan Avocado Sourdough Tartine',
    description: 'Creamy Hass avocado on toasted country sourdough with Persian dukkah spice, heirloom cherry tomatoes, pickled red onions, and radish microgreens.',
    price: 11.50,
    category: 'Breakfast & Brunch',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    rating: 4.9,
    preparationTime: 10
  },
  {
    name: 'Truffled Forest Mushroom Brioche',
    description: 'Pan-seared cremini & shiitake mushrooms in garlic-thyme compound butter, poached organic farm egg, and black truffle oil on toasted brioche.',
    price: 13.50,
    category: 'Breakfast & Brunch',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    preparationTime: 12
  },
  {
    name: 'Amazonian Acai Superfood Bowl',
    description: 'Thick organic acai blend topped with gluten-free coconut almond granola, chia seeds, fresh blueberries, banana slices, and raw wildflower honey.',
    price: 10.95,
    category: 'Breakfast & Brunch',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.7,
    preparationTime: 7
  },
  {
    name: 'Wild Salmon & Chive Bagel',
    description: 'Toasted artisan everything bagel with wild Alaskan smoked salmon, whipped dill-chive cream cheese, caper berries, and crisp cucumber.',
    price: 12.95,
    category: 'Breakfast & Brunch',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.9,
    preparationTime: 8
  },

  // SANDWICHES & SAVORY
  {
    name: 'Prosciutto di Parma & Burrata Panini',
    description: 'Aged Prosciutto di Parma, creamy Pugliese burrata, wild baby arugula, and aged Modena balsamic glaze pressed on warm artisan ciabatta.',
    price: 13.95,
    category: 'Sandwiches & Savory',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.9,
    preparationTime: 10
  },
  {
    name: 'Charred Veggie & Basil Pesto Focaccia',
    description: 'Grilled zucchini, fire-roasted sweet bell peppers, house-made genovese basil pesto, and fresh goat cheese on rosemary sea-salt focaccia.',
    price: 11.95,
    category: 'Sandwiches & Savory',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.7,
    preparationTime: 8
  },
  {
    name: 'Hickory Smoked Turkey & Havarti Melt',
    description: 'Slow-roasted smoked turkey breast, melted Danish havarti, honey Dijon aioli, and crisp Granny Smith apple slices on seeded artisan sourdough.',
    price: 12.50,
    category: 'Sandwiches & Savory',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    preparationTime: 10
  },

  // DESSERTS
  {
    name: 'Valrhona Molten Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with an oozy 70% Valrhona ganache center, served with Madagascan vanilla bean gelato and cocoa dust.',
    price: 7.50,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.9,
    preparationTime: 8
  },
  {
    name: 'San Sebastián Basque Burnt Cheesecake',
    description: 'Traditional Spanish crustless cheesecake with a deeply caramelized exterior and an ultra-creamy, custard-like center, accompanied by raspberry coulis.',
    price: 6.95,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.8,
    preparationTime: 4
  }
];

module.exports = seedMenuItems;
