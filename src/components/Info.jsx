import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Info() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    aadhaar: "",
    pan: "",
    income: "",
    ifsc: "",
    bank: "",
    email: "",
    otp: "",
    mobile: ""
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadUserData(parsedUser._id || parsedUser.id);
    }
  }, []);

  const loadUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`);
      const userData = await response.json();
      
      if (userData.isPersonalInfoCompleted) {
        setForm({
          name: userData.name || "",
          fatherName: userData.fatherName || "",
          motherName: userData.motherName || "",
          aadhaar: userData.aadhaar || "",
          pan: userData.pan || "",
          income: userData.income || "",
          ifsc: userData.ifsc || "",
          bank: userData.bank || "",
          email: userData.email || "",
          otp: "",
          mobile: userData.mobile || ""
        });
        setIsSubmitted(true);
        setOtpVerified(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const banks = [
    "State Bank of India (SBI)",
    "Punjab National Bank (PNB)",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Kotak Mahindra Bank",
    "Axis Bank",
    "IDBI Bank",
    "Indian Bank",
    "Indian Overseas Bank",
    "UCO Bank",
    "Central Bank of India",
    "Bank of India",
    "Yes Bank",
    "Federal Bank",
    "IndusInd Bank"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!form.email) {
      alert('Please enter email address');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        alert('OTP sent to your email!');
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
    setLoading(false);
  };
  
  const verifyOTP = async () => {
    if (!form.otp) {
      alert('Please enter OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp })
      });
      
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        alert('Email verified successfully!');
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (error) {
      alert('Error verifying OTP');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify your email first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${user._id || user.id}/personal-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setIsEditing(false);
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        alert("Information Submitted Successfully!");
      } else {
        alert(data.message || 'Failed to save information');
      }
    } catch (error) {
      console.error('Error saving information:', error);
      alert('Failed to save information. Please try again.');
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSubmitted(false);
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
            Beneficiary Information Form
          </h1>
          <p className="text-gray-600 text-lg">
            Please fill in all the required details accurately
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit}>
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Father's Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter father's name"
                  />
                </div>

                {/* Mother's Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={form.motherName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter mother's name"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength="10"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  <p className="text-xs text-gray-500">10-digit mobile number without country code</p>
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    maxLength="12"
                    value={form.aadhaar}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="12-digit Aadhaar number"
                  />
                  <p className="text-xs text-gray-500">12-digit number without spaces</p>
                </div>

                {/* PAN Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pan"
                    maxLength="10"
                    value={form.pan}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none uppercase ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="ABCDE1234F"
                  />
                  <p className="text-xs text-gray-500">10-character alphanumeric</p>
                </div>

                {/* Annual Income */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Annual Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="income"
                      value={form.income}
                      onChange={handleChange}
                      required
                      disabled={isSubmitted && !isEditing}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter annual income"
                      min="0"
                    />
                  </div>
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifsc"
                    maxLength="11"
                    value={form.ifsc}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none uppercase ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="SBIN0001234"
                  />
                  <p className="text-xs text-gray-500">11-character bank code</p>
                </div>

                {/* Bank Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Bank <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bank"
                    value={form.bank}
                    onChange={handleChange}
                    required
                    disabled={isSubmitted && !isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  >
                    <option value="" disabled className="text-gray-400">
                      -- Select Bank --
                    </option>
                    {banks.map((bank, index) => (
                      <option key={index} value={bank} className="text-gray-700">
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Verification */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitted && !isEditing}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${isSubmitted && !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter email address"
                    />
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={loading || otpSent || (isSubmitted && !isEditing)}
                      className={`px-4 py-3 text-white rounded-lg transition duration-200 font-medium whitespace-nowrap ${
                        otpSent ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                      } ${(loading || (isSubmitted && !isEditing)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {/* OTP Verification */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    OTP <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="otp"
                      maxLength="6"
                      value={form.otp}
                      onChange={handleChange}
                      required
                      disabled={!otpSent || (isSubmitted && !isEditing)}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none ${
                        (!otpSent || (isSubmitted && !isEditing)) ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter 6-digit OTP"
                    />
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={!otpSent || loading || otpVerified || !form.otp || (isSubmitted && !isEditing)}
                      className={`px-4 py-3 text-white rounded-lg transition duration-200 font-medium whitespace-nowrap ${
                        otpVerified ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                      } ${(!otpSent || loading || !form.otp || (isSubmitted && !isEditing)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Verifying...' : otpVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {otpVerified ? '✅ Email verified successfully' : 'Enter the OTP sent to your email'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitted && !isEditing}
                    className={`flex-1 font-semibold py-4 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition duration-300 transform ${
                      isSubmitted && !isEditing
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-300 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitted && !isEditing ? '✓ Information Submitted' : 'Submit Information'}
                  </button>
                  {isSubmitted && !isEditing && (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-6 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  {isSubmitted && !isEditing
                    ? 'Information submitted successfully. Click Edit to make changes.'
                    : 'All fields marked with * are required'
                  }
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Your information is secure and will be used only for official purposes.</p>
        </div>
      </div>
    </div>
  );
}

export default Info;