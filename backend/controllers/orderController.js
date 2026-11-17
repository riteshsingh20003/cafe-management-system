const { Order, ORDER_STATUSES } = require('../models/Order');
const { MenuItem } = require('../models/MenuItem');
const { isDatabaseConnected } = require('../config/db');
const mockStore = require('../services/mockStore');

const TAX_RATE = 0.08; // 8% sales tax

/**
 * @desc   Place a new customer order
 * @route  POST /api/orders
 * @access Public
 */
const placeOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      tableNumber = 'Takeaway',
      orderType = 'dine-in',
      items,
      notes = ''
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Resolve each item to its authoritative database price to prevent client tampering
    const processedItems = [];
    let calculatedSubtotal = 0;

    for (const requestedItem of items) {
      const itemId = requestedItem.menuItem || requestedItem._id || requestedItem.id;
      const quantity = Math.max(1, parseInt(requestedItem.quantity, 10) || 1);

      let foundItem = null;

      if (!isDatabaseConnected()) {
        foundItem = mockStore.getMenuItemById(itemId);
      } else {
        foundItem = await MenuItem.findById(itemId);
      }

      if (!foundItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID '${itemId}' does not exist or is no longer available`
        });
      }

      if (!foundItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `'${foundItem.name}' is currently out of stock`
        });
      }

      const itemTotal = Number((foundItem.price * quantity).toFixed(2));
      calculatedSubtotal += itemTotal;

      processedItems.push({
        menuItem: foundItem._id,
        name: foundItem.name,
        price: foundItem.price,
        quantity
      });
    }

    // Calculate authoritative totals server-side
    const subtotal = Number(calculatedSubtotal.toFixed(2));
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    if (!isDatabaseConnected()) {
      const newOrder = mockStore.createOrder({
        customerName,
        customerPhone,
        tableNumber: tableNumber || 'Takeaway',
        orderType: orderType || 'dine-in',
        items: processedItems,
        subtotal,
        tax,
        totalAmount,
        notes
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (Mock Mode)',
        data: newOrder
      });
    }

    // Generate unique order number
    const orderNumber = Order.generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      customerName,
      customerPhone,
      tableNumber: tableNumber || 'Takeaway',
      orderType: orderType || 'dine-in',
      items: processedItems,
      subtotal,
      tax,
      totalAmount,
      status: 'pending',
      notes
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all orders with filtering and sorting
 * @route  GET /api/orders
 * @access Public / Staff
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { status, phone, date } = req.query;

    if (!isDatabaseConnected()) {
      const orders = mockStore.getOrders({ status, phone, date });
      return res.status(200).json({
        success: true,
        count: orders.length,
        dataSource: 'mock_store',
        data: orders
      });
    }

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    if (phone && phone.trim()) {
      filter.customerPhone = { $regex: phone.trim(), $options: 'i' };
    }

    if (date) {
      // Date in YYYY-MM-DD
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(filter)
      .populate('items.menuItem', 'imageUrl category preparationTime')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      dataSource: 'mongodb',
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single order by Mongo ID
 * @route  GET /api/orders/:id
 * @access Public / Staff
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const order = mockStore.getOrderById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Order with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        data: order
      });
    }

    const order = await Order.findById(id).populate(
      'items.menuItem',
      'imageUrl category preparationTime'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Track order by human-readable Order Number (e.g. ORD-20261117-1234)
 * @route  GET /api/orders/track/:orderNumber
 * @access Public
 */
const trackOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber || !orderNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required for tracking'
      });
    }

    if (!isDatabaseConnected()) {
      const order = mockStore.getOrderByOrderNumber(orderNumber);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: `No active order found matching order number '${orderNumber}'`
        });
      }
      return res.status(200).json({
        success: true,
        data: order
      });
    }

    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') }
    }).populate('items.menuItem', 'imageUrl category preparationTime');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `No active order found matching order number '${orderNumber}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update order status (pending -> preparing -> ready -> completed / cancelled)
 * @route  PATCH /api/orders/:id/status
 * @access Staff / Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`
      });
    }

    if (!isDatabaseConnected()) {
      const updated = mockStore.updateOrderStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Order with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: `Order status updated to '${status}' (Mock Mode)`,
        data: updated
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.menuItem', 'imageUrl category preparationTime');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getOrderById,
  trackOrderByNumber,
  updateOrderStatus
};
