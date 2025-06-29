const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // adjust path if needed

// Paste your actual MongoDB Cloud URI here
const MONGO_URI = 'mongodb+srv://ankushpandit2003:xQc12LyDVNYhxlVV@cluster0.j51e9sl.mongodb.net/jagdamba?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🔗 Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hashedPassword });
  console.log('✅ Admin user created');
  mongoose.disconnect();
};

seedAdmin();
