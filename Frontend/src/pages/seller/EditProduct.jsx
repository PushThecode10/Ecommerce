import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sellerAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    subcategory: '',
    stock: '',
    specifications: {},
    tags: [],
    images: [],
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Electronics',
    'Fashion',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Beauty',
    'Automotive',
    'Food',
    'Other'
  ];

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    loadProduct();
  }, [id]);

  // FIXED: Correct API call
  const loadProduct = async () => {
    try {
      // Use getProduct with ID, not getProducts
      const { data } = await sellerAPI.getProduct(id);
      const product = data.data.product;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        stock: product.stock || '',
        specifications: product.specifications || {},
        tags: product.tags || [],
        images: product.images || [],
      });
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product');
      navigate('/seller/products');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Use functional updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // FIXED: Proper image handling
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;
    
    const totalImages = formData.images.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      e.target.value = ''; // Reset input
      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files allowed');
        return;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setNewImages(prev => [...prev, ...validFiles]);
    setNewImagePreviews(prev => [...prev, ...previews]);
    
    e.target.value = ''; // Reset input
  };

  // FIXED: Clean up object URLs
  const removeNewImage = (index) => {
    // Revoke object URL
    if (newImagePreviews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(newImagePreviews[index]);
    }
    
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // FIXED: Functional updates
  const addSpecification = () => {
    if (!specKey.trim() || !specValue.trim()) {
      toast.error('Specification key and value required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specValue.trim(),
      },
    }));
    
    setSpecKey('');
    setSpecValue('');
  };

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    
    if (!tag) return;
    
    if (formData.tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
    
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      
      // Append basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'specifications' || key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });

      // Append new images only
      newImages.forEach(image => {
        submitData.append('images', image);
      });

      await sellerAPI.updateProduct(id, submitData);
      toast.success('Product updated successfully!');
      
      // Clean up URLs before navigation
      newImagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      navigate('/seller/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(error?.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
                className="input-field"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
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
                  className="input-field"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="input-field"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Current Images */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Current Images</h2>
          {formData.images && formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      image.url?.startsWith("http")
                        ? image.url
                        : `http://localhost:3000${image.url}`
                    }
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    // onError={(e) => {
                    //   e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                    // }}
                  />
                  {image.isPrimary && (
                    <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No current images</p>
          )}
        </div>

        {/* Add New Images */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Add New Images</h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="new-images"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="hidden"
              />
              <label
                htmlFor="new-images"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload new images (max 5 total)
                </span>
              </label>
            </div>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Key (e.g., Brand)"
                className="input-field flex-1"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value (e.g., Sony)"
                className="input-field flex-1"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
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
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
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
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Tags</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag"
                className="input-field flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
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
                  <span
                    key={index}
                    className="badge badge-info flex items-center space-x-1"
                  >
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
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2 w-5 h-5 border-2"></div>
                Saving Changes...
              </span>
            ) : (
              "Save Changes"
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

export default EditProduct;