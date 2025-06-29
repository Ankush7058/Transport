const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String  // Hashed
});

module.exports = mongoose.model('User', userSchema);
