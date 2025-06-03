const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// To’yxonalarni ko’rish — bu public route, auth kerak emas
router.get('/venues', userController.getVenues);

// Quyidagi route’lar uchun autentifikatsiya talab qilinadi
router.use(authMiddleware);

// Yakka to’yxona ma’lumotlari va bronlar kalendari (agar kerak bo‘lsa authsiz ham qilinishi mumkin)
router.get('/venues/:id', userController.getVenueById);
router.get('/venues/:id/bookings', userController.getVenueBookings);

// Bron qilish
router.post('/bookings', userController.createBooking);

// O’z bronlarini ko’rish
router.get('/bookings', userController.getBookings);

// Bronni bekor qilish
router.patch('/bookings/:id/cancel', userController.cancelBooking);


router.get('/profile', authMiddleware, userController.getProfile);


router.put('/profile', authMiddleware, userController.updateProfile);


module.exports = router;
