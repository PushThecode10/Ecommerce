import { useEffect, useState } from 'react';
import { adminAPI } from '../../service/apiAuth.js';
import { FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await adminAPI.getProducts();
      setProducts(data.data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600 mt-2">{products.length} total products</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product name or seller..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="input-field"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex gap-6">
                {/* Product Image */}
                <img
                  src={
                    product.images?.[0]?.url?.startsWith('http')
                      ? product.images[0].url
                      : `http://localhost:5000${product.images?.[0]?.url || ''}`
                  }
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                  }}
                />

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="badge badge-info">{product.category}</span>
                        <span className="text-gray-600">Stock: {product.stock}</span>
                        <span className="text-gray-600">Sales: {product.totalSales || 0}</span>
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">${product.price}</p>
                      {product.comparePrice && (
                        <p className="text-sm text-gray-500 line-through">${product.comparePrice}</p>
                      )}
                    </div>
                  </div>

                  {/* Seller Info & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Seller</p>
                      <p className="font-medium">{product.sellerId?.shopName || 'Unknown'}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(product._id, product.name)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center space-x-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
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