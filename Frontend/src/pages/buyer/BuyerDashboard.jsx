import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { buyerAPI } from '../../service/apiAuth.js';
import { FiShoppingBag, FiPackage, FiTruck, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data } = await buyerAPI.getOrders({ limit: 5 });
      const orders = data.data.orders || [];
      
      setRecentOrders(orders);
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      link: '/buyer/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiPackage,
      color: 'bg-yellow-500',
      link: '/buyer/orders?status=pending',
    },
    {
      title: 'Delivered',
      value: stats.deliveredOrders,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      link: '/buyer/orders?status=delivered',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your orders today.</p>
      </div>

      {/* Stats Grid */}
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
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link to="/buyer/orders" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
            <FiArrowRight className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{order.orderId}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">${order.totalAmount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/buyer/orders`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link to="/products" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Products</h3>
              <p className="text-sm text-gray-600">Discover new items</p>
            </div>
          </div>
        </Link>

        <Link to="/cart" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiTruck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Cart</h3>
              <p className="text-sm text-gray-600">Complete your purchase</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;