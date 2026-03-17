import Product from "../model/productModel.js";

import Order from "../model/orderModel.js";
import Review from "../model/reviewModel.js";
import Cart from "../model/cart.js";

// Get all products (with search and filters)
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter
    const filter = { isActive: true, stock: { $gt: 0 } };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .populate("sellerId", "shopName rating")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "sellerId",
      "shopName specialization rating totalSales",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock for requested quantity",
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images.length > 0 ? product.images[0].url : null,
        quantity,
        sellerId: product.sellerId,
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate("items.productId", "name price stock isActive");

    res.json({
      success: true,
      message: "Product added to cart",
      data: { cart },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message,
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price stock isActive images",
    );

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          totalItems: 0,
        },
      });
    }

    // Filter out products that no longer exist or are inactive
    cart.items = cart.items.filter((item) => {
      return item.productId && item.productId.isActive;
    });

    // Recalculate totals after filtering
    await cart.save();

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user._id;
    const itemId = req.params.itemId;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === itemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify stock availability
      const product = await Product.findById(itemId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price; // Update price in case it changed
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
      data: { cart },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === itemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error.message,
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is already empty",
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
      data: { cart },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const buyerId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images.length > 0 ? product.images[0].url : null,
      });

      totalAmount += product.price * item.quantity;

      // Update product stock
      product.stock -= item.quantity;
      product.totalSales += item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      buyerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
    });

    // Clear cart from database
    await Cart.findOneAndUpdate({ userId: buyerId }, { $set: { items: [] } });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get buyer's orders
export const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { buyerId: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("items.productId", "name")
      .populate("items.sellerId", "shopName")
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
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyerId: req.user._id,
    })
      .populate("items.productId", "name")
      .populate("items.sellerId", "shopName");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      buyerId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity, totalSales: -item.quantity },
      });
    }

    order.status = "cancelled";
    order.cancelReason = reason;
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, orderId } = req.body;
    const buyerId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if buyer has purchased the product
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        buyerId,
        "items.productId": productId,
        status: "delivered",
      });
      isVerifiedPurchase = !!order;
    }

    // Create review
    const review = await Review.create({
      productId,
      buyerId,
      orderId,
      rating,
      comment,
      isVerifiedPurchase,
    });

    // Update product rating
    const allReviews = await Review.find({ productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.rating = avgRating;
    product.totalReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ productId: req.params.productId })
      .populate("buyerId", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      productId: req.params.productId,
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};
