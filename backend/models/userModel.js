const pool = require('../config/db');
const bcrypt = require('bcryptjs'); 


// Yangi foydalanuvchi (User yoki Owner) yaratish funksiyasi
const createUser = async (userData) => {
  const { username, password, role, first_name, last_name, phone_number } = userData;
  try {
    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10); // Salt yaratish
    const password_hash = await bcrypt.hash(password, salt); // Parolni hash qilish

    // Ma'lumotlar bazasiga yangi foydalanuvchini qo'shish
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, role, first_name, last_name, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, username, role, first_name, last_name, phone_number, created_at`, // Yaratilgan foydalanuvchi ma'lumotlarini qaytarish
      [username, password_hash, role, first_name, last_name, phone_number] // Parametrlar massivi
    );

    // Yaratilgan foydalanuvchi ma'lumotlarini qaytarish
    return result.rows[0];
  } catch (err) {
    console.error('Foydalanuvchi yaratishda xato:', err);
    throw err; // Xatoni yuqoriga uzatish
  }
};

// Username orqali foydalanuvchini topish funksiyasi (login uchun kerak)
const findUserByUsername = async (username) => {
  try {
    // Ma'lumotlar bazasidan username bo'yicha foydalanuvchini qidirish
    const result = await pool.query(
      'SELECT user_id, username, password_hash, role, first_name, last_name, phone_number FROM users WHERE username = $1', // SQL SELECT buyrug'i
      [username] // Parametr massivi
    );

    // Agar foydalanuvchi topilsa, uning ma'lumotlarini qaytarish, aks holda undefined
    return result.rows[0];
  } catch (err) {
    console.error('Username bo\'yicha foydalanuvchini topishda xato:', err);
    throw err; // Xatoni yuqoriga uzatish
  }
};

// Parolni tekshirish funksiyasi
const comparePasswords = async (candidatePassword, passwordHash) => {
    try {
        // Berilgan parolni hashlangan parol bilan solishtirish
        const isMatch = await bcrypt.compare(candidatePassword, passwordHash);
        return isMatch;
    } catch (err) {
        console.error('Parollarni solishtirishda xato:', err);
        throw err; // Xatoni yuqoriga uzatish
    }
};

// User ID orqali foydalanuvchini topish funksiyasi
const findUserById = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, role, first_name, last_name, phone_number FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('ID bo\'yicha foydalanuvchini topishda xato:', err);
        throw err;
    }
};


// Boshqa kerakli foydalanuvchi funksiyalari (masalan, o'zgartirish, o'chirish) shu yerga qo'shilishi mumkin

// Funksiyalarni eksport qilish
module.exports = {
  createUser,
  findUserByUsername,
  comparePasswords,
  findUserById,
  // Boshqa funksiyalar
};
