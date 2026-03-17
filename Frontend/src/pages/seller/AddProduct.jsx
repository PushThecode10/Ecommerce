import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sellerAPI } from "../../service/apiAuth.js";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";

const MAX_IMAGES = 5;

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    subcategory: "",
    stock: "",
    specifications: {},
    tags: [],
  });

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
    "Beauty",
    "Automotive",
    "Food",
    "Other",
  ];

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // -------------------------------
  // Handle input changes
  // -------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------------
  // Handle image upload - FIXED
  // -------------------------------

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      e.target.value = ''; // Reset input
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Reset input
    e.target.value = '';
  };

  // -------------------------------
  // Remove image - FIXED
  // -------------------------------

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // -------------------------------
  // Add specification
  // -------------------------------

  const addSpecification = () => {
    if (!specKey.trim() || !specValue.trim()) {
      toast.error("Specification key and value required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specValue.trim(),
      },
    }));

    setSpecKey("");
    setSpecValue("");
  };

  const removeSpecification = (key) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  // -------------------------------
  // Tags
  // -------------------------------

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      toast.error("Tag already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // -------------------------------
  // Submit
  // -------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "specifications" || key === "tags") {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value);
        }
      });

      // Images
      images.forEach((img) => {
        submitData.append("images", img);
      });

      await sellerAPI.createProduct(submitData);

      toast.success("Product created successfully 🎉");

      // Clean up URLs before navigation
      imagePreviews.forEach(url => URL.revokeObjectURL(url));

      navigate("/seller/products");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Wireless Headphones"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe your product..."
                className="input-field"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  placeholder="e.g., Wireless"
                  className="input-field"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Pricing & Inventory</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="input-field"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare Price
              </label>
              <input
                type="number"
                name="comparePrice"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="input-field"
                value={formData.comparePrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                placeholder="0"
                className="input-field"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            Product Images ({images.length}/{MAX_IMAGES})
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
              className="hidden"
            />
            <label
              htmlFor="images"
              className={`cursor-pointer flex flex-col items-center ${
                images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload images ({images.length}/{MAX_IMAGES})
              </span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SPECIFICATIONS */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="Key (e.g., Brand)"
              className="input-field flex-1"
            />

            <input
              type="text"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="Value (e.g., Sony)"
              className="input-field flex-1"
            />

            <button
              type="button"
              onClick={addSpecification}
              className="btn-primary whitespace-nowrap"
            >
              Add
            </button>
          </div>

          {Object.keys(formData.specifications).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">
                    <strong>{key}:</strong> {value}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Tags</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              placeholder="Add a tag"
              className="input-field flex-1"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />

            <button
              type="button"
              onClick={addTag}
              className="btn-primary whitespace-nowrap"
            >
              Add Tag
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="badge badge-info flex items-center space-x-1">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2 w-5 h-5 border-2"></div>
                Creating Product...
              </span>
            ) : (
              'Create Product'
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/seller/products")}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;