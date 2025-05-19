// controllers/userController.js
const pool = require('../config/db');

exports.getVenues = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM wedding_halls WHERE status = 'approved' ORDER BY name ASC`
    );
    res.json({ venues: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venueId = req.params.id;

    const venue = await pool.query(
      `SELECT * FROM wedding_halls WHERE hall_id = $1 AND status = 'approved'`,
      [venueId]
    );

    if (venue.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi' });
    }

    // Kalendardagi bronlar va bo‘sh kunlarni qo‘shish kerak (keyin qo‘shimcha qilamiz)
    res.json({ venue: venue.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { hall_id, booking_date, number_of_guests, client_name, client_phone_number } = req.body;
    const user_id = req.user.id;

    // Bron sanasi band emasligini tekshirish
    const check = await pool.query(
      `SELECT * FROM bookings WHERE hall_id = $1 AND booking_date = $2`,
      [hall_id, booking_date]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ message: 'Bu kunga allaqachon bron mavjud' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (hall_id, user_id, booking_date, number_of_guests, client_name, client_phone_number, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'upcoming', NOW(), NOW())
       RETURNING *`,
      [hall_id, user_id, booking_date, number_of_guests, client_name, client_phone_number]
    );

    res.status(201).json({ booking: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT b.*, wh.name AS venue_name
       FROM bookings b
       JOIN wedding_halls wh ON b.hall_id = wh.hall_id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC`,
      [user_id]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookingId = req.params.id;

    // Bron foydalanuvchiga tegishli ekanini tekshirish
    const check = await pool.query(
      `SELECT booking_id FROM bookings WHERE booking_id = $1 AND user_id = $2`,
      [bookingId, user_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: 'Bron topilmadi yoki ruxsat yo‘q' });
    }

    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE booking_id = $1 RETURNING *`,
      [bookingId]
    );

    res.json({ message: 'Bron bekor qilindi', booking: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
