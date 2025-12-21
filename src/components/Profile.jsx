import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };
  
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${config[status]?.bg} ${config[status]?.text} ${config[status]?.border}`}>
      {status}
    </span>
  );
};

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserData(parsedUser._id || parsedUser.id);
      fetchUserApplications(parsedUser._id || parsedUser.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Fallback to localStorage data
      const localUser = JSON.parse(localStorage.getItem('user'));
      setUser(localUser);
    }
  };

  const fetchUserApplications = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/user/${userId}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/schemes')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
              <p className="text-gray-500 text-sm">View your applications and profile information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              <i className="fas fa-user mr-2"></i>Profile Information
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                {user?.photo ? (
                  <img 
                    src={`http://localhost:5000/uploads/${user.photo}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{user?.name}</h4>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {user?.firstSignedUp ? new Date(user.firstSignedUp).toLocaleDateString() : user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <button 
                  onClick={() => navigate('/info')}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    user?.isPersonalInfoCompleted 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {user?.isPersonalInfoCompleted ? '✓ Verified' : 'Verify User'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-file-alt mr-2"></i>My Applications ({applications.length})
              </h3>
              <button 
                onClick={() => navigate('/schemes')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                <i className="fas fa-plus mr-2"></i>Apply for New Scheme
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
                <h4 className="text-xl font-medium text-gray-500 mb-2">No Applications Yet</h4>
                <p className="text-gray-400 mb-6">You haven't applied for any schemes yet.</p>
                <button 
                  onClick={() => navigate('/schemes')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Browse Schemes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{app.schemeTitle}</h4>
                        <p className="text-sm text-gray-500 mt-1">Application ID: {app._id}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Applied Date:</span>
                        <p className="font-medium">{app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Scheme ID:</span>
                        <p className="font-medium">{app.schemeId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p className="font-medium">{app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    
                    {app.remarks && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 text-sm">Admin Remarks:</span>
                        <p className="text-gray-700 text-sm mt-1">{app.remarks}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2 text-xs">
                        {app.photoUploaded && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            <i className="fas fa-camera mr-1"></i>Photo Uploaded
                          </span>
                        )}
                        {app.documentsUploaded && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            <i className="fas fa-file-text mr-1"></i>Documents Uploaded
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {app.status === 'pending' && 'Under Review'}
                        {app.status === 'approved' && 'Application Approved'}
                        {app.status === 'rejected' && 'Application Rejected'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;