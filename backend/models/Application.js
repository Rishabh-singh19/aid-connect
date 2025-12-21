const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: String, required: true },
  schemeTitle: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  photo: { type: String },
  photoFilename: { type: String },
  photoUploaded: { type: Boolean, default: false },
  documents: {
    signature: { type: String },
    aadhaar: { type: String },
    panCard: { type: String },
    residentialCertificate: { type: String }
  },
  documentsUploaded: { type: Boolean, default: false },
  remarks: { type: String },
  applicationDate: { type: Date }
}, { timestamps: true });

applicationSchema.pre('save', function(next) {
  if (this.isNew && !this.applicationDate) {
    this.applicationDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);