const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Faqat owner roli uchun ruxsat
router.use(authMiddleware);
router.use(roleMiddleware(['owner']));

// To’yxona yaratish (rassom multer bilan ishlatilsa, shunga qo’shing)
router.post('/venues', ownerController.createVenue);

// O’z to’yxonasini ko’rish
router.get('/venues', ownerController.getVenues);

// O’z to’yxonasini yangilash
router.put('/venues/:id', ownerController.updateVenue);

// O’z to’yxonasi bronlarini ko’rish
router.get('/bookings', ownerController.getBookings);

// O’z bronini bekor qilish
router.patch('/bookings/:id/cancel', ownerController.cancelBooking);

module.exports = router;
