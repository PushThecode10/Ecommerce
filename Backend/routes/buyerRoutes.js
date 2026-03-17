import express from 'express';
const router = express.Router();
import * as buyerController from '../controllers/buyerController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

// Public routes (no authentication required)
router.get('/products', buyerController.getProducts);
router.get('/products/:productId', buyerController.getProductById);

// Protected routes (buyer authentication required)
router.use(authenticate);
router.use(authorize('buyer'));

// Cart management
router.post('/cart/add', buyerController.addToCart);
router.get('/cart', buyerController.getCart);
router.put('/cart/:itemId', buyerController.updateCartItem);
router.delete('/cart/:itemId', buyerController.removeFromCart);
router.delete('/cart', buyerController.clearCart);

// Order management
router.post('/orders', buyerController.createOrder);
router.get('/orders', buyerController.getMyOrders);
router.get('/orders/:orderId', buyerController.getOrderById);
router.put('/orders/:orderId/cancel', buyerController.cancelOrder);

// Review management
router.post('/reviews', buyerController.createReview);
router.get('/reviews/product/:productId', buyerController.getProductReviews);

export default router;