// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // authController ni import qilish

// Registratsiya yo'nalishi (endpoint)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Boshqa autentifikatsiya bilan bog'liq yo'nalishlar (masalan, /login) shu yerga qo'shiladi

module.exports = router;
