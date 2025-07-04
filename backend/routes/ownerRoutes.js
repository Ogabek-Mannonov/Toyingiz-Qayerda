const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // multer middleware

// Faqat owner roli uchun ruxsat
router.use(authMiddleware);
router.use(roleMiddleware(['owner']));

// To’yxona yaratish — multer bilan fayllarni qabul qilish
router.post('/venues', upload.array('images', 5), ownerController.createVenue);

// O’z to’yxonalarini ko’rish
router.get('/venues', ownerController.getVenues);

// To’yxonani yangilash — multer bilan fayllarni qabul qilish
router.put('/venues/:id', upload.array('images', 5), ownerController.updateVenue);

// To’yxona bronlarini ko’rish
router.get('/bookings', ownerController.getBookings);

// Bronni bekor qilisha
router.patch('/bookings/:id/cancel', ownerController.cancelBooking);

router.get('/stats', ownerController.getStats);

router.delete('/venues/:id', authMiddleware, ownerController.deleteVenue);


router.get('/profile', authMiddleware, ownerController.getOwnerProfile);
router.put('/profile', authMiddleware, ownerController.updateOwnerProfile);

module.exports = router;
