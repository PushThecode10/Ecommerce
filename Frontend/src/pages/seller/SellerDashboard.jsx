import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sellerAPI } from '../../service/apiAuth.js';
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data } = await sellerAPI.getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products?.total || 0,
      subtitle: `${stats.products?.active || 0} active`,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/seller/products',
    },
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      subtitle: `${stats.orders?.pending || 0} pending`,
      icon: FiShoppingBag,
      color: 'bg-purple-500',
      link: '/seller/orders',
    },
    {
      title: 'Total Earnings',
      value: `$${(stats.earnings?.total || 0).toLocaleString()}`,
      subtitle: `${stats.earnings?.totalSales || 0} sales`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      link: '/seller/orders',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products and orders</p>
        </div>
        <Link to="/seller/products/add" className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/seller/products/add" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiPlus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Product</h3>
                  <p className="text-sm text-gray-600">List new item</p>
                </div>
              </div>
            </Link>

            <Link to="/seller/products" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiPackage className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">My Products</h3>
                  <p className="text-sm text-gray-600">Manage inventory</p>
                </div>
              </div>
            </Link>

            <Link to="/seller/orders" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FiShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Orders</h3>
                  <p className="text-sm text-gray-600">Process orders</p>
                </div>
              </div>
            </Link>

            <Link to="/seller/profile" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">View reports</p>
                </div>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;