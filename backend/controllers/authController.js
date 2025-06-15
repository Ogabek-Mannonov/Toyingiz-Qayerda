const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { first_name, last_name, username, password, phone_number } = req.body;

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

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;  // Yoki agar siz email ishlatsangiz: const { email, password } = req.body;

  try {

    // Agar username bilan qidirish kerak bo‘lsa:
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Foydalanuvchi topilmadi' });  // Bu yerda ham email emas, username so‘zini ishlating
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Parol noto‘g‘ri' });
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

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
};
