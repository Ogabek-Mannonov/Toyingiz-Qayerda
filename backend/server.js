const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/db');
const axios = require('axios'); // Telegram uchun kerak bo‘ladi

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewarelar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik fayllar uchun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routinglar
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/user', userRoutes);

// Telegramga xabar yuboruvchi endpoint (namuna)
app.post('/api/send-to-telegram', async (req, res) => {
  const { name, phone, email, message } = req.body;

  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const text = `📥 Mijozdan Xabar:\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n📧 *Email:* ${email}\n📝 Xabar: ${message}`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    res.status(200).json({ success: true, message: 'Telegramga yuborildi!' });
  } catch (error) {
    console.error('Telegramga yuborishda xatolik:', error.message);
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});
