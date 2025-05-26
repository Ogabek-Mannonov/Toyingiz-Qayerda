const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : {
    rejectUnauthorized: false 
  }
});

pool.connect()
  .then(() => console.log('PostgreSQLga muvaffaqiyatli ulanildi (db.js dan)'))
  .catch(err => console.error('PostgreSQLga ulanishda xatolik (db.js dan):', err));

module.exports = pool;