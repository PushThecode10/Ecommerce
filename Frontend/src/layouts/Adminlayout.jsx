import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice.js';
import { FiHome, FiUsers, FiShoppingBag, FiPackage, FiShoppingCart, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi';
import { useState } from 'react';

const AdminLayout = () => {
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
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Sellers', path: '/admin/sellers', icon: FiShoppingBag },
    { name: 'Products', path: '/admin/products', icon: FiPackage },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
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
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FiShield className="text-white w-5 h-5" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">Admin Panel</span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-purple-50 rounded-lg">
                <FiShield className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full font-medium">
                  Admin
                </span>
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
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* System Info */}
          <div className="p-4 border-t border-gray-200 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">System</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="text-gray-900 font-medium">1.0.0</span>
              </div>
            </div>
          </div>

          {/* Public Site Link */}
          <div className="p-4">
            <Link
              to="/"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              View Public Site
            </Link>
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

export default AdminLayout;