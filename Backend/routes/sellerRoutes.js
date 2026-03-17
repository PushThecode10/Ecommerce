import express from 'express';
const router = express.Router();
import * as sellerController from '../controllers/sellerController.js';
import { handleMulterError, uploadProductImages } from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';


// All routes require seller authentication
router.use(authenticate);
router.use(authorize('seller'));

// Seller profile
router.get('/profile', sellerController.getProfile);
router.put('/profile', sellerController.updateProfile);

// Product management
router.post('/products', uploadProductImages, handleMulterError, sellerController.createProduct);
router.get('/products', sellerController.getMyProducts);
router.get('/products/:productId', sellerController.getProductById);
router.put('/products/:productId', uploadProductImages, handleMulterError, sellerController.updateProduct);
router.delete('/products/:productId', sellerController.deleteProduct);
router.put('/products/:productId/toggle-status', sellerController.toggleProductStatus);

// Order management
router.get('/orders', sellerController.getMyOrders);
router.get('/orders/:orderId', sellerController.getOrderById);
router.put('/orders/:orderId/status', sellerController.updateOrderStatus);

// Analytics
router.get('/stats/dashboard', sellerController.getDashboardStats);
router.get('/stats/sales', sellerController.getSalesReport);

export default router;