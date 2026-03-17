import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../../Redux/createSlice';
import { buyerAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      const { data } = await buyerAPI.createOrder(orderData);
      
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No Items to Checkout</h1>
        <p className="text-gray-600 mb-6">Add items to your cart first</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  className="input-field"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="input-field"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    className="input-field"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    className="input-field"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <FiDollarSign className="w-6 h-6 mr-3 text-green-600" />
                  <div>
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <FiCreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  <div>
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, etc.</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="w-6 h-6 mr-3">💳</span>
                  <div>
                    <div className="font-semibold">UPI</div>
                    <div className="text-sm text-gray-600">PhonePe, Google Pay, etc.</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Placing Order...' : `Place Order ($${cartTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;