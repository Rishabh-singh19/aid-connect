import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DocumentUploader() {
  const navigate = useNavigate();
  const [signature, setSignature] = useState(null);
  const [aadhaar, setAadhaar] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [residentialCertificate, setResidentialCertificate] = useState(null);

  const [errors, setErrors] = useState({
    signature: '',
    aadhaar: '',
    panCard: '',
    residentialCertificate: '',
  });


  const bytesToMB = (bytes) => bytes / (1024 * 1024);

  // Max sizes in MB
  const MAX_SIZES = {
    signature: 5,
    aadhaar: 10,
    panCard: 10,
    residentialCertificate: 10,
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset error for this type
    setErrors((prev) => ({ ...prev, [type]: '' }));

    // Check file type
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type]: 'Invalid file type. Only PNG, JPG, JPEG and PDF allowed.',
      }));
      setFileByType(type, null);
      return;
    }

    // Check file size limit
    if (bytesToMB(file.size) > MAX_SIZES[type]) {
      setErrors((prev) => ({
        ...prev,
        [type]: `File too large. Max size is ${MAX_SIZES[type]} MB.`,
      }));
      setFileByType(type, null);
      return;
    }

    // All good, save the file
    setFileByType(type, file);
  };

  // Helper to update file states based on type
  const setFileByType = (type, file) => {
    switch (type) {
      case 'signature':
        setSignature(file);
        break;
      case 'aadhaar':
        setAadhaar(file);
        break;
      case 'panCard':
        setPanCard(file);
        break;
      case 'residentialCertificate':
        setResidentialCertificate(file);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Document Upload Portal
          </h1>
          <p className="text-gray-600 text-lg">
            Please upload all required documents to complete your application
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Signature */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Digital Signature <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(max 5 MB)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => handleFileChange(e, 'signature')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {signature && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded: {signature.name}</span>
                  </div>
                )}
                {errors.signature && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.signature}</span>
                  </p>
                )}
              </div>

              {/* Aadhaar Card */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Aadhaar Card <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(max 10 MB)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => handleFileChange(e, 'aadhaar')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {aadhaar && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded: {aadhaar.name}</span>
                  </div>
                )}
                {errors.aadhaar && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.aadhaar}</span>
                  </p>
                )}
              </div>

              {/* PAN Card */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  PAN Card <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(max 10 MB)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => handleFileChange(e, 'panCard')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {panCard && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded: {panCard.name}</span>
                  </div>
                )}
                {errors.panCard && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.panCard}</span>
                  </p>
                )}
              </div>

              {/* Residential Certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Residential Certificate <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(max 10 MB)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={(e) => handleFileChange(e, 'residentialCertificate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {residentialCertificate && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded: {residentialCertificate.name}</span>
                  </div>
                )}
                {errors.residentialCertificate && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.residentialCertificate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Verification Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button disabled
                onClick={async () => {
                  try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (!user) {
                      alert('Please login first');
                      return;
                    }
                    
                    const response = await fetch(`http://localhost:5000/api/documents/user-documents/${user._id || user.id}`);
                    const result = await response.json();
                    
                    if (response.ok) {
                      const docs = result.documents;
                      const savedDocs = Object.keys(docs).filter(key => docs[key]);
                      if (savedDocs.length > 0) {
                        console.log('doc found');
                      } else {
                        console.log('no doc found');
                      }
                    } else {
                      alert('Failed to check documents: ' + result.message);
                    }
                  } catch (error) {
                    console.error('Verification error:', error);
                    alert('Failed to verify documents');
                  }
                }}
                className="w-full mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Uploads your doc carefully</span>
              </button>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Camera</span>
                </button>
                <button
                  onClick={async () => {
                    if (signature && aadhaar && panCard && residentialCertificate) {
                      try {
                        const formData = new FormData();
                        formData.append('signature', signature);
                        formData.append('aadhaar', aadhaar);
                        formData.append('panCard', panCard);
                        formData.append('residentialCertificate', residentialCertificate);
                        
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (!user) {
                          alert('Please login first');
                          return;
                        }
                        formData.append('userId', user._id || user.id);
                        
                        // Get current application data
                        const currentApp = JSON.parse(localStorage.getItem('currentApplication') || '{}');
                        if (currentApp.applicationId) {
                          formData.append('applicationId', currentApp.applicationId);
                        }
                        
                        console.log('Uploading documents to MongoDB...');
                        const response = await fetch('http://localhost:5000/api/documents/upload-documents', {
                          method: 'POST',
                          body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok) {
                          console.log('Documents saved to MongoDB:', result);
                          //alert(`Documents uploaded successfully to MongoDB!\nFiles saved: ${Object.keys(result.documents).join(', ')}`);
                          localStorage.removeItem('currentApplication');
                          navigate('/schemes');
                        } else {
                          console.error('Upload failed:', result);
                          alert(`Upload failed: ${result.message}`);
                        }
                      } catch (error) {
                        console.error('Upload error:', error);
                        alert('Upload failed: ' + error.message);
                      }
                    } else {
                      alert('Please select all required documents before uploading.');
                    }
                  }}
                  disabled={!signature || !aadhaar || !panCard || !residentialCertificate}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                    signature && aadhaar && panCard && residentialCertificate
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>All documents are securely stored and will be used only for verification purposes.</p>
        </div>
      </div>
    </div>
  );
}

export default DocumentUploader;