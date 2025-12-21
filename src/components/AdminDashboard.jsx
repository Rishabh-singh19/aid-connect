import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Reusable Components
const DocumentLinks = ({ documents }) => {
  const docTypes = [
    { key: 'signature', label: 'Signature' },
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'panCard', label: 'PAN Card' },
    { key: 'residentialCertificate', label: 'Residential' }
  ];
  
  return (
    <div className="space-y-2">
      {docTypes.map(({ key, label }) => 
        documents?.[key] && (
          <div key={key} className="text-sm">
            <a 
              href={`http://localhost:5000/uploads/${documents[key]}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {label}
            </a>
          </div>
        )
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

const UserAvatar = ({ user, size = 'h-10 w-10' }) => (
  user.photo ? (
    <img 
      className={`${size} rounded-full object-cover border border-gray-200`} 
      src={`http://localhost:5000/uploads/${user.photo}`} 
      alt={user.name} 
    />
  ) : (
    <div className={`${size} rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center`}>
      <span className="text-sm font-medium text-gray-600">{user.name?.charAt(0)}</span>
    </div>
  )
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/all-data');
      const data = await response.json();
      setUsers(data.users || []);
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-bar' },
    { id: 'users', label: 'Users', icon: 'fas fa-users', count: users.length },
    { id: 'applications', label: 'Applications', icon: 'fas fa-file-alt', count: applications.length },
    { id: 'pending', label: 'Pending', icon: 'fas fa-clock', count: applications.filter(app => app.status === 'pending').length },
    { id: 'approved', label: 'Approved', icon: 'fas fa-check-circle', count: applications.filter(app => app.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle', count: applications.filter(app => app.status === 'rejected').length }
  ];

  // Get filtered and sorted applications based on active tab
  const getFilteredAndSortedApplications = () => {
    let filtered = activeTab === 'applications' 
      ? applications 
      : applications.filter(app => app.status === activeTab);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.schemeTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort applications
    return filtered.sort((a, b) => {
      const dateA = new Date(a.applicationDate || a.createdAt);
      const dateB = new Date(b.applicationDate || b.createdAt);
      
      switch(sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'name':
          return (a.userId?.name || '').localeCompare(b.userId?.name || '');
        default:
          return dateB - dateA;
      }
    });
  };
  
  const filteredApplications = getFilteredAndSortedApplications();

  // Get filtered users based on search
  const getFilteredUsers = () => {
    if (!userSearchTerm) return users;
    
    return users.filter(user => 
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.mobile?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  };
  
  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-10`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="font-semibold text-gray-800">Admin</h1>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg mb-1 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 ml-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto p-2">
          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center justify-center px-2 py-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors text-xs"
          >
            <i className="fas fa-sign-out-alt text-sm"></i>
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-6 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">{activeTab}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'dashboard' ? 'Overview of all activities' : `Manage ${activeTab} efficiently`}
          </p>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{users.length}</p>
                  </div>
                  <div className="text-2xl p-3 rounded-full bg-blue-50 text-blue-600">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Applications</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{applications.length}</p>
                  </div>
                  <div className="text-2xl p-3 rounded-full bg-emerald-50 text-emerald-600">
                    <i className="fas fa-file-alt"></i>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {applications.filter(app => app.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-2xl p-3 rounded-full bg-amber-50 text-amber-600">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Approved</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {applications.filter(app => app.status === 'approved').length}
                    </p>
                  </div>
                  <div className="text-2xl p-3 rounded-full bg-green-50 text-green-600">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bars Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Progress */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Overview</h3>
                <div className="space-y-4">
                  {(() => {
                    const total = applications.length || 1;
                    const approved = applications.filter(app => app.status === 'approved').length;
                    const pending = applications.filter(app => app.status === 'pending').length;
                    const rejected = applications.filter(app => app.status === 'rejected').length;
                    
                    return [
                      { label: 'Approved', count: approved, color: 'bg-green-500', percentage: (approved / total) * 100 },
                      { label: 'Pending', count: pending, color: 'bg-amber-500', percentage: (pending / total) * 100 },
                      { label: 'Rejected', count: rejected, color: 'bg-red-500', percentage: (rejected / total) * 100 }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm text-gray-500">{item.count} ({item.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {applications
                    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                    .slice(0, 5)
                    .map((app, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          app.status === 'approved' ? 'bg-green-500' : 
                          app.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {app.userId?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Applied for {app.schemeTitle}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))
                  }
                  {applications.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No recent activities
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors group"
                >
                  <div className="text-amber-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                    <i className="fas fa-clock"></i>
                  </div>
                  <p className="text-sm font-medium text-amber-700">Review Pending</p>
                  <p className="text-xs text-amber-600">{applications.filter(app => app.status === 'pending').length} items</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('users')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group"
                >
                  <div className="text-blue-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                    <i className="fas fa-users"></i>
                  </div>
                  <p className="text-sm font-medium text-blue-700">Manage Users</p>
                  <p className="text-xs text-blue-600">{users.length} users</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('approved')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
                >
                  <div className="text-green-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <p className="text-sm font-medium text-green-700">View Approved</p>
                  <p className="text-xs text-green-600">{applications.filter(app => app.status === 'approved').length} approved</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('applications')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors group"
                >
                  <div className="text-purple-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <p className="text-sm font-medium text-purple-700">All Applications</p>
                  <p className="text-xs text-purple-600">{applications.length} total</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                
                {/* User Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400 text-sm"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>
              
              {/* User Search Results Info */}
              {userSearchTerm && (
                <div className="mt-3 text-sm text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} for "{userSearchTerm}"
                  <button 
                    onClick={() => setUserSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {userSearchTerm ? `No users found for "${userSearchTerm}"` : 'No users found'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => {
                const userApplications = applications.filter(app => app.userId?._id === user._id);
                return (
                  <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserAvatar user={user} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {userApplications.length} application{userApplications.length !== 1 ? 's' : ''}
                      </div>
                      <button 
                        onClick={() => setSelectedUser(user)} 
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Section */}
        {(activeTab === 'applications' || activeTab === 'pending' || activeTab === 'approved' || activeTab === 'rejected') && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">{activeTab} Applications</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="status">Status</option>
                      <option value="name">Applicant Name</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Search Results Info */}
              {searchTerm && (
                <div className="mt-3 text-sm text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Showing {filteredApplications.length} result{filteredApplications.length !== 1 ? 's' : ''} for "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {activeTab === 'applications' ? '' : activeTab} applications found
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredApplications.map((app) => {
                    const appDate = new Date(app.applicationDate || app.createdAt);
                    const dayName = appDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = appDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    
                    return (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{app.schemeTitle}</h4>
                            <p className="text-sm text-gray-500 mt-1">{app.userId?.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400">{dayName}</span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{formattedDate}</span>
                            </div>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                            <span className="text-gray-500 text-xs">
                              {appDate.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => setSelectedUser(app.userId)} 
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View User
                            </button>
                            <button 
                              onClick={() => navigate(`/admin/approval/${app._id}`)} 
                              className="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
                            >
                              <i className="fas fa-eye mr-1"></i>Review
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex items-center space-x-4 mb-6">
                <UserAvatar user={selectedUser} size="h-16 w-16" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Joined {selectedUser.firstSignedUp ? new Date(selectedUser.firstSignedUp).toLocaleDateString() : selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Applications</h5>
                  <div className="space-y-3">
                    {applications.filter(app => app.userId?._id === selectedUser._id).length === 0 ? (
                      <p className="text-gray-500 text-sm">No applications found</p>
                    ) : (
                      applications.filter(app => app.userId?._id === selectedUser._id).map(app => (
                        <div key={app._id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900 text-sm">{app.schemeTitle}</span>
                            <StatusBadge status={app.status} />
                          </div>
                          <p className="text-xs text-gray-500">
                            Applied on {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Documents</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <DocumentLinks documents={selectedUser.documents} />
                    {selectedUser.photo && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <a 
                          href={`http://localhost:5000/uploads/${selectedUser.photo}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                          View Profile Photo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ); 
}

export default AdminDashboard;