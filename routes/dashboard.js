const express = require('express');
const router = express.Router();
const ensureLogin = require('../middleware/auth'); // import

router.get('/', ensureLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Admin Dashboard'
  });
});

module.exports = router;
