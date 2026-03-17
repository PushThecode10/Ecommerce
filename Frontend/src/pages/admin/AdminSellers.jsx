import { useEffect, useState } from 'react';
import { adminAPI } from '../../service/apiAuth.js';
import { FiCheck, FiX, FiLock, FiUnlock, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const { data } = await adminAPI.getSellers();
      setSellers(data.data.sellers || []);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (sellerId, status) => {
    const action = status === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this seller?`)) {
      return;
    }

    try {
      await adminAPI.verifySeller(sellerId, status);
      toast.success(`Seller ${status} successfully`);
      loadSellers();
    } catch (error) {
      console.error('Failed to verify seller:', error);
    }
  };

  const handleBlock = async (sellerId) => {
    if (!window.confirm('Are you sure you want to toggle block status for this seller?')) {
      return;
    }

    try {
      await adminAPI.blockSeller(sellerId);
      toast.success('Seller status updated');
      loadSellers();
    } catch (error) {
      console.error('Failed to block seller:', error);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = 
      seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || seller.verificationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      blocked: 'badge-danger',
    };
    return colors[status] || 'badge';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="text-gray-600 mt-2">{sellers.length} total sellers</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by shop name, owner, or specialization..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Total Sellers</p>
          <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {sellers.filter(s => s.verificationStatus === 'pending').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {sellers.filter(s => s.verificationStatus === 'approved').length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-gray-600 text-sm">Blocked</p>
          <p className="text-2xl font-bold text-red-600">
            {sellers.filter(s => s.verificationStatus === 'blocked').length}
          </p>
        </div>
      </div>

      {/* Sellers List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No sellers found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSellers.map((seller) => (
            <div key={seller._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{seller.shopName}</h3>
                      <p className="text-gray-600">{seller.specialization}</p>
                    </div>
                    <span className={`badge ${getStatusColor(seller.verificationStatus)} capitalize`}>
                      {seller.verificationStatus}
                    </span>
                  </div>

                  {seller.description && (
                    <p className="text-gray-600 text-sm mb-3">{seller.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Owner</p>
                      <p className="font-medium">{seller.userId?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{seller.userId?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="font-medium">{seller.totalSales || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="font-medium">${(seller.totalEarnings || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-medium">⭐ {(seller.rating || 0).toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    {seller.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(seller._id, 'approved')}
                          className="btn-primary flex items-center space-x-1 text-sm"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleVerify(seller._id, 'rejected')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center space-x-1 text-sm"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {seller.verificationStatus === 'approved' && (
                      <button
                        onClick={() => handleBlock(seller._id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center space-x-1 text-sm"
                      >
                        <FiLock className="w-4 h-4" />
                        <span>Block</span>
                      </button>
                    )}

                    {seller.verificationStatus === 'blocked' && (
                      <button
                        onClick={() => handleBlock(seller._id)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium flex items-center space-x-1 text-sm"
                      >
                        <FiUnlock className="w-4 h-4" />
                        <span>Unblock</span>
                      </button>
                    )}

                    {seller.verificationStatus === 'rejected' && (
                      <button
                        onClick={() => handleVerify(seller._id, 'approved')}
                        className="btn-primary flex items-center space-x-1 text-sm"
                      >
                        <FiCheck className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    )}

                    <div className="ml-auto text-sm text-gray-500">
                      Joined: {new Date(seller.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sellers;