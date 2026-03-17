import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sellerAPI } from "../../service/apiAuth.js";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import toast from "react-hot-toast";

// Inline SVG fallback (no external requests)
const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await sellerAPI.getProducts();
      setProducts(data.data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await sellerAPI.deleteProduct(productId);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      await sellerAPI.toggleProductStatus(productId);
      toast.success("Product status updated");
      loadProducts();
    } catch (error) {
      console.error("Toggle status failed:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-2">{products.length} total products</p>
        </div>
        <Link
          to="/seller/products/add"
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card text-center py-12">
          <FiPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm ? "No products found" : "No products yet"}
          </p>
          {!searchTerm && (
            <Link to="/seller/products/add" className="btn-primary">
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <img
                  src={
                    product.images?.[0]?.url?.startsWith("http")
                      ? product.images[0].url
                      : `http://localhost:3000${product.images?.[0]?.url || ""}`
                  }
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="badge badge-info">
                          {product.category}
                        </span>
                        <span className="text-gray-600">
                          Stock: {product.stock}
                        </span>
                        <span className="text-gray-600">
                          Sales: {product.totalSales || 0}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </p>
                      {product.comparePrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.comparePrice}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      to={`/seller/products/edit/${product._id}`}
                      className="btn-primary flex items-center space-x-1 text-sm"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(product._id)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-1 text-sm ${
                        product.isActive
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {product.isActive ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                      <span>
                        {product.isActive ? "Deactivate" : "Activate"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center space-x-1 text-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    <span
                      className={`badge ${
                        product.isActive ? "badge-success" : "badge-danger"
                      } ml-auto`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
