import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Create uploads directories if not exists
const uploadDir = path.join(__dirname, "../uploads");
const productImagesDir = path.join(uploadDir, "products");
const categoryImagesDir = path.join(uploadDir, "categories");

[uploadDir, productImagesDir, categoryImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 🗄️ Storage configuration for products
const productStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, productImagesDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, name);
  },
});

// 🗄️ Storage configuration for categories
const categoryStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, categoryImagesDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = `category-${uniqueSuffix}${ext}`;
    cb(null, name);
  },
});

// 🖼️ Allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed (jpeg, jpg, png, gif, webp)"
      )
    );
  }
};

// 📦 Multer instance for products
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// 📦 Multer instance for categories
const categoryUpload = multer({
  storage: categoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// 🧾 Upload multiple product images (max 5)
export const uploadProductImages = productUpload.array("images", 5);

// 🧾 Upload single category image
export const uploadCategoryImage = categoryUpload.single("image");

// ⚠️ Multer error handler
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB per image.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 5 images allowed.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};