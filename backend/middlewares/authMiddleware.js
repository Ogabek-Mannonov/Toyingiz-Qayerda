// middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); // jsonwebtoken kutubxonasini import qilish
const dotenv = require('dotenv'); // .env faylidan o'qish uchun dotenv ni import qilish

dotenv.config(); // .env faylini yuklash (agar server.js da yuklanmagan bo'lsa, bu yerda ham yuklash xavfsizlik uchun yaxshi)

// JWT tokenini tekshiradigan middleware
const protect = (req, res, next) => {
  let token;

  // So'rov sarlavhalaridan (headers) tokenni olish
  // Odatda token "Authorization: Bearer TOKEN_STRING" formatida keladi
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer" qismini olib tashlab, tokenning o'zini olish
      token = req.headers.authorization.split(' ')[1];

      // Tokenni tekshirish (verify)
      // process.env.JWT_SECRET - .env faylidagi maxfiy kalit
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token ichidan foydalanuvchi ma'lumotlarini (ID, role) req.user ga qo'shish
      // Bu ma'lumotlar keyinchalik kontrollerlarda foydalaniladi
      req.user = decoded.user;

      // Keyingi middleware yoki route handler ga o'tish
      next();

    } catch (error) {
      console.error('Token xato:', error);
      res.status(401).json({ message: 'Not authorized, token failed' }); // Token noto'g'ri bo'lsa
    }
  }

  // Agar token umuman yuborilmagan bo'lsa
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' }); // Token mavjud emas
  }
};

// Foydalanuvchi admin ekanligini tekshiradigan middleware
const admin = (req, res, next) => {
  // protect middleware ishga tushgan bo'lsa, req.user mavjud bo'ladi
  // Foydalanuvchi mavjud bo'lsa va uning roli 'admin' bo'lsa
  if (req.user && req.user.role === 'admin') {
    next(); // Keyingi middleware yoki route handler ga o'tish
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // Admin ruxsati yo'q
  }
};

// Middleware funksiyalarini eksport qilish
module.exports = { protect, admin };
