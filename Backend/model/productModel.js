import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🚀 Indexes for performance
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
