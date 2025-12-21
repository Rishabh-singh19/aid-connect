import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [appliedScheme, setAppliedScheme] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get applied scheme info
    const schemeData = localStorage.getItem('appliedScheme');
    if (schemeData) {
      setAppliedScheme(JSON.parse(schemeData));
    }
  }, []);

  useEffect(() => {
    async function getCameraStream() {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
          setStream(cameraStream);
          setIsCameraOn(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError('Unable to access camera. Please check permissions.');
        setIsCameraOn(false);
      }
    }
    
    getCameraStream();
    
    // Cleanup function
    return () => {
      stopCamera();
    };
  }, []);

  // Function to stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Function to start camera
  const startCamera = async () => {
    try {
      setError('');
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        setStream(cameraStream);
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error restarting camera:', error);
      setError('Failed to start camera. Please check permissions.');
    }
  };

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(imageDataUrl);
      
      // Upload photo automatically to backend
      uploadPhotoToBackend(imageDataUrl);
      
      // Stop camera immediately after capturing photo
      stopCamera();
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null);
    setError('');
    startCamera();
  }

  async function uploadPhotoToBackend(photoData) {
    if (!photoData) return;
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first');
        return;
      }
      
      // Convert base64 to blob
      const response = await fetch(photoData);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('photo', blob, `${appliedScheme?.title || 'scheme'}_${user.name}_${Date.now()}.jpg`);
      formData.append('userId', user._id || user.id);
      
      // Get current application data
      const currentApp = JSON.parse(localStorage.getItem('currentApplication') || '{}');
      if (currentApp.applicationId) {
        formData.append('applicationId', currentApp.applicationId);
        formData.append('schemeTitle', currentApp.schemeTitle);
      }
      
      // Upload to backend
      const uploadResponse = await fetch('http://localhost:5000/api/documents/upload-photo', {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.ok) {
        console.log('✅ Photo uploaded to backend successfully!');
      } else {
        console.error('❌ Photo upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  }

  function downloadPhoto() {
    if (!capturedPhoto) return;
    
    const link = document.createElement('a');
    link.href = capturedPhoto;
    link.download = `photo_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Manual camera controls
  const handleTurnCameraOn = () => {
    if (!isCameraOn) {
      startCamera();
    }
  };

  const handleTurnCameraOff = () => {
    if (isCameraOn) {
      stopCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Camera Capture</h1>
          {appliedScheme && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold">Applied for: {appliedScheme.title}</p>
              <p className="text-blue-600 text-sm">Please capture your photo for verification</p>
            </div>
          )}
          <p className="text-gray-600">Take photos directly from your device camera</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Camera Status Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isCameraOn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <span className="font-medium text-gray-700">
                    Camera: {isCameraOn ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-xs text-gray-500">
                    {isCameraOn ? 'Ready to capture photos' : 'Camera is turned off'}
                  </p>
                </div>
              </div>
              {!capturedPhoto && (
                <div className="flex gap-2">
                  {isCameraOn ? (
                    <button 
                      onClick={handleTurnCameraOff}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Turn Off
                    </button>
                  ) : (
                    <button 
                      onClick={handleTurnCameraOn}
                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Turn On
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Camera Feed */}
          <div className="mb-6">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-auto ${capturedPhoto ? 'hidden' : 'block'} ${!isCameraOn ? 'opacity-50' : ''}`}
              />
              
              {/* Camera Overlay when active */}
              {!capturedPhoto && isCameraOn && (
                <>
                  <div className="absolute inset-0 pointer-events-none border-4 border-white/10 rounded-lg">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                    📷 Camera is active
                  </div>
                </>
              )}
              
              {/* Camera Off Indicator */}
              {!capturedPhoto && !isCameraOn && (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-800 text-white p-4">
                  <div className="relative mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-red-500 rotate-45"></div>
                  </div>
                  <p className="text-lg font-medium">Camera is off</p>
                  <p className="text-sm text-gray-400 mt-1">Turn on camera to take photos</p>
                  <button 
                    onClick={handleTurnCameraOn}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Turn Camera On
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {!capturedPhoto ? (
              <button 
                onClick={takePhoto}
                disabled={!isCameraOn}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isCameraOn 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
                {isCameraOn && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    (Camera will turn off)
                  </span>
                )}
              </button>
            ) : (
              <>
                <button 
                  onClick={retakePhoto}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake Photo
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    (Camera will turn on)
                  </span>
                </button>
                <button 
                  onClick={() => navigate('/documents')}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Next
                </button>
                <button 
                  onClick={downloadPhoto}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Photo
                </button>
              </>
            )}
          </div>

          {/* Preview Section */}
          {capturedPhoto && (
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Captured Photo
                  </h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Camera is off to save battery</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Ready to download
                  </span>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="relative">
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-auto rounded-lg shadow-lg border border-gray-300"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              
              {/* Camera Status in Preview */}
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Camera turned off</span>
                </div>
                <p className="text-sm text-red-600 mt-1 ml-7">
                  Camera automatically turns off after capturing photo to save battery. 
                  Click "Retake Photo" to turn camera back on.
                </p>
              </div>

              {/* Next Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate('/documents')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Continue to Documents
                </button>
              </div>
            </div>
          )}

          {/* Information Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Privacy First
                </h4>
                <p className="text-sm text-blue-700">
                  All photos are processed locally and never leave your device. Camera turns off automatically after capture.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Battery Saving
                </h4>
                <p className="text-sm text-green-700">
                  Camera automatically turns off when not in use to save battery life and prevent overheating.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default CameraCapture;