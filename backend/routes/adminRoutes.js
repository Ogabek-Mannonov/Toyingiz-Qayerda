const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const authMiddleware = require('../middlewares/authMiddleware'); // Token tekshirish middleware
const upload = require('../middlewares/uploadMiddleware');

// Yangi to’yxona va owner yaratish (rasm yuklash middleware bilan birga)
router.post('/venues-with-owner', authMiddleware, upload.array('images'), adminController.createVenueWithOwner);
router.post('/venues-with-owner', adminController.createVenueWithOwner);
router.get('/venues', adminController.getVenues);
router.patch('/venues/:id/approve', adminController.approveVenue);
router.put('/venues/:id', adminController.updateVenue);
router.delete('/venues/:id', adminController.deleteVenue);
router.get('/districts', adminController.getDistricts);
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/venues/:id', adminController.getVenueById); 


router.get('/owners', adminController.getOwners);

router.get('/bookings', adminController.getBookings);
router.patch('/bookings/:id/cancel', adminController.cancelBooking);
router.get('/venues/:id/bookings-calendar', adminController.getVenueBookingsCalendar);

module.exports = router;
