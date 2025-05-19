// controllers/ownerController.js
const pool = require('../config/db');

exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      district_id,
      address,
      capacity,
      price_per_seat,
      phone_number,
      description
    } = req.body;

    const owner_id = req.user.id; // authMiddleware orqali

    const result = await pool.query(
      `INSERT INTO wedding_halls 
       (name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8) RETURNING *`,
      [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id]
    );

    res.status(201).json({ venue: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.getVenues = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM wedding_halls WHERE owner_id = $1 ORDER BY created_at DESC`,
      [owner_id]
    );

    res.json({ venues: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const venueId = req.params.id;
    const {
      name,
      district_id,
      address,
      capacity,
      price_per_seat,
      phone_number,
      description
    } = req.body;

    // Faqat o‘z to’yxonasini o‘zgartira oladi
    const result = await pool.query(
      `UPDATE wedding_halls SET
       name=$1, district_id=$2, address=$3, capacity=$4, price_per_seat=$5, phone_number=$6, description=$7, updated_at=NOW()
       WHERE hall_id=$8 AND owner_id=$9 RETURNING *`,
      [name, district_id, address, capacity, price_per_seat, phone_number, description, venueId, owner_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi yoki ruxsat yo‘q' });
    }

    res.json({ venue: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const result = await pool.query(
      `SELECT b.*, wh.name AS venue_name
       FROM bookings b
       JOIN wedding_halls wh ON b.hall_id = wh.hall_id
       WHERE wh.owner_id = $1
       ORDER BY b.booking_date DESC`,
      [owner_id]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const bookingId = req.params.id;

    // Bron o‘ziga tegishli to’yxonaga tegishli ekanini tekshirish
    const check = await pool.query(
      `SELECT b.booking_id
       FROM bookings b
       JOIN wedding_halls wh ON b.hall_id = wh.hall_id
       WHERE b.booking_id = $1 AND wh.owner_id = $2`,
      [bookingId, owner_id]
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
