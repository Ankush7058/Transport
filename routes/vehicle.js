const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const ensureLogin = require('../middleware/auth');
const upload = require('../middleware/upload'); // multer config

const fs = require('fs');
const path = require('path');

// GET: List Vehicles
// GET: List with pagination
router.get('/list', ensureLogin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await Vehicle.countDocuments();
  const vehicles = await Vehicle.find().skip(skip).limit(limit);

  res.render('vehicle/form', {
    title: 'Vehicle Management',
    vehicle: null, // No edit; just add mode
    vehicles,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit
  });
});



// GET: Add Form
router.get('/add', ensureLogin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await Vehicle.countDocuments();
  const vehicles = await Vehicle.find().skip(skip).limit(limit);

  res.render('vehicle/form', {
    title: 'Add Vehicle',
    vehicle: null,
    vehicles,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit
  });
});


// POST: Add Vehicle
router.post('/add', ensureLogin, upload.fields([
  { name: 'insurance' }, { name: 'puc' }, { name: 'healthCard' }
]), async (req, res) => {
  const files = req.files;
  const vehicle = new Vehicle({
    ...req.body,
    documents: {
      insurance: files.insurance?.[0]?.filename || '',
      puc: files.puc?.[0]?.filename || '',
      healthCard: files.healthCard?.[0]?.filename || ''
    }
  });
  await vehicle.save();
  res.redirect('/vehicle/list');
});

// GET: Edit Form
router.get('/edit/:id', ensureLogin, async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const total = await Vehicle.countDocuments();
  const vehicles = await Vehicle.find().skip(skip).limit(limit);

  res.render('vehicle/form', {
    title: 'Edit Vehicle',
    vehicle,
    vehicles,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit
  });
});


// POST: Update Vehicle
router.post('/update/:id', ensureLogin, upload.fields([
  { name: 'insurance' }, { name: 'puc' }, { name: 'healthCard' }
]), async (req, res) => {
  const existing = await Vehicle.findById(req.params.id);
  const files = req.files;

  // Handle updated file paths only if new ones are uploaded
  const updatedDocs = { ...existing.documents };
  if (files.insurance) updatedDocs.insurance = files.insurance[0].filename;
  if (files.puc) updatedDocs.puc = files.puc[0].filename;
  if (files.healthCard) updatedDocs.healthCard = files.healthCard[0].filename;

  await Vehicle.findByIdAndUpdate(req.params.id, {
    ...req.body,
    documents: updatedDocs
  });

  res.redirect('/vehicle/list');
});

// GET: Delete Vehicle
router.get('/delete/:id', ensureLogin, async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (vehicle) {
    // Delete files if they exist
    const basePath = path.join(__dirname, '../public/uploads');
    ['insurance', 'puc', 'healthCard'].forEach(doc => {
      if (vehicle.documents[doc]) {
        const filePath = path.join(basePath, vehicle.documents[doc]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });
    await vehicle.deleteOne();
  }
  res.redirect('/vehicle/list');
});

module.exports = router;
