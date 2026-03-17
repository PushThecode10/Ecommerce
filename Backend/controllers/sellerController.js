import Seller from '../model/sellerModel.js';
import Product from '../model/productModel.js';
import Order from '../model/orderModel.js';
import path from 'path';

// Get seller profile
export const getProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    res.json({
      success: true,
      data: { seller }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update seller profile
export const updateProfile = async (req, res) => {
  try {
    const { shopName, specialization, description, bankDetails } = req.body;

    const seller = await Seller.findOne({ userId: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    if (shopName) seller.shopName = shopName;
    if (specialization) seller.specialization = specialization;
    if (description) seller.description = description;
    if (bankDetails) seller.bankDetails = bankDetails;

    await seller.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { seller }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Create product with images
export const createProduct = async (req, res) => {
  try {
    // Get seller
    const seller = await Seller.findOne({ userId: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    // Check if seller is approved
    if (seller.verificationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your seller account must be approved before adding products'
      });
    }

    const { name, description, price, comparePrice, category, subcategory, stock, specifications, tags } = req.body;

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: `/uploads/products/${file.filename}`,
          isPrimary: index === 0 // First image is primary
        });
      });
    }

    // Parse specifications if provided as JSON string
    let parsedSpecifications = specifications;
    if (typeof specifications === 'string') {
      try {
        parsedSpecifications = JSON.parse(specifications);
      } catch (e) {
        parsedSpecifications = {};
      }
    }

    // Parse tags if provided as JSON string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [];
      }
    }

    const product = await Product.create({
      sellerId: seller._id,
      name,
      description,
      price,
      comparePrice,
      category,
      subcategory,
      stock,
      images,
      specifications: parsedSpecifications,
      tags: parsedTags
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Get all products for this seller
export const getMyProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    const { page = 1, limit = 10, category, isActive } = req.query;

    const filter = { sellerId: seller._id };
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    
    const product = await Product.findOne({
      _id: req.params.productId,
      sellerId: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const product = await Product.findOne({
      _id: req.params.productId,
      sellerId: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, comparePrice, category, subcategory, stock, specifications, tags } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (comparePrice !== undefined) product.comparePrice = comparePrice;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (stock !== undefined) product.stock = stock;

    // Parse and update specifications
    if (specifications) {
      let parsedSpecifications = specifications;
      if (typeof specifications === 'string') {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (e) {
          parsedSpecifications = {};
        }
      }
      product.specifications = parsedSpecifications;
    }

    // Parse and update tags
    if (tags) {
      let parsedTags = tags;
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = [];
        }
      }
      product.tags = parsedTags;
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        isPrimary: product.images.length === 0 && index === 0
      }));
      product.images.push(...newImages);
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const product = await Product.findOneAndDelete({
      _id: req.params.productId,
      sellerId: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Toggle product active status
export const toggleProductStatus = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const product = await Product.findOne({
      _id: req.params.productId,
      sellerId: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
      error: error.message
    });
  }
};

// Get seller's orders
export const getMyOrders = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { 'items.sellerId': seller._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('buyerId', 'name email phone')
      .populate('items.productId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const order = await Order.findOne({
      _id: req.params.orderId,
      'items.sellerId': seller._id
    })
      .populate('buyerId', 'name email phone')
      .populate('items.productId', 'name');

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
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const seller = await Seller.findOne({ userId: req.user._id });

    const order = await Order.findOne({
      _id: req.params.orderId,
      'items.sellerId': seller._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const totalProducts = await Product.countDocuments({ sellerId: seller._id });
    const activeProducts = await Product.countDocuments({ sellerId: seller._id, isActive: true });
    const totalOrders = await Order.countDocuments({ 'items.sellerId': seller._id });
    const pendingOrders = await Order.countDocuments({ 'items.sellerId': seller._id, status: 'pending' });

    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders
        },
        earnings: {
          total: seller.totalEarnings,
          totalSales: seller.totalSales
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Get sales report
export const getSalesReport = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });

    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = { 'items.sellerId': seller._id };
    if (Object.keys(dateFilter).length > 0) {
      matchFilter.createdAt = dateFilter;
    }

    const salesData = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$items' },
      { $match: { 'items.sellerId': seller._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      }
    ]);

    const stats = salesData.length > 0 ? salesData[0] : {
      totalOrders: 0,
      totalRevenue: 0,
      totalQuantity: 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales report',
      error: error.message
    });
  }
};