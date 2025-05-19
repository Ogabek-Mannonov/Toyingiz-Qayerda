const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Faqat user roli uchun ruxsat
router.use(authMiddleware);
router.use(roleMiddleware(['user']));

// Tasdiqlangan to’yxonalarni olish
router.get('/venues', userController.getVenues);

// Yakka to’yxona ma’lumotlarini olish
router.get('/venues/:id', userController.getVenueById);

// Bron qilish
router.post('/bookings', userController.createBooking);

// O’z bronlarini ko’rish
router.get('/bookings', userController.getBookings);

// Bronni bekor qilish
router.patch('/bookings/:id/cancel', userController.cancelBooking);

module.exports = router;
