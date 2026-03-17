import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { blockSeller, deleteProduct, deleteUser, getAllOrders, getAllProducts, getAllSellers, getAllUsers, getDashboardStats, getOrderById, getSellerById, getUserById, toggleUserStatus, verifySeller } from '../controllers/adminController.js';
const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId/toggle-status', toggleUserStatus);
router.delete('/users/:userId', deleteUser);

// Seller management
router.get('/sellers', getAllSellers);
router.get('/sellers/:sellerId', getSellerById);
router.put('/sellers/:sellerId/verify', verifySeller);
router.put('/sellers/:sellerId/block', blockSeller);

// Product management
router.get('/products', getAllProducts);
router.delete('/products/:productId', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);

// Statistics
router.get('/stats/dashboard', getDashboardStats);

export default router;