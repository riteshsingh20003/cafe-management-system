const { MenuItem, MENU_CATEGORIES } = require('../models/MenuItem');
const { isDatabaseConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

/**
 * @desc   Fetch menu items with filtering, search, and sorting
 * @route  GET /api/menu
 * @access Public
 */
const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, sortBy, availableOnly } = req.query;

    if (!isDatabaseConnected()) {
      const items = mockStore.getMenuItems({ category, search, sortBy, availableOnly });
      return res.status(200).json({
        success: true,
        count: items.length,
        dataSource: 'mock_store',
        data: items
      });
    }

    // Build MongoDB filter query
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (availableOnly === 'true' || availableOnly === true) {
      filter.isAvailable = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ];
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOptions = { price: 1 };
    else if (sortBy === 'price_desc') sortOptions = { price: -1 };
    else if (sortBy === 'rating') sortOptions = { rating: -1 };
    else if (sortBy === 'name') sortOptions = { name: 1 };

    const items = await MenuItem.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: items.length,
      dataSource: 'mongodb',
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get list of distinct categories with item counts
 * @route  GET /api/menu/categories
 * @access Public
 */
const getCategories = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      const categoryData = mockStore.getCategoriesWithCounts();
      return res.status(200).json({
        success: true,
        count: categoryData.length,
        data: categoryData
      });
    }

    const aggregated = await MenuItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      },
      {
        $sort: { category: 1 }
      }
    ]);

    // Ensure all defined categories appear even if count is 0
    const presentCategories = new Set(aggregated.map((c) => c.category));
    MENU_CATEGORIES.forEach((cat) => {
      if (!presentCategories.has(cat)) {
        aggregated.push({ category: cat, count: 0 });
      }
    });

    return res.status(200).json({
      success: true,
      count: aggregated.length,
      data: aggregated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Fetch single menu item by ID
 * @route  GET /api/menu/:id
 * @access Public
 */
const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const item = mockStore.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        data: item
      });
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new menu item
 * @route  POST /api/menu
 * @access Public / Admin
 */
const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable,
      isVegetarian,
      isVegan,
      isGlutenFree,
      rating,
      preparationTime
    } = req.body;

    if (!isDatabaseConnected()) {
      const newItem = mockStore.createMenuItem({
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
        isVegetarian,
        isVegan,
        isGlutenFree,
        rating,
        preparationTime
      });
      return res.status(201).json({
        success: true,
        message: 'Menu item created successfully (Mock Mode)',
        data: newItem
      });
    }

    const newItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      imageUrl,
      isAvailable,
      isVegetarian,
      isVegan,
      isGlutenFree,
      rating,
      preparationTime
    });

    return res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing menu item
 * @route  PUT /api/menu/:id
 * @access Public / Admin
 */
const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const updated = mockStore.updateMenuItem(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Menu item updated successfully (Mock Mode)',
        data: updated
      });
    }

    const updated = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete menu item
 * @route  DELETE /api/menu/:id
 * @access Public / Admin
 */
const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const deleted = mockStore.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Menu item with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully (Mock Mode)',
        data: deleted
      });
    }

    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
