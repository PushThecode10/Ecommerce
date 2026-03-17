import User from '../model/userModel.js';
import Seller from '../model/sellerModel.js';
import Product from '../model/productModel.js';
import Order from '../model/orderModel.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
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
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If seller, delete seller profile
    if (user.role === 'seller') {
      await Seller.deleteOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get all sellers
export const getAllSellers = async (req, res) => {
  try {
    const { verificationStatus, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    const sellers = await Seller.find(filter)
      .populate('userId', 'name email phone isActive')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Seller.countDocuments(filter);

    res.json({
      success: true,
      data: {
        sellers,
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
      message: 'Failed to fetch sellers',
      error: error.message
    });
  }
};

// Get seller by ID
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId)
      .populate('userId', 'name email phone isActive');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      data: { seller }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller',
      error: error.message
    });
  }
};

// Verify seller
export const verifySeller = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const seller = await Seller.findById(req.params.sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.verificationStatus = status;
    seller.verificationDate = new Date();
    await seller.save();

    res.json({
      success: true,
      message: `Seller ${status} successfully`,
      data: { seller }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify seller',
      error: error.message
    });
  }
};

// Block/unblock seller
export const blockSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.verificationStatus = seller.verificationStatus === 'blocked' ? 'approved' : 'blocked';
    await seller.save();

    res.json({
      success: true,
      message: `Seller ${seller.verificationStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      data: { seller }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to block seller',
      error: error.message
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find()
      .populate('sellerId', 'shopName specialization')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

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

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    
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

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('buyerId', 'name email')
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
    const order = await Order.findById(req.params.orderId)
      .populate('buyerId', 'name email phone')
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
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({ verificationStatus: 'pending' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          buyers: totalBuyers,
          sellers: totalSellers
        },
        sellers: {
          total: totalSellers,
          pending: pendingSellers
        },
        products: {
          total: totalProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders
        },
        revenue: {
          total: totalRevenue
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