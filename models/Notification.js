const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  type: { type: String, default: 'info' }, // info, success, warning, danger
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
