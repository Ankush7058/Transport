const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const ensureLogin = require('../middleware/auth');
const PaymentType = require('../models/PaymentType');
// ✅ LIST with pagination and null destination
router.get('/destinations', ensureLogin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await Destination.countDocuments();
  const destinations = await Destination.find().skip(skip).limit(limit);

  res.render('master/destinations', {
    title: 'Destination Master',
    destinations,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    destination: null // ✅ required
  });
});

// ADD
router.post('/destinations', ensureLogin, async (req, res) => {
  const { destinationName, destinationCode } = req.body;
  await Destination.create({ destinationName, destinationCode });
  res.redirect('/master/destinations');
});

// DELETE
router.get('/destinations/delete/:id', ensureLogin, async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.redirect('/master/destinations');
});

// EDIT
router.get('/destinations/edit/:id', ensureLogin, async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await Destination.countDocuments();
  const destinations = await Destination.find().skip(skip).limit(limit);

  res.render('master/destinations', {
    title: 'Edit Destination',
    destination,
    destinations,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  });
});

// UPDATE
router.post('/destinations/update/:id', ensureLogin, async (req, res) => {
  const { destinationName, destinationCode } = req.body;
  await Destination.findByIdAndUpdate(req.params.id, { destinationName, destinationCode });
  res.redirect('/master/destinations');
});

// GET: Payment Types list
router.get('/payment-types', ensureLogin, async (req, res) => {
  const paymentTypes = await PaymentType.find();
  res.render('master/payment-types', { title: 'Payment Types', paymentTypes, paymentType: null });
});

// POST: Add new
router.post('/payment-types', ensureLogin, async (req, res) => {
  const { accountName, accountNumber, ifscCode, remark } = req.body;
  await PaymentType.create({ accountName, accountNumber, ifscCode, remark });
  res.redirect('/master/payment-types');
});

// GET: Edit
router.get('/payment-types/edit/:id', ensureLogin, async (req, res) => {
  const paymentType = await PaymentType.findById(req.params.id);
  const paymentTypes = await PaymentType.find();
  res.render('master/payment-types', { title: 'Edit Payment Type', paymentTypes, paymentType });
});

// POST: Update
router.post('/payment-types/update/:id', ensureLogin, async (req, res) => {
  const { accountName, accountNumber, ifscCode, remark } = req.body;
  await PaymentType.findByIdAndUpdate(req.params.id, { accountName, accountNumber, ifscCode, remark });
  res.redirect('/master/payment-types');
});

// GET: Delete
router.get('/payment-types/delete/:id', ensureLogin, async (req, res) => {
  await PaymentType.findByIdAndDelete(req.params.id);
  res.redirect('/master/payment-types');
});

module.exports = router;
