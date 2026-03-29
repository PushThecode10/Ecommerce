import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Enable cookies
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// Buyer API
export const buyerAPI = {
  getProducts: (params) => api.get('/buyer/products', { params }),
  getProduct: (productId) => api.get(`/buyer/products/${productId}`),
  addToCart: (data) => api.post('/buyer/cart/add', data),
  getCart: () => api.get('/buyer/cart'),
  createOrder: (data) => api.post('/buyer/orders', data),
  getOrders: (params) => api.get('/buyer/orders', { params }),
  createReview: (data) => api.post('/buyer/reviews', data),
};

// Seller API
export const sellerAPI = {
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (data) => api.put('/seller/profile', data),
  createProduct: (formData) => api.post('/seller/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getProducts: (params) => api.get('/seller/products', { params }),
  updateProduct: (productId, formData) => api.put(`/seller/products/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProduct: (productId) => api.delete(`/seller/products/${productId}`),
  getOrders: (params) => api.get('/seller/orders', { params }),
  updateOrderStatus: (orderId, status) => api.put(`/seller/orders/${orderId}/status`, { status }),
  getDashboardStats: () => api.get('/seller/stats/dashboard'),

};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getSellers: (params) => api.get('/admin/sellers', { params }),
  verifySeller: (sellerId, status) => api.put(`/admin/sellers/${sellerId}/verify`, { status }),
  blockSeller: (sellerId) => api.put(`/admin/sellers/${sellerId}/block`),
  getProducts: (params) => api.get('/admin/products', { params }),
  getOrders: (params) => api.get('/admin/orders', { params }),
};

// Public API
export const publicAPI = {
  // Get all products (public access)
  getProducts: (params) => api.get('/products', { params }),
  
  // Get single product by ID (public access)
  getProduct: (productId) => api.get(`/products/${productId}`),
  
  // Get featured products
  getFeaturedProducts: (params) => api.get('/products/featured', { params }),
  
  // Get categories
  getCategories: () => api.get('/categories/all'),
  
  // Search products
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
};

export default api;