import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../service/apiAuth.js';
import { FiUsers, FiShoppingBag, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, buyers: 0, sellers: 0 },
    sellers: { total: 0, pending: 0 },
    products: { total: 0 },
    orders: { total: 0, pending: 0 },
    revenue: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data } = await adminAPI.getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users?.total || 0,
      subtitle: `${stats.users?.buyers || 0} buyers, ${stats.users?.sellers || 0} sellers`,
      icon: FiUsers,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Pending Sellers',
      value: stats.sellers?.pending || 0,
      subtitle: `${stats.sellers?.total || 0} total sellers`,
      icon: FiShoppingBag,
      color: 'bg-yellow-500',
      link: '/admin/sellers',
    },
    {
      title: 'Total Products',
      value: stats.products?.total || 0,
      subtitle: 'Listed on platform',
      icon: FiPackage,
      color: 'bg-purple-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      subtitle: `${stats.orders?.pending || 0} pending`,
      icon: FiShoppingCart,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.revenue?.total || 0).toLocaleString()}`,
      subtitle: 'Platform earnings',
      icon: FiDollarSign,
      color: 'bg-emerald-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <Link to="/admin/sellers?status=pending" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FiShoppingBag className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pending Sellers</h3>
                  <p className="text-sm text-gray-600">Approve new sellers</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600">View all users</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/products" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FiPackage className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Products</h3>
                  <p className="text-sm text-gray-600">Monitor listings</p>
                </div>
              </div>
            </Link>

            <Link to="/admin/orders" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Orders</h3>
                  <p className="text-sm text-gray-600">View all orders</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Platform Health */}
          <div className="card mt-8">
            <h2 className="text-xl font-bold mb-6">Platform Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FiTrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {stats.sellers?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Active Sellers</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FiPackage className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {stats.products?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Products Listed</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FiShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {stats.orders?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;