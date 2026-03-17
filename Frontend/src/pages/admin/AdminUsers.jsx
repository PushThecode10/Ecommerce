import { useEffect, useState } from 'react';
import { adminAPI } from '../../service/apiAuth.js';
import { FiSearch, FiEye, FiEyeOff, FiTrash2, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

 const filteredUsers = users.filter(user => {
  const search = searchTerm?.toLowerCase() || '';

  const matchesSearch =
    (user.name?.toLowerCase() || '').includes(search) ||
    (user.email?.toLowerCase() || '').includes(search);

  const matchesRole = roleFilter === 'all' || user.role === roleFilter;

  const matchesStatus =
    statusFilter === 'all' ||
    (statusFilter === 'active' && user.isActive) ||
    (statusFilter === 'inactive' && !user.isActive);

  return matchesSearch && matchesRole && matchesStatus;
});
  const getRoleBadge = (role) => {
    const colors = {
      admin: 'badge-danger',
      seller: 'badge-warning',
      buyer: 'badge-info',
    };
    return colors[role] || 'badge';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <select
            className="input-field"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          {/* Status Filter */}
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${getRoleBadge(user.role)} capitalize`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className={`p-2 rounded-lg ${
                          user.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          title="Delete user"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Buyers</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'buyer').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Sellers</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'seller').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Users;