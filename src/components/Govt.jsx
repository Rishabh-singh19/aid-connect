import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Govt() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
    fetchSchemes();
  }, [user]);

  const fetchSchemes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schemes');
      const data = await response.json();
      setAllSchemes(data);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/notifications/${user._id || user.id}/count`);
      const data = await response.json();
      setNotificationCount(data.count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleApplyScheme = async (scheme) => {
    if (!user) {
      alert('Please login to apply for schemes');
      return;
    }

    try {
      console.log('Applying for scheme:', scheme);
      console.log('User data:', user);
      
      const applicationData = {
        userId: user._id || user.id,
        schemeId: scheme.id.toString(),
        schemeTitle: scheme.title,
        userName: user.name,
        userEmail: user.email
      };
      
      console.log('Sending application data:', applicationData);
      
      const response = await fetch('http://localhost:5000/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store scheme info for camera page
        localStorage.setItem('currentApplication', JSON.stringify({
          applicationId: data.applicationId,
          schemeTitle: scheme.title,
          schemeId: scheme.id
        }));
        
        alert('Application submitted! Please capture your photo.');
        navigate('/camera');
      } else {
        alert(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Application failed. Please try again.');
    }
  };
  const [allSchemes, setAllSchemes] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 6;

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState("default");

  // View Mode
  const [viewMode, setViewMode] = useState("cards");

  // Modal
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Dropdown Data
  const categories = ["All", ...new Set(allSchemes.map((s) => s.category))];
  const statuses = ["All", ...new Set(allSchemes.map((s) => s.status))];

  // Filter Logic
  const filteredSchemes = allSchemes.filter((scheme) => {
    return (
      (selectedCategory === "All" || scheme.category === selectedCategory) &&
      (selectedStatus === "All" || scheme.status === selectedStatus) &&
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort Logic
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "priority")
      return a.priority.localeCompare(b.priority);
    if (sortBy === "latest")
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    return 0;
  });

  // Pagination Calculation
  const indexOfLast = currentPage * schemesPerPage;
  const indexOfFirst = indexOfLast - schemesPerPage;
  const currentSchemes = sortedSchemes.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sortedSchemes.length / schemesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-blue-700 text-white py-3 px-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">GS</span>
            </div>
            <span className="font-semibold text-lg">Government Schemes</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                {user?.photo ? (
                  <img 
                    src={`http://localhost:5000/uploads/${user.photo}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-700 font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-sm text-blue-200">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/messages')}
                className="relative px-4 py-2 bg-white text-blue-700 rounded-md text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-semibold transform active:scale-95"
              >
                Messages
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-white text-blue-700 rounded-md text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-semibold transform active:scale-95"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 hover:scale-105 transition-all duration-200 font-semibold transform active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-8 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Browse Government Schemes
          </h1>
          <p className="text-lg text-gray-600 mb-6 animate-fade-in-up animation-delay-200">
            Discover and apply for various government schemes and benefits
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-slide-in-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Filter & Search Schemes</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search schemes..."
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Category Filter */}
              <select
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By</option>
                <option value="title">Title</option>

                <option value="latest">Latest Updated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* View Mode */}
      <section className="py-4 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-end mb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-1">
              <button
                className={`px-4 py-2 rounded-md font-medium transition ${
                  viewMode === "cards" ? "bg-blue-700 text-white" : "text-gray-600 hover:text-blue-700"
                }`}
                onClick={() => setViewMode("cards")}
              >
                Cards
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition ${
                  viewMode === "list" ? "bg-blue-700 text-white" : "text-gray-600 hover:text-blue-700"
                }`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Card/List View */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div
            className={
              viewMode === "cards"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {currentSchemes.map((scheme, index) => (
              <div
                key={scheme.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedScheme(scheme)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    scheme.status === 'active' ? 'bg-green-100 text-green-800' : 
                    scheme.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {scheme.status}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scheme.desc}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{scheme.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Date:</span>
                    <span className="font-medium">{scheme.endDate}</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-200 font-medium transform active:scale-95">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedScheme.title}</h2>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedScheme.status === 'active' ? 'bg-green-100 text-green-800' : 
                    selectedScheme.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedScheme.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{selectedScheme.desc}</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Scheme Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Start Date</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.startDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">End Date</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.endDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Application Fee</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.feeDate}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Correction Window</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.correctionWindow}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <p className="text-gray-900 font-medium">{selectedScheme.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
                  selectedScheme.status === 'upcoming' 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-700 hover:bg-blue-800 text-white hover:scale-105 transform active:scale-95'
                }`}
                onClick={() => selectedScheme.status !== 'upcoming' && handleApplyScheme(selectedScheme)}
                disabled={selectedScheme.status === 'upcoming'}
              >
                {selectedScheme.status === 'upcoming' ? 'Coming Soon' : 'Apply Now'}
              </button>
              <button
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200 hover:scale-105 transform active:scale-95"
                onClick={() => setSelectedScheme(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out forwards;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }
`;
document.head.appendChild(style);
