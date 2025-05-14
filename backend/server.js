const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db')

// .env faylidan yuklash
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6666;

// Middlewarelarni ulash
app.use(cors())
app.use(bodyParser.json())

// Routerlarni import qilish
// const authRoutes = require('./routes/auth');
// const hallRoutes = require('./routes/halls');
// const bookingRoutes = require('./routes/bookings');

// Routerlarni ulash
// app.use('/api/auth', authRoutes);
// app.use('/api/halls', hallRoutes);
// app.use('/api/bookings', bookingRoutes);


app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});
