import User from '../model/userModel.js';
import Seller from '../model/sellerModel.js';
import { generateToken } from '../middleware/authMiddleware.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, shopName, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // If seller, create seller profile
    if (role === 'seller') {
      if (!shopName || !specialization) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Shop name and specialization are required for sellers'
        });
      }

      await Seller.create({
        userId: user._id,
        shopName,
        specialization,
        verificationStatus: 'pending'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Contact admin.'
      });
    }

    // For sellers, check verification status
    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user._id });
      if (seller && seller.verificationStatus === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Your seller account has been blocked. Contact admin.'
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    // If seller, get seller profile
    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = await Seller.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        sellerProfile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Password change failed',
      error: error.message
    });
  }
};