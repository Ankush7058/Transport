const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const ensureLogin = require('../middleware/auth');

// Show all notifications
router.get('/', ensureLogin, async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.render('master/notifications', { notifications });
});
module.exports = router;
