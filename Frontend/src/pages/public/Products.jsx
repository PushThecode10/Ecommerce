import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { publicAPI } from "../../service/apiAuth.js";
import { FiSearch, FiFilter, FiStar, FiGrid, FiList } from "react-icons/fi";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
    "Beauty",
    "Automotive",
    "Food",
  ];

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get("search"))
        params.search = searchParams.get("search");
      if (
        searchParams.get("category") &&
        searchParams.get("category") !== "all"
      ) {
        params.category = searchParams.get("category");
      }

      const { data } = await publicAPI.getProducts(params);
      let fetchedProducts = data.data.products || [];

      // Apply sorting
      fetchedProducts = sortProducts(fetchedProducts, sortBy);

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryFilter !== "all") params.category = categoryFilter;
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    const newCategory = category.toLowerCase() === "all" ? "all" : category;
    setCategoryFilter(newCategory);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (newCategory !== "all") params.category = newCategory;
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setProducts(sortProducts(products, newSort));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-4"
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap">
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  categoryFilter === category.toLowerCase() ||
                  (categoryFilter === "all" && category === "All")
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Sort by:</label>
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setSearchParams({});
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="card hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={`http://localhost:3000${product.images?.[0]?.url || "/uploads/placeholder.png"}`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.comparePrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {Math.round(
                        ((product.comparePrice - product.price) /
                          product.comparePrice) *
                          100,
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="badge badge-info text-xs">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-1 text-yellow-500">
                    <FiStar className="fill-current w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      {product.rating ? product.rating.toFixed(1) : "5.0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xl font-bold text-primary-600">
                        ${product.price}
                      </p>
                      {product.comparePrice && (
                        <p className="text-xs text-gray-500 line-through">
                          ${product.comparePrice}
                        </p>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="badge badge-success text-xs">
                        In Stock
                      </span>
                    ) : (
                      <span className="badge badge-danger text-xs">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="card hover:shadow-lg transition-shadow flex gap-6 group"
              >
                <img
                  src={
                    product.images?.[0]?.url?.startsWith("http")
                      ? product.images[0].url
                      : `http://localhost:3000${product.images?.[0]?.url || ""}`
                  }
                  alt={product.name}
                  className="w-48 h-48 object-cover rounded-lg"
                  // onError={(e) => {
                  //   e.target.src = 'https://via.placeholder.com/192?text=No+Image';
                  // }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="badge badge-info text-xs mb-2 inline-block">
                          {product.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      {product.comparePrice && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                          SALE
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FiStar className="fill-current" />
                      <span className="text-sm text-gray-600">
                        {product.rating ? product.rating.toFixed(1) : "5.0"} (
                        {product.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </p>
                      {product.comparePrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.comparePrice}
                        </p>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="badge badge-success">
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="badge badge-danger">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
