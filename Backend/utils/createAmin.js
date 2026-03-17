import User from '../model/userModel.js';
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('✓ Default admin user created');
    console.log('  Email:', admin.email);
    console.log('  Password:', process.env.ADMIN_PASSWORD || 'Admin@123');
    console.log('  ⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
  }
};
export default createAdmin;