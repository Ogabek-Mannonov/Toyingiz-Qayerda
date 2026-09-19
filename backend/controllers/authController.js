const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const { first_name, last_name, username, password, phone_number } = req.body;

  if (!first_name || !username || !password || !phone_number) {
    return res.status(400).json({ success: false, error: "Barcha majburiy maydonlarni to'ldiring!" });
  }

  try {
    // Username borligini tekshirish
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu username allaqachon mavjud' });
    }

    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Role default user
    const role = req.body.role || 'user';

    // Foydalanuvchini yaratish
    const newUser = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, username, password_hash, role, phone_number, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING user_id, username, role, first_name, last_name, phone_number`,
      [first_name, last_name, username, hashedPassword, role, phone_number]
    );

    // Token yaratish
    const user = newUser.rows[0];
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username va parol kiritilishi shart!" });
  }

  try {

    // Agar username bilan qidirish kerak bo‘lsa:
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, error: "Foydalanuvchi topilmadi yoki parol noto'g'ri" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Foydalanuvchi topilmadi yoki parol noto'g'ri" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userData = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
    };

    res.json({ success: true, token, user: userData });
  } catch (error) {
    next(error);
  }
};
