const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true
  },
  owner: String,
  contact: String,
  address: String,
  type: {
    type: String,
    enum: ['Owner Vehicle', 'Vendor Vehicle'],
    default: 'Owner Vehicle'
  },
  documents: {
    insurance: String,
    puc: String,
    healthCard: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
