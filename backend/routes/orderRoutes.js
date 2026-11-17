const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  trackOrderByNumber,
  updateOrderStatus
} = require('../controllers/orderController');
const {
  validateOrderCreate,
  validateOrderStatus
} = require('../middleware/validator');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order lifecycle, customer ordering, live tracking, and status transitions
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new cafe order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Maya Lin
 *               customerPhone:
 *                 type: string
 *                 example: "+1-555-019-2834"
 *               tableNumber:
 *                 type: string
 *                 example: "Table 4"
 *               orderType:
 *                 type: string
 *                 enum: [dine-in, takeaway]
 *                 example: "dine-in"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItem
 *                     - quantity
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       example: "000000000000000000000001"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               notes:
 *                 type: string
 *                 example: "Oat milk please, extra hot"
 *     responses:
 *       201:
 *         description: Order created with calculated total and unique orderNumber
 *       400:
 *         description: Validation failed or item unavailable
 */
router.post('/', validateOrderCreate, placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve list of orders with optional status, phone, or date filtering
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, completed, cancelled]
 *         description: Filter orders by status
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter orders by customer phone number
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of orders matching criteria
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /api/orders/track/{orderNumber}:
 *   get:
 *     summary: Live customer tracking by human-friendly orderNumber
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Order reference code (e.g., ORD-20261117-4821)
 *     responses:
 *       200:
 *         description: Order found with live status
 *       404:
 *         description: Order not found
 */
router.get('/track/:orderNumber', trackOrderByNumber);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by MongoDB ObjectId
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ObjectId
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, completed, cancelled]
 *                 example: preparing
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 */
router.patch('/:id/status', validateOrderStatus, updateOrderStatus);

module.exports = router;
