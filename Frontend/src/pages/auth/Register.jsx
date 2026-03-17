import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/authSlice.js';
import { authAPI } from '../../service/apiAuth.js';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShoppingBag, FiShoppingCart } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    shopName: '',
    specialization: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      shopName: '',
      specialization: '',
    });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.role === 'seller') {
      if (!formData.shopName.trim()) {
        toast.error('Shop name is required for sellers');
        return false;
      }
      if (!formData.specialization.trim()) {
        toast.error('Specialization is required for sellers');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'seller') {
        registrationData.shopName = formData.shopName;
        registrationData.specialization = formData.specialization;
      }

      const { data } = await authAPI.register(registrationData);
      
      // Dispatch Redux action
      dispatch(loginSuccess({
        user: data.data.user,
        token: data.data.token,
      }));
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      const role = data.data.user.role;
      if (role === 'seller') {
        toast.info('Your seller account is pending approval');
        navigate('/seller');
      } else {
        navigate('/buyer');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error toast is handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our marketplace today</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('buyer')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'buyer'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiShoppingCart className={`w-8 h-8 mx-auto mb-2 ${
                    formData.role === 'buyer' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="font-semibold">Buy Products</div>
                  <div className="text-xs text-gray-500 mt-1">Browse and purchase</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('seller')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'seller'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiShoppingBag className={`w-8 h-8 mx-auto mb-2 ${
                    formData.role === 'seller' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="font-semibold">Sell Products</div>
                  <div className="text-xs text-gray-500 mt-1">Start your business</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Seller-specific fields */}
            {formData.role === 'seller' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required={formData.role === 'seller'}
                    className="input-field"
                    placeholder="e.g., Tech Gadgets Store"
                    value={formData.shopName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    required={formData.role === 'seller'}
                    className="input-field"
                    placeholder="e.g., Electronics"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pl-10 pr-10"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pl-10"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner mr-2 w-5 h-5 border-2"></div>
                  Creating account...
                </span>
              ) : (
                `Create ${formData.role === 'seller' ? 'Seller' : 'Buyer'} Account`
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;