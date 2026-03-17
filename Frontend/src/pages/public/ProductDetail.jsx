import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { publicAPI } from "../../service/apiAuth.js";
import { addToCart } from "../../Redux/createSlice.js";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiPackage,
  FiTruck,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await publicAPI.getProduct(id);
      setProduct(data.data.product);
    } catch (error) {
      console.error("Failed to load product:", error);
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Only buyers can add items to cart");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        quantity,
      }),
    );

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span
            className="hover:text-primary-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          {" / "}
          <span
            className="hover:text-primary-600 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            Products
          </span>
          {" / "}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="card mb-4 overflow-hidden">
              <img
                src={
                  product.images?.[selectedImage]?.url?.startsWith("http")
                    ? product.images[selectedImage].url
                    : `http://localhost:3000${product.images?.[selectedImage]?.url || ""}`
                }
                alt={product.name}
                className="w-full h-96 object-contain bg-white"
                // onError={(e) => {
                //   e.target.src =
                //     "https://via.placeholder.com/600x400?text=No+Image";
                // }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index
                        ? "border-primary-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={
                        image.url?.startsWith("http")
                          ? image.url
                          : `http://localhost:5000${image.url}`
                      }
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="badge badge-info mb-2">{product.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating || 5)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    {(product.rating || 5).toFixed(1)} (
                    {product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.price}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.comparePrice}
                    </span>
                    <span className="badge bg-red-500 text-white">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Stock & Quantity */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="badge badge-success">In Stock</span>
                    <span className="text-sm text-gray-600">
                      {product.stock} units available
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <label className="font-medium text-gray-900">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  <span className="badge badge-danger">Out of Stock</span>
                  <p className="text-sm text-gray-600 mt-2">
                    This item is currently unavailable
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-4 mb-6">
              <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
                <FiHeart />
                <span>Add to Wishlist</span>
              </button>
              <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
                <FiShare2 />
                <span>Share</span>
              </button>
            </div>

            {/* Seller Info */}
            {product.sellerId && (
              <div className="card bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Sold By</h3>
                <p className="text-lg font-medium text-primary-600">
                  {product.sellerId.shopName}
                </p>
                {product.sellerId.rating && (
                  <div className="flex items-center space-x-1 text-yellow-500 mt-1">
                    <FiStar className="fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.sellerId.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <FiPackage className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick shipping on all orders
            </p>
          </div>
          <div className="card text-center">
            <FiTruck className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="card text-center">
            <FiShield className="w-10 h-10 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={index} className="badge badge-info">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
