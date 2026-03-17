import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import { selectCartItemCount } from '../Redux/createSlice.js';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const itemCount = useSelector(selectCartItemCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller';
      case 'buyer':
        return '/buyer';
      default:
        return '/';
    }
  };
return (
  <div className="min-h-screen flex flex-col bg-gray-50">

    {/* Navbar */}
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-lg shadow">
              E
            </div>
            <span className="text-xl font-semibold text-gray-800">
              E-Commerce
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>

            <Link to="/cart" className="relative hover:text-indigo-600 transition">
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-1 hover:text-indigo-600 transition"
                >
                  <FiUser />
                  <span>{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-4 text-gray-700 font-medium">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
            Cart ({itemCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>

    {/* Main Content */}
    <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
      <Outlet />
    </main>

    {/* Footer */}
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        <div>
          <h3 className="text-white text-xl font-semibold mb-3">
            E-Commerce
          </h3>
          <p className="text-sm text-gray-400">
            Your one-stop shop for everything you need.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col space-y-2">
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/cart" className="hover:text-white transition">Cart</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Customer Service</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Contact Us</p>
            <p>FAQs</p>
            <p>Returns</p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © 2024 E-Commerce. All rights reserved.
      </div>
    </footer>

  </div>
);
}

export default PublicLayout;