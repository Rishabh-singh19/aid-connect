const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  feeDate: {
    type: String,
    required: true
  },
  correctionWindow: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'upcoming', 'closed']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scheme', schemeSchema);