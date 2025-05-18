const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { firstname, lastname, username, password, role, phone_number } = req.body;

  try {
    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Foydalanuvchini bazaga yozish, created_at va updated_at bazada avtomatik to'ldiriladi
    const newUser = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, username, password_hash, role, phone_number) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING user_id, username, role, first_name, last_name, phone_number, created_at, updated_at`,
      [firstname, lastname, username, hashedPassword, role, phone_number]
    );

    // Token yaratish
    const token = jwt.sign(
      { id: newUser.rows[0].user_id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Foydalanuvchini topish
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const user = userResult.rows[0];

    // Parolni solishtirish
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Parol noto‘g‘ri' });
    }

    // Token yaratish
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
