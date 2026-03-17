import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import { FiHome, FiPackage, FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX, FiPlus } from 'react-icons/fi';
import { useState } from 'react';

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', path: '/seller', icon: FiHome },
    { name: 'My Products', path: '/seller/products', icon: FiPackage },
    { name: 'Add Product', path: '/seller/products/add', icon: FiPlus },
    { name: 'Orders', path: '/seller/orders', icon: FiShoppingBag },
    { name: 'Profile', path: '/seller/profile', icon: FiUser },
  ];

  const isActive = (path) => {
    if (path === '/seller') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center ml-4 lg:ml-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">Seller Dashboard</span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-green-50 rounded-lg">
                <FiUser className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Actions</h3>
            <Link
              to="/seller/products/add"
              className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Product
            </Link>
          </div>

          {/* Help */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">Need help?</p>
              <a href="#" className="text-xs text-green-600 hover:text-green-700">
                View Seller Guide →
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10 top-16"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;