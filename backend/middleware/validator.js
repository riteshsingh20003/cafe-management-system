const { body, param, query, validationResult } = require('express-validator');
const { MENU_CATEGORIES } = require('../models/MenuItem');
const { ORDER_STATUSES, ORDER_TYPES } = require('../models/Order');

/**
 * Middleware to extract and format validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed for request parameters',
      errors: formattedErrors
    });
  }
  next();
};

/**
 * Validation rules for creating a menu item
 */
const validateMenuCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Menu item description is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a number greater than 0'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(MENU_CATEGORIES)
    .withMessage(`Category must be one of: ${MENU_CATEGORIES.join(', ')}`),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Image URL must be a valid web URL'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean value'),
  body('isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean value'),
  body('isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean value'),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1.0 and 5.0'),
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Preparation time must be between 1 and 120 minutes'),
  handleValidationErrors
];

/**
 * Validation rules for updating a menu item
 */
const validateMenuUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 }),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn(MENU_CATEGORIES)
    .withMessage(`Category must be one of: ${MENU_CATEGORIES.join(', ')}`),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('isAvailable')
    .optional()
    .isBoolean(),
  body('isVegetarian')
    .optional()
    .isBoolean(),
  body('isVegan')
    .optional()
    .isBoolean(),
  body('isGlutenFree')
    .optional()
    .isBoolean(),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 }),
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 }),
  handleValidationErrors
];

/**
 * Validation rules for creating an order
 */
const validateOrderCreate = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Customer name must be between 2 and 60 characters'),
  body('customerPhone')
    .trim()
    .notEmpty()
    .withMessage('Customer phone number is required')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$|^[0-9]{7,15}$/)
    .withMessage('Customer phone must be a valid 7 to 15 digit telephone number'),
  body('tableNumber')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Table number/identifier must not exceed 20 characters'),
  body('orderType')
    .optional()
    .isIn(ORDER_TYPES)
    .withMessage(`Order type must be one of: ${ORDER_TYPES.join(', ')}`),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Each item must have a valid menuItem ID'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be an integer between 1 and 50'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Special instructions/notes cannot exceed 300 characters'),
  handleValidationErrors
];

/**
 * Validation rules for updating order status
 */
const validateOrderStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateMenuCreate,
  validateMenuUpdate,
  validateOrderCreate,
  validateOrderStatus
};
