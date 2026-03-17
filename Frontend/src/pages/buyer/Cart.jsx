import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal } from '../../Redux/createSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal)
  const { isAuthenticated,user } = useSelector((state) => state.auth);
  const handleQuantityChange = (productId, newQuantity) => {
    if(newQuantity < 1) return;
    dispatch(updateCartItem({ productId, quantity: newQuantity }));
  };
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };
  const handleCheckout = () => {
    if(!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    if(user.role !== 'buyer') {
      toast.error('Only buyers can proceed to checkout');
      return;
    }
    navigate('/buyer/checkout');
  };
  if(cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <NavLink to="/products" className="btn-primary">
          Start Shopping
        </NavLink>
      </div>
    );
  }

  return (
    <div>
     <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cartItems.map(item => (
        <div key={item.productId} className="card flex items-center gap-4">
          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-lg font-medium">{item.name}</h2>
            <p className="text-gray-600">Price: ${item.price}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 transition"
              >-</button>
              <span className="px-4">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 transition"
              >+</button>
            </div>
          </div>
          <button
            onClick={() => handleRemoveItem(item.productId)}
            className="text-red-500 hover:text-red-700 transition"
          >Remove</button>
        </div>
      ))} 
      </div>
      <div className="mt-6 flex justify-end items-center gap-4">
        <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="btn-primary"
        >Proceed to Checkout</button>
      </div>
        

    </div>
  )
}

export default Cart