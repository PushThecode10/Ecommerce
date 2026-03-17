import { useEffect, useState } from 'react';
import { adminAPI } from '../../service/apiAuth.js';
import { FiPackage, FiSearch } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await adminAPI.getOrders();
      setOrders(data.data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{order.orderId}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`badge ${getStatusColor(order.status)} capitalize`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.buyerId?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{order.buyerId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <p className="font-medium">{order.items?.length || 0} items</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-xl text-green-600">${order.totalAmount}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                  <p className="text-sm">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, 
                    {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment</p>
                  <p className="text-sm capitalize">
                    {order.paymentMethod} - 
                    <span className={`ml-2 ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;