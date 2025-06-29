const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Party = require('../models/Party');
const Vehicle = require('../models/Vehicle');
const Destination = require('../models/Destination');
const ensureLogin = require('../middleware/auth');
const moment = require('moment');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const downloadDir = path.join(__dirname, 'public/downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Generate serial booking number
async function generateBookingNumber() {
  let count = await Booking.countDocuments();
  let bookingNumber;
  let exists = true;

  while (exists) {
    bookingNumber = `BK${String(count + 1).padStart(4, '0')}`;
    exists = await Booking.exists({ bookingNumber });
    if (exists) count++; // Try next number
  }

  return bookingNumber;
}
// Utility to wrap app.render in a promise
function renderViewToHTML(app, view, data) {
  return new Promise((resolve, reject) => {
    app.render(view, data, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
}
// ... all your existing require() code remains unchanged

// GET: Booking form
router.get('/add', ensureLogin, async (req, res) => {
  const parties = await Party.find();
  const vehicles = await Vehicle.find();
  const destinations = await Destination.find();
  const bookingNumber = await generateBookingNumber();

  res.render('booking/form', {
    title: 'Create Booking',
    booking: null,
    parties,
    vehicles,
    destinations,
    bookingNumber
  });
});

// POST: Create Booking
router.post('/add', ensureLogin, async (req, res) => {
  try {
    const bookingData = req.body;
    bookingData.bookingNumber = bookingData.bookingNumber || await generateBookingNumber();

    const newBooking = await Booking.create(bookingData);

    if (req.body.action === 'save_print') {
      const html = await renderViewToHTML(req.app, 'booking/print', {
        booking: await Booking.findById(newBooking._id).populate('party vehicle')
      });

  const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const pdfPath = path.join(__dirname, '../public/downloads', `${newBooking.bookingNumber}.pdf`);
      await page.pdf({ path: pdfPath, format: 'A4' });

      await browser.close();

      return res.redirect(`/booking/list?download=/downloads/${newBooking.bookingNumber}.pdf`);
    }

    res.redirect('/booking/list');
  } catch (err) {
    console.error("Booking creation error:", err);
    res.send('Error saving booking');
  }
});

// GET: Edit Booking
router.get('/edit/:id', ensureLogin, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  const parties = await Party.find();
  const vehicles = await Vehicle.find();
  const destinations = await Destination.find();

  res.render('booking/form', {
    title: 'Edit Booking',
    booking,
    parties,
    vehicles,
    destinations,
    bookingNumber: booking.bookingNumber
  });
});

// POST: Update Booking
router.post('/update/:id', ensureLogin, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, req.body);
    const updatedBooking = await Booking.findById(req.params.id);

    const parties = await Party.find();
    const vehicles = await Vehicle.find();
    const destinations = await Destination.find();

    res.render('booking/form', {
      title: 'Edit Booking',
      booking: updatedBooking,
      parties,
      vehicles,
      destinations,
      bookingNumber: updatedBooking.bookingNumber,
      successMessage: 'Booking updated successfully ✅'
    });
  } catch (err) {
    console.error('Booking update error:', err);
    res.status(500).send('Error updating booking');
  }
});

// GET: Delete Booking
router.get('/delete/:id', ensureLogin, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.redirect('/booking/list');
});

// ✅ GET: List Bookings with vehicleType filter
router.get('/list', ensureLogin, async (req, res) => {
  const { search = '', fromDate, toDate, vehicleType = '', page = 1 } = req.query;
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = {};
  if (vehicleType === 'IN' || vehicleType === 'OUT') {
    filter.vehicleType = vehicleType;
  }

  if (search) {
    filter.bookingNumber = new RegExp(search, 'i');
  }

  if (fromDate || toDate) {
    filter.bookingDate = {};
    if (fromDate) filter.bookingDate.$gte = moment(fromDate).startOf('day').toDate();
    if (toDate) filter.bookingDate.$lte = moment(toDate).endOf('day').toDate();
  }

  const total = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter)
    .populate('party vehicle')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.render('booking/list', {
    title: 'List Bookings',
    bookings,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    search,
    fromDate,
    toDate,
    vehicleType,
    limit,
    download: req.query.download
  });
});

// GET: Print Booking
router.get('/print/:id', ensureLogin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('party vehicle');
    if (!booking) return res.status(404).send('Booking not found');

    const html = await renderViewToHTML(req.app, 'booking/print', { booking });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${booking.bookingNumber}.pdf"`
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
