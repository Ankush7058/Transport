const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Notification = require('../models/Notification');

// GET: Login Page
// GET: Login Page
router.get('/', (req, res) => {
  res.render('login', { layout: false }); // disables layout for login.ejs
});
// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Logout error:', err);
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    // ✅ Set session data
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    // ✅ Create login notification
    await Notification.create({
      message: `${user.name} logged in successfully.`,
      type: 'info'
    });

    res.redirect('/dashboard');
  } else {
    res.send('<script>alert("Invalid credentials!"); window.location.href="/";</script>');
  }
});


module.exports = router;
