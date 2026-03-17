import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");

    const { default: createAdmin } = await import("../utils/createAmin.js");
    await createAdmin(); // ✅ await it

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Optional but recommended
  }
};

export default connectDb;
