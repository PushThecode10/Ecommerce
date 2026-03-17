import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    businessLicense: {
      type: String,
    },
    taxId: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
    verificationDate: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      routingNumber: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Indexes for faster queries
{/*sellerSchema.index({ userId: 1 });*/}
sellerSchema.index({ verificationStatus: 1 });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
