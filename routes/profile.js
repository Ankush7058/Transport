const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ensureLogin = require('../middleware/auth');

// GET: Show Profile
router.get('/', ensureLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('profile/view', { user });
});

// POST: Update Profile
router.post('/update', ensureLogin, async (req, res) => {
  const { name, email, gst } = req.body;
  const userId = req.session.userId;

  await User.findByIdAndUpdate(userId, { name, email, gst });

  // ✅ Update session info
  req.session.userName = name;
  req.session.userEmail = email;

  res.redirect('/profile');
});

module.exports = router;
