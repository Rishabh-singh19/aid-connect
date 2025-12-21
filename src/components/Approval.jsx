import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DocumentViewer = ({ applicationDocuments, applicationPhoto }) => {
  const docTypes = [
    { key: 'signature', label: 'Signature', icon: 'fas fa-signature' },
    { key: 'aadhaar', label: 'Aadhaar Card', icon: 'fas fa-id-card' },
    { key: 'panCard', label: 'PAN Card', icon: 'fas fa-credit-card' },
    { key: 'residentialCertificate', label: 'Residential Certificate', icon: 'fas fa-home' }
  ];

  const hasDocuments = applicationDocuments && Object.values(applicationDocuments).some(doc => doc);

  return (
    <div className="space-y-4">
      {applicationPhoto && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-camera text-blue-500"></i>
              <span className="font-medium">Application Photo</span>
            </div>
            <a 
              href={`http://localhost:5000/uploads/${applicationPhoto}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              <i className="fas fa-eye mr-1"></i>View
            </a>
          </div>
        </div>
      )}
      
      {hasDocuments ? (
        docTypes.map(({ key, label, icon }) => 
          applicationDocuments[key] && (
            <div key={key} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${icon} text-green-500`}></i>
                  <span className="font-medium">{label}</span>
                </div>
                <a 
                  href={`http://localhost:5000/uploads/${applicationDocuments[key]}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  <i className="fas fa-external-link-alt mr-1"></i>View Document
                </a>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-folder-open text-4xl mb-2"></i>
          <p>No documents uploaded for this application</p>
        </div>
      )}
    </div>
  );
};

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

function Approval() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`);
      const data = await response.json();
      setApplication(data.application);
      setScheme(data.scheme);
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });
      
      if (response.ok) {
        setApplication(prev => ({ ...prev, status, remarks }));
        alert(`Application ${status} successfully!`);
        if (status !== 'pending') {
          setRemarks('');
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    if (application?.remarks) {
      setRemarks(application.remarks);
    }
  }, [application]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600">Application not found</p>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
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
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Application Review</h1>
              <p className="text-gray-500 text-sm">Review and approve application</p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Applicant Info */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-user mr-2"></i>Applicant Information
              </h3>
            </div>
            <div className="p-5">
              <div className="flex items-center space-x-4 mb-4">
                {application.userId?.photo ? (
                  <img 
                    className="h-16 w-16 rounded-full object-cover border" 
                    src={`http://localhost:5000/uploads/${application.userId.photo}`} 
                    alt={application.userId.name} 
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border">
                    <span className="text-xl font-medium text-gray-600">
                      {application.userId?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{application.userId?.name}</h4>
                  <p className="text-gray-600">{application.userId?.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Application ID:</span>
                  <span className="font-medium">{application._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applied Date:</span>
                  <span className="font-medium">{new Date(application.applicationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={application.status} />
                </div>
                {application.remarks && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-500 text-xs">Admin Remarks:</span>
                    <p className="text-sm text-gray-700 mt-1">{application.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-id-card mr-2"></i>Personal Information
              </h3>
            </div>
            <div className="p-5">
              {application.userId?.isPersonalInfoCompleted ? (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Father's Name:</span>
                      <p className="font-medium">{application.userId.fatherName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mother's Name:</span>
                      <p className="font-medium">{application.userId.motherName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Mobile:</span>
                      <p className="font-medium">{application.userId.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Aadhaar:</span>
                      <p className="font-medium">{application.userId.aadhaar || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">PAN:</span>
                      <p className="font-medium">{application.userId.pan || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Annual Income:</span>
                      <p className="font-medium">₹{application.userId.income || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">IFSC Code:</span>
                      <p className="font-medium">{application.userId.ifsc || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bank:</span>
                      <p className="font-medium">{application.userId.bank || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-exclamation-circle text-3xl mb-2"></i>
                  <p>Personal information not completed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Scheme Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-file-contract mr-2"></i>Scheme Details
              </h3>
            </div>
            <div className="p-5">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">{application.schemeTitle}</h4>
              
              {scheme && (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600 text-sm">{scheme.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Eligibility Criteria</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {scheme.eligibility?.map((criteria, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <i className="fas fa-check text-green-500 mt-0.5"></i>
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Benefits</h5>
                    <p className="text-gray-600 text-sm">{scheme.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-folder-open mr-2"></i>Submitted Documents
              </h3>
            </div>
            <div className="p-5">
              <DocumentViewer 
                applicationDocuments={application.documents} 
                applicationPhoto={application.photoFilename || application.photo} 
              />
            </div>
          </div>
        </div>

        {/* Remarks and Action Buttons */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-comment-alt mr-2"></i>Admin Remarks
          </h3>
          
          <div className="mb-4">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add your remarks about this application..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>
          
          {application.status === 'pending' && (
            <div className="flex space-x-4">
              <button
                onClick={() => updateApplicationStatus('approved')}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <i className="fas fa-check mr-2"></i>Approve Application
              </button>
              <button
                onClick={() => updateApplicationStatus('rejected')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-times mr-2"></i>Reject Application
              </button>
            </div>
          )}
          
          {application.status !== 'pending' && (
            <div className="text-sm text-gray-500">
              <i className="fas fa-info-circle mr-1"></i>
              This application has been {application.status}. Remarks are read-only.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Approval;