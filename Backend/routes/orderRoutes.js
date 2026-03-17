import express from 'express';
import Order from '../model/orderModel.js';
const router = express.Router();

// const { authenticate } = require('../middleware/auth');

// Get order tracking info (public with order ID)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .select('orderId status trackingNumber shippingAddress createdAt')
      .populate('items.productId', 'name')
      .populate('items.sellerId', 'shopName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

export default router;