const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const ensureLogin = require('../middleware/auth');

// GET: List with search & pagination
router.get('/list', ensureLogin, async (req, res) => {
  const { search = '' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { name: new RegExp(search, 'i') },
      { contact: new RegExp(search, 'i') }
    ]
  };

  const total = await Party.countDocuments(filter);
  const parties = await Party.find(filter).skip(skip).limit(limit);

  res.render('party/form', {
    title: 'Manage Parties',
    party: null,
    search,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    parties
  });
});


// GET: Add form
router.get('/add', ensureLogin, async (req, res) => {
  const { search = '' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { name: new RegExp(search, 'i') },
      { contact: new RegExp(search, 'i') }
    ]
  };

  const total = await Party.countDocuments(filter);
  const parties = await Party.find(filter).skip(skip).limit(limit);

  res.render('party/form', {
    title: 'Add Party',
    party: null,
    search,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    parties
  });
});


// POST: Add new
router.post('/add', ensureLogin, async (req, res) => {
  await Party.create(req.body);
  res.redirect('/party/list');
});

// GET: Edit form
router.get('/edit/:id', ensureLogin, async (req, res) => {
  const party = await Party.findById(req.params.id);

  const { search = '' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { name: new RegExp(search, 'i') },
      { contact: new RegExp(search, 'i') }
    ]
  };

  const total = await Party.countDocuments(filter);
  const parties = await Party.find(filter).skip(skip).limit(limit);

  res.render('party/form', {
    title: 'Edit Party',
    party,
    search,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    parties
  });
});


// POST: Update
router.post('/update/:id', ensureLogin, async (req, res) => {
  await Party.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/party/list');
});

// GET: Delete
router.get('/delete/:id', ensureLogin, async (req, res) => {
  await Party.findByIdAndDelete(req.params.id);
  res.redirect('/party/list');
});

module.exports = router;
