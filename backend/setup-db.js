const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

const createTables = async () => {
  try {
    console.log("Ma'lumotlar bazasiga ulanilmoqda...");

    // 1. users jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        username VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20) UNIQUE,
        role VARCHAR(50) DEFAULT 'user',
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ users jadvali tayyor');

    // 2. wedding_halls jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wedding_halls (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        capacity INTEGER,
        description TEXT,
        price_per_person NUMERIC(10,2),
        region VARCHAR(100),
        district VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        address TEXT,
        main_image TEXT,
        longitude NUMERIC(10,6),
        latitude NUMERIC(10,6),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ wedding_halls jadvali tayyor');

    // 3. hall_photos jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hall_photos (
        id SERIAL PRIMARY KEY,
        hall_id INTEGER REFERENCES wedding_halls(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ hall_photos jadvali tayyor');

    // 4. bookings jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        hall_id INTEGER REFERENCES wedding_halls(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        booking_date DATE NOT NULL,
        number_of_guests INTEGER,
        client_name VARCHAR(255),
        client_phone_number VARCHAR(20),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ bookings jadvali tayyor');

    // 5. Admin yaratish (agar yo'q bo'lsa)
    const bcrypt = require('bcryptjs');
    const adminCheck = await pool.query('SELECT * FROM users WHERE phone_number = $1', ['+998901234567']);
    if (adminCheck.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (first_name, last_name, username, phone_number, role, password_hash) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Asosiy', 'Admin', 'admin', '+998901234567', 'admin', hash]
      );
      console.log('✅ Default admin tayyor! (Tel: +998901234567, Parol: admin123)');
    }

    console.log('🎉 Barcha jadvallar muvaffaqiyatli yaratildi!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik yuz berdi:', error);
    process.exit(1);
  }
};

createTables();
