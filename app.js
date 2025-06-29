const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');

const Notification = require('./models/Notification');

dotenv.config();
const app = express();
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout'); // since layout is now directly in views/

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.use(async (req, res, next) => {
  try {
    const recentNotifs = await Notification.find().sort({ createdAt: -1 }).limit(4);
    res.locals.recentNotifs = recentNotifs;
  } catch (err) {
    res.locals.recentNotifs = [];
  }
  next();
});

// Session Setup
// Session Setup
// Session middleware
app.use(session({
  secret: 'secret_admin_password',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Pass session globally to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ✅ Pass recent notifications to all views
app.use(async (req, res, next) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(4);
    res.locals.recentNotifs = notifs;
  } catch (err) {
    res.locals.recentNotifs = [];
  }
  next();
});

// MongoDB Cloud Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas Cloud'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);


const notificationRoutes = require('./routes/notification');
app.use('/notifications', notificationRoutes);

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/master', require('./routes/master'));
app.use('/party', require('./routes/party'));
app.use('/vehicle', require('./routes/vehicle'));
app.use('/booking', require('./routes/booking'));
// Start
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
