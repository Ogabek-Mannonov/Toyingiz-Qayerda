const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/venues-with-owner', adminController.createVenueWithOwner);
router.get('/venues', adminController.getVenues);
router.patch('/venues/:id/approve', adminController.approveVenue);
router.put('/venues/:id', adminController.updateVenue);
router.delete('/venues/:id', adminController.deleteVenue);
router.get('/districts', adminController.getDistricts);


router.get('/owners', adminController.getOwners);

router.get('/bookings', adminController.getBookings);
router.patch('/bookings/:id/cancel', adminController.cancelBooking);

module.exports = router;
