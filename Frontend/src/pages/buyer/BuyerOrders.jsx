import { useEffect, useState } from 'react';
import { buyerAPI } from '../../service/apiAuth.js';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiX } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await buyerAPI.getOrders();
      setOrders(data.data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      confirmed: FiPackage,
      processing: FiPackage,
      shipped: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiX,
    };
    return icons[status] || FiPackage;
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'pending', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No orders found</p>
          <a href="/products" className="btn-primary">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order._id} className="card hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{order.orderId}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-medium capitalize">{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Payment: <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img
                        src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64?text=Product';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Delivery to:</p>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress?.name}, {order.shippingAddress?.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-primary-600">${order.totalAmount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;