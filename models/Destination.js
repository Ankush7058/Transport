const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  destinationName: { type: String, required: true },
  destinationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);
