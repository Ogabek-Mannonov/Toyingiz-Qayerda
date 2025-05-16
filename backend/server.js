const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db'); // db.js faylini ulash



// .env faylidan yuklash
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6666; // Portni .env faylidan yoki default 6666 dan olish

// Middlewarelarni ulash
app.use(cors()); // CORS ni yoqish
app.use(bodyParser.json()); // JSON formatidagi so'rovlarni tahlil qilish

// Routerlarni import qilish
// Agar server ishga tushayotganda xato yuz bersa, routerlarni vaqtincha kommentariyaga oling
const authRoutes = require('./routes/auth');
const hallRoutes = require('./routes/halls');
const bookingRoutes = require('./routes/bookings');

// Routerlarni ulash
app.use('/api/auth', authRoutes); // /api/auth yo'nalishi uchun authRoutes ni ishlatish
app.use('/api/halls', hallRoutes); // /api/halls yo'nalishi uchun hallRoutes ni ishlatish
app.use('/api/bookings', bookingRoutes); // /api/bookings yo'nalishi uchun bookingRoutes ni ishlatish

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});
