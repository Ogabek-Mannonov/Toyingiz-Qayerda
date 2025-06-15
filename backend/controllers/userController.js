const pool = require('../config/db');

// Barcha tasdiqlangan to’yxonalarni olish (search bilan)
exports.getVenues = async (req, res) => {
  try {
    const { search } = req.query;

    const result = await pool.query(`
      SELECT 
        wh.*, 
        d.name AS district_name, 
        COALESCE(json_agg(hp.image_url) FILTER (WHERE hp.hall_id IS NOT NULL), '[]') AS photos
      FROM wedding_halls wh
      JOIN districts d ON wh.district_id = d.district_id
      LEFT JOIN hall_photos hp ON wh.hall_id = hp.hall_id
      WHERE wh.status = 'approved'
      ${search ? `AND (LOWER(wh.name) LIKE $1 OR LOWER(d.name) LIKE $1)` : ''}
      GROUP BY wh.hall_id, d.name
      ORDER BY wh.name ASC
    `, search ? [`%${search.toLowerCase()}%`] : []);

    res.json({ venues: result.rows });
  } catch (error) {
    console.error('Get Venues error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
// Yakka to’yxonani ID bo’yicha olish
exports.getVenueById = async (req, res) => {
  try {
    const venueId = req.params.id;

    const venueQuery = await pool.query(
      `SELECT 
         wh.*, 
         d.name AS district_name,
         COALESCE(
           json_agg(hp.image_url) FILTER (WHERE hp.hall_id IS NOT NULL), 
           '[]'
         ) AS photos
       FROM wedding_halls wh
       JOIN districts d ON wh.district_id = d.district_id
       LEFT JOIN hall_photos hp ON wh.hall_id = hp.hall_id
       WHERE wh.hall_id = $1 AND wh.status = 'approved'
       GROUP BY wh.hall_id, d.name`,
      [venueId]
    );

    if (venueQuery.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi' });
    }

    res.json({ venue: venueQuery.rows[0] });

  } catch (error) {
    console.error('Get Venue By ID error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};


// Yakka to’yxonaning barcha bronlarini olish
exports.getVenueBookings = async (req, res) => {
  try {
    const venueId = req.params.id;

    const venueCheck = await pool.query(
      `SELECT * FROM wedding_halls WHERE hall_id = $1 AND status = 'approved'`,
      [venueId]
    );

    if (venueCheck.rowCount === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi yoki tasdiqlanmagan" });
    }

    const bookingsRes = await pool.query(
      `SELECT booking_date, status, number_of_guests, client_name, client_phone_number 
       FROM bookings WHERE hall_id = $1 ORDER BY booking_date ASC`,
      [venueId]
    );

    res.json({ bookings: bookingsRes.rows });
  } catch (error) {
    console.error('Get Venue Bookings error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
};

// Bron yaratish (login qilingan foydalanuvchi uchun)
exports.createBooking = async (req, res) => {
  try {
    const { hall_id, booking_date, number_of_guests, client_name, client_phone_number } = req.body;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Avval tizimga kiring' });
    }

    // 1. To'yxonani sig'imini va statusini olish
    const venueResult = await pool.query(
      'SELECT capacity FROM wedding_halls WHERE hall_id = $1 AND status = $2',
      [hall_id, 'approved']
    );

    if (venueResult.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi yoki tasdiqlanmagan' });
    }

    const capacity = venueResult.rows[0].capacity;

    // 2. Ushbu kunga allaqachon bron qilingan odamlar sonini olish
    const existingGuestsResult = await pool.query(
      `SELECT COALESCE(SUM(number_of_guests), 0) AS total_guests 
       FROM bookings 
       WHERE hall_id = $1 AND booking_date = $2 AND status != 'cancelled'`,
      [hall_id, booking_date]
    );

    const totalGuestsBooked = parseInt(existingGuestsResult.rows[0].total_guests, 10);
    const requestedGuests = parseInt(number_of_guests, 10);

    if (totalGuestsBooked + requestedGuests > capacity) {
      return res.status(400).json({ message: `Bu to'yxonaning sig'imi ${capacity} kishiga mo'ljallangan` });
    }

    // 3. Bron yaratish
    const result = await pool.query(
      `INSERT INTO bookings (hall_id, user_id, booking_date, number_of_guests, client_name, client_phone_number, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'upcoming', NOW(), NOW())
       RETURNING *`,
      [hall_id, user_id, booking_date, number_of_guests, client_name, client_phone_number]
    );

    res.status(201).json({ booking: result.rows[0] });

  } catch (error) {
    console.error('Create Booking error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Foydalanuvchining o‘z bronlarini ko‘rish
exports.getBookings = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Avval tizimga kiring' });
    }

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
    console.error('Get User Bookings error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Bronni bekor qilish (faqat o‘z bronini bekor qilishi mumkin)
exports.cancelBooking = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const bookingId = req.params.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Avval tizimga kiring' });
    }

    // Bron o‘zi uchun ekanligini tekshirish
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
    console.error('Cancel Booking error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Avval tizimga kiring' });
    }

    const result = await pool.query(
      `SELECT first_name, last_name, username, phone_number FROM users WHERE user_id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get Profile error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, username, phone_number } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Avval tizimga kiring' });
    }

    const updateQuery = `
      UPDATE users
      SET first_name = $1,
          last_name = $2,
          username = $3,
          phone_number = $4,
          updated_at = NOW()
      WHERE user_id = $5
      RETURNING first_name, last_name, username, phone_number
    `;

    const result = await pool.query(updateQuery, [first_name, last_name, username, phone_number, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Update Profile error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};
