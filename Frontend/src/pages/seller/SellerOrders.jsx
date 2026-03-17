import { useEffect, useState } from "react";
import { sellerAPI } from "../../service/apiAuth.js";
import { FiPackage, FiClock, FiTruck, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await sellerAPI.getOrders();
      setOrders(data.data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await sellerAPI.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      confirmed: FiPackage,
      processing: FiPackage,
      shipped: FiTruck,
      delivered: FiCheckCircle,
    };
    return icons[status] || FiPackage;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "confirmed",
      confirmed: "processing",
      processing: "shipped",
      shipped: "delivered",
    };
    return statusFlow[currentStatus];
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-2">{orders.length} total orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "pending", "processing", "shipped", "delivered"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

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
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const nextStatus = getNextStatus(order.status);

            return (
              <div key={order._id} className="card">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <h3 className="font-bold text-lg">{order.orderId}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-medium capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items
                    ?.filter((item) => item.sellerId === order.sellerId)
                    ?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `http://localhost:3000${item.image}`
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          // onError={(e) => {
                          //   e.target.src = "https://via.placeholder.com/64";
                          // }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">${item.price}</p>
                      </div>
                    ))}
                </div>

                {/* Customer Info */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{order.shippingAddress?.name}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {nextStatus && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(order._id, nextStatus)}
                      className="btn-primary w-full"
                    >
                      Mark as{" "}
                      {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
