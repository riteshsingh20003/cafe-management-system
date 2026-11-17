const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const {
  validateMenuCreate,
  validateMenuUpdate
} = require('../middleware/validator');

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Cafe Menu Items management and catalog querying
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Retrieve list of menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category (e.g. Coffee, Desserts)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching name, description, or category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, rating, name]
 *         description: Sort field and direction
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *         description: When true, returns only items currently in stock
 *     responses:
 *       200:
 *         description: Successfully fetched menu items
 */
router.get('/', getMenuItems);

/**
 * @swagger
 * /api/menu/categories:
 *   get:
 *     summary: Retrieve distinct categories and count of items in each
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Array of categories with counts
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Retrieve single menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the item
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Item not found
 */
router.get('/:id', getMenuItemById);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Iced Oat Caramel Macchiato
 *               description:
 *                 type: string
 *                 example: Rich espresso over chilled oat milk with salted caramel drizzle.
 *               price:
 *                 type: number
 *                 example: 5.75
 *               category:
 *                 type: string
 *                 enum: [Coffee, Tea & Beverages, Bakery & Pastries, Breakfast & Brunch, Sandwiches & Savory, Desserts]
 *                 example: Coffee
 *               imageUrl:
 *                 type: string
 *                 example: https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               isVegetarian:
 *                 type: boolean
 *                 example: true
 *               isVegan:
 *                 type: boolean
 *                 example: true
 *               isGlutenFree:
 *                 type: boolean
 *                 example: true
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               preparationTime:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Menu item successfully created
 *       400:
 *         description: Validation failed
 */
router.post('/', validateMenuCreate, createMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update an existing menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu item successfully updated
 *       404:
 *         description: Item not found
 */
router.put('/:id', validateMenuUpdate, updateMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ObjectId
 *     responses:
 *       200:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
router.delete('/:id', deleteMenuItem);

module.exports = router;
