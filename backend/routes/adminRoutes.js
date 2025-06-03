const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware'); // Token tekshirish middleware
const upload = require('../middlewares/uploadMiddleware');

// Yangi to’yxona va owner yaratish (rasm yuklash middleware bilan birga)
router.post('/venues-with-owner', authMiddleware, upload.array('images'), adminController.createVenueWithOwner);

// To’yxonalar ro’yxati
router.get('/venues', authMiddleware, adminController.getVenues);

// To’yxonani tasdiqlash
router.patch('/venues/:id/approve', authMiddleware, adminController.approveVenue);

// To’yxonani tahrirlash
router.put('/venues/:id', authMiddleware, adminController.updateVenue);

// To’yxonani o‘chirish
router.delete('/venues/:id', authMiddleware, adminController.deleteVenue);

// Rayonlar ro’yxati
router.get('/districts', authMiddleware, adminController.getDistricts);

// Dashboard statistikasi
router.get('/dashboard-stats', authMiddleware, adminController.getDashboardStats);

// To’yxona egalari ro’yxati
router.get('/owners', authMiddleware, adminController.getOwners);

// Bronlar ro’yxati
router.get('/bookings', authMiddleware, adminController.getBookings);

// Bronni bekor qilish
router.patch('/bookings/:id/cancel', authMiddleware, adminController.cancelBooking);

// To’yxona bron kalendari uchun ma’lumotlar
router.get('/venues/:id/bookings-calendar', authMiddleware, adminController.getVenueBookingsCalendar);

// adminRoutes.js
router.get('/venues/:id', adminController.getVenueById);
module.exports = router;
