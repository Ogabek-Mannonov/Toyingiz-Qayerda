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

    // Multer orqali yuklangan fayllar
    const photos = req.files; // array bo‘lib keladi

    // Agar kerak bo‘lsa, photos dan fayl nomlarini olish
    const photoPaths = photos ? photos.map(file => `/uploads/${file.filename}`) : [];

    // SQL so‘rovda photoPaths ni JSON sifatida saqlash uchun o‘zgartiring
    // Faraz qilaylik, wedding_halls jadvalida photos jsonb tipi uchun maydon bor (uni yarating agar yo‘q bo‘lsa)
    
    const result = await pool.query(
      `INSERT INTO wedding_halls 
       (name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id, photos) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9) RETURNING *`,
      [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id, JSON.stringify(photoPaths)]
    );

    res.status(201).json({ venue: result.rows[0] });
  } catch (error) {
    console.error('createVenue error:', error);
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

    const photos = req.files;
    const photoPaths = photos ? photos.map(file => `/uploads/${file.filename}`) : null;

    // Agar photoPaths bo‘lsa, photos maydonini yangilaymiz, aks holda eski saqlanadi
    let queryText = `
      UPDATE wedding_halls SET
      name=$1, district_id=$2, address=$3, capacity=$4, price_per_seat=$5,
      phone_number=$6, description=$7, updated_at=NOW()
      WHERE hall_id=$8 AND owner_id=$9 RETURNING *`;

    let queryParams = [name, district_id, address, capacity, price_per_seat, phone_number, description, venueId, owner_id];

    if (photoPaths && photoPaths.length > 0) {
      queryText = `
        UPDATE wedding_halls SET
        name=$1, district_id=$2, address=$3, capacity=$4, price_per_seat=$5,
        phone_number=$6, description=$7, photos=$10, updated_at=NOW()
        WHERE hall_id=$8 AND owner_id=$9 RETURNING *`;

      queryParams = [name, district_id, address, capacity, price_per_seat, phone_number, description, venueId, owner_id, JSON.stringify(photoPaths)];
    }

    const result = await pool.query(queryText, queryParams);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi yoki ruxsat yo‘q' });
    }

    res.json({ venue: result.rows[0] });
  } catch (error) {
    console.error('updateVenue error:', error);
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

exports.getStats = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const totalVenuesResult = await pool.query(
      `SELECT COUNT(*) FROM wedding_halls WHERE owner_id = $1`,
      [owner_id]
    );

    const upcomingBookingsResult = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE hall_id IN (SELECT hall_id FROM wedding_halls WHERE owner_id = $1)
       AND booking_date > CURRENT_DATE`,
      [owner_id]
    );

    const todayBookingsResult = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE hall_id IN (SELECT hall_id FROM wedding_halls WHERE owner_id = $1)
       AND booking_date = CURRENT_DATE`,
      [owner_id]
    );

    const cancelledBookingsResult = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE hall_id IN (SELECT hall_id FROM wedding_halls WHERE owner_id = $1)
       AND status = 'cancelled'`,
      [owner_id]
    );

    res.json({
      totalVenues: parseInt(totalVenuesResult.rows[0].count),
      upcomingBookings: parseInt(upcomingBookingsResult.rows[0].count),
      todayBookings: parseInt(todayBookingsResult.rows[0].count),
      cancelledBookings: parseInt(cancelledBookingsResult.rows[0].count),
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ error: 'Statistikani olishda xatolik yuz berdi' });
  }
};


// DELETE /api/owner/venues/:id
exports.deleteVenue = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const venueId = req.params.id;

    // To‘yxona egasiga tegishli ekanligini tekshirish
    const check = await pool.query(
      `SELECT * FROM wedding_halls WHERE hall_id = $1 AND owner_id = $2`,
      [venueId, owner_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi yoki ruxsat yo'q" });
    }

    await pool.query(`DELETE FROM wedding_halls WHERE hall_id = $1 AND owner_id = $2`, [
      venueId,
      owner_id,
    ]);

    res.json({ message: "To'yxona o'chirildi" });
  } catch (error) {
    console.error("deleteVenue error:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

