const mongoose = require('mongoose');

const paymentTypeSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  ifscCode: String,
  remark: String
});

module.exports = mongoose.model('PaymentType', paymentTypeSchema);
