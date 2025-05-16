    // routes/halls.js
    const express = require('express');
    const router = express.Router();
    const hallController = require('../controllers/hallController'); // Import the hallController
    const { protect, admin } = require('../middleware/authMiddleware'); // Import the auth middleware
    const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware

    // Admin: Add a new wedding hall (only for admins)
    // Client must send request as multipart/form-data with file field named 'photos'
    // Applies protect, admin, and upload middleware
    router.post('/', protect, admin, upload, hallController.createHall); // upload middleware ni qo'shdik

    // Admin: Get all wedding halls (Admin 7)
    router.get('/', protect, admin, hallController.getAllHalls);

    // Admin: Get a single wedding hall by ID (Admin 8)
    router.get('/:id', protect, admin, hallController.getHallById);


    // Other hall-related routes will be added here
    // For example, update, delete (these will also be for admins)
    // router.put('/:id', protect, admin, hallController.updateHall);
    // router.delete('/:id', protect, admin, hallController.deleteHall);


    module.exports = router;
    