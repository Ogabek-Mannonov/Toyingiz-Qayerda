const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const userRoutes = require('./routes/userRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewarelar
app.use(cors());

// Body parser o‘rniga express ichidagi parserlardan foydalanish uchun
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik papkani ulash — uploads papkasidagi fayllarga kirish uchun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routinglar
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});
