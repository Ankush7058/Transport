const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  gst: { type: String }
});

module.exports = mongoose.model('Party', partySchema);
