const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  vehicleType: {
    type: String,
    enum: ['IN', 'OUT'], // IN = Owner Vehicle, OUT = Vendor Vehicle
    required: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  contact: String,
  address: String,
  gst: String,
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  consignmentNo: String,
  from: String,
  to: String,
  rentForParty: Number,
  rentForOwner: Number,
  advance: Number,
  pending: Number,
  commission: Number,
  hamali: Number,
  holdingCharges: Number,
  stCharges: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
