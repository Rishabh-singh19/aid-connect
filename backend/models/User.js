const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  photo: { type: String },
  lastAppliedScheme: { type: String },
  firstSignedUp: { type: Date, default: Date.now },
  // Personal Information
  fatherName: { type: String },
  motherName: { type: String },
  mobile: { type: String },
  aadhaar: { type: String },
  pan: { type: String },
  income: { type: Number },
  ifsc: { type: String },
  bank: { type: String },
  // OTP Verification
  otp: { type: String },
  otpExpiry: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  isPersonalInfoCompleted: { type: Boolean, default: false },
  documents: {
    signature: { type: String },
    aadhaar: { type: String },
    panCard: { type: String },
    residentialCertificate: { type: String }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);