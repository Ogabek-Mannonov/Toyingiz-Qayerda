const dotenv = require('dotenv');
dotenv.config(); // Har doim yuqorida bo'lishi kerak

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Ulana olishni test qilish
pool.connect()
  .then(() => {
    console.log('✅ PostgreSQLga muvaffaqiyatli ulanildi (localhost)');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL ulanishida xatolik (localhost):', err);
  });

module.exports = pool;
