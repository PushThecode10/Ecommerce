import express from "express";
const router = express.Router();
import Product from "../model/productModel.js";

// IMPORTANT: Specific routes MUST come BEFORE generic routes!

// Get all products (PUBLIC - Main listing route)
// This handles: GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search, limit, sort } = req.query;
    
    let query = { isActive: true }; // Only show active products
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build query
    let productsQuery = Product.find(query)
      .populate('sellerId', 'shopName rating')
      .select('-__v');
    
    // Sort
    if (sort === 'price-low') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else if (sort === 'name') {
      productsQuery = productsQuery.sort({ name: 1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 }); // newest first
    }
    
    // Limit
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery;
    
    res.json({
      success: true,
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Search products (public)
// This handles: GET /api/products/search
router.get("/search", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("sellerId", "shopName rating")
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
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
});

// Get categories
// This handles: GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
});

// Get featured products
// This handles: GET /api/products/featured
router.get("/featured", async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ isActive: true })
      .populate("sellerId", "shopName rating")
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message,
    });
  }
});

// Get single product by ID (PUBLIC)
// This handles: GET /api/products/:id
// MUST be LAST because it's a catch-all route
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'shopName rating specialization')
      .select('-__v');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

export default router;