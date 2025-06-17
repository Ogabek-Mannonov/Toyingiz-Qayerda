const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// To’yxona va ownerni birga yaratish (fayl upload middleware alohida ishlaydi)
exports.createVenueWithOwner = async (req, res) => {
  try {
    // console.log(req.body);  // debugging uchun
    // console.log(req.files); // debugging uchun

    const {
      name,
      district_name,
      address,
      capacity,
      price_per_seat,
      phone_number,
      description,
      owner_first_name,
      owner_last_name,
      owner_username,
      owner_password,
      owner_phone_number,
    } = req.body;

    // district_id olish
    const districtResult = await pool.query(
      'SELECT district_id FROM districts WHERE LOWER(name) = LOWER($1)',
      [district_name]
    );

    if (districtResult.rows.length === 0) {
      return res.status(400).json({ error: 'Rayon topilmadi' });
    }
    const district_id = districtResult.rows[0].district_id;

    // Owner username tekshirish
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [owner_username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu username allaqachon mavjud' });
    }

    // Owner yaratish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(owner_password, salt);
    const ownerRole = 'owner';

    const ownerResult = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, username, password_hash, role, phone_number, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING user_id`,
      [owner_first_name, owner_last_name, owner_username, hashedPassword, ownerRole, owner_phone_number]
    );
    const owner_id = ownerResult.rows[0].user_id;

    // To’yxona yaratish
    const venueResult = await pool.query(
      `INSERT INTO wedding_halls 
       (name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8) RETURNING hall_id`,
      [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id]
    );
    const hall_id = venueResult.rows[0].hall_id;

    // Rasm fayllarini saqlash
    const files = req.files;
    if (files && files.length > 0) {
      const insertPromises = files.map(file => {
        const image_url = `/uploads/${file.filename}`;
        return pool.query(
          'INSERT INTO hall_photos (hall_id, image_url) VALUES ($1, $2)',
          [hall_id, image_url]
        );
      });
      await Promise.all(insertPromises);
    }

    res.status(201).json({ message: 'To’yxona va owner muvaffaqiyatli yaratildi', hall_id, owner_id });
  } catch (error) {
    console.error('Create Venue and Owner error:', error);
    res.status(500).json({ error: error.message || 'Server xatosi' });
  }
};

// To’yxonalar ro’yxatini olish (filter va sort bilan)
exports.getVenues = async (req, res) => {
  try {
    const { sortBy, order, search, status, district } = req.query;

    let baseQuery = `
      SELECT wh.*, d.name as district_name, u.first_name || ' ' || u.last_name as owner_name
      FROM wedding_halls wh
      JOIN districts d ON wh.district_id = d.district_id
      JOIN users u ON wh.owner_id = u.user_id
    `;

    let whereClauses = [];
    let params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      whereClauses.push(`(LOWER(wh.name) LIKE $${params.length} OR LOWER(d.name) LIKE $${params.length})`);
    }
    if (status) {
      params.push(status);
      whereClauses.push(`wh.status = $${params.length}`);
    }
    if (district) {
      params.push(district);
      whereClauses.push(`d.name = $${params.length}`);
    }

    const whereClause = whereClauses.length ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    let orderClause = ' ORDER BY wh.name ASC';
    if (sortBy) {
      const columns = {
        price_per_seat: 'wh.price_per_seat',
        capacity: 'wh.capacity',
        district: 'd.name',
        status: 'wh.status'
      };
      const col = columns[sortBy] || 'wh.name';
      const ord = order && order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      orderClause = ` ORDER BY ${col} ${ord}`;
    }

    const finalQuery = baseQuery + whereClause + orderClause;

    const result = await pool.query(finalQuery, params);

    res.json({ venues: result.rows });
  } catch (error) {
    console.error('Get Venues error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// To’yxonani tasdiqlash
exports.approveVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    const result = await pool.query(
      `UPDATE wedding_halls SET status = 'approved', updated_at = NOW() WHERE hall_id = $1 RETURNING *`,
      [venueId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi' });
    }
    res.json({ message: 'To’yxona tasdiqlandi', venue: result.rows[0] });
  } catch (error) {
    console.error('Approve Venue error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// To’yxonani tahrirlash uchun ma'lumot olish
exports.getVenueById = async (req, res) => {
  const venueId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT wh.*, d.district_id, d.name AS district_name, u.user_id AS owner_id, u.first_name || ' ' || u.last_name AS owner_name
       FROM wedding_halls wh
       JOIN districts d ON wh.district_id = d.district_id
       JOIN users u ON wh.owner_id = u.user_id
       WHERE wh.hall_id = $1`,
      [venueId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi" });
    }

    res.json({ venue: result.rows[0] });
  } catch (error) {
    console.error('Get Venue by ID error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// To'yxonani yangilash
const path = require('path');
const fs = require('fs');

exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      district_id,
      address,
      capacity,
      price_per_seat,
      phone_number,
      description,
      status,
      owner_id
    } = req.body;

    // Eski rasmlarni olish
    const oldImagesResult = await pool.query(
      'SELECT image_url FROM hall_photos WHERE hall_id = $1',
      [id]
    );
    const oldImages = oldImagesResult.rows;

    // Eski rasmlarni o‘chirish (agar yangi rasmlar kelsa)
    if (req.files && req.files.length > 0 && oldImages.length > 0) {
      for (const image of oldImages) {
        const filePath = path.join(__dirname, '..', image.image_url); // uploads/filename.jpg
        fs.unlink(filePath, err => {
          if (err) console.error('Rasm o‘chirishda xatolik:', err);
        });
      }

      // Eski rasm yozuvlarini bazadan o‘chirish
      await pool.query('DELETE FROM hall_photos WHERE hall_id = $1', [id]);
    }

    // Yangi rasm yozuvlarini bazaga qo‘shish
    if (req.files && req.files.length > 0) {
      const insertPromises = req.files.map(file => {
        const image_url = `/uploads/${file.filename}`;
        return pool.query(
          'INSERT INTO hall_photos (hall_id, image_url) VALUES ($1, $2)',
          [id, image_url]
        );
      });
      await Promise.all(insertPromises);
    }

    // wedding_halls jadvalini yangilash
    await pool.query(
      `UPDATE wedding_halls SET
        name = $1,
        district_id = $2,
        address = $3,
        capacity = $4,
        price_per_seat = $5,
        phone_number = $6,
        description = $7,
        status = $8,
        owner_id = $9,
        updated_at = NOW()
      WHERE hall_id = $10`,
      [
        name,
        district_id,
        address,
        capacity,
        price_per_seat,
        phone_number,
        description,
        status,
        owner_id,
        id
      ]
    );

    res.status(200).json({ message: "To'yxona yangilandi" });
  } catch (err) {
    console.error('Tahrirlashda xatolik:', err);
    res.status(500).json({ error: 'Server xatosi' });
  }
};



// To’yxonani o‘chirish
exports.deleteVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM wedding_halls WHERE hall_id = $1', [venueId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi' });
    }
    res.json({ message: 'To’yxona o‘chirildi' });
  } catch (error) {
    console.error('Delete Venue error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// To’yxona egalari ro’yxatini olish
exports.getOwners = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, first_name, last_name, username, phone_number, created_at FROM users WHERE role = 'owner' ORDER BY created_at DESC`
    );
    res.json({ owners: result.rows });
  } catch (error) {
    console.error('Get Owners error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Bronlarni olish
exports.getBookings = async (req, res) => {
  try {
    const { sortBy, order, status, venue } = req.query;

    let baseQuery = `
      SELECT b.booking_id, b.booking_date, b.number_of_guests, b.client_name, b.client_phone_number, b.status,
             wh.name as venue_name, u.first_name || ' ' || u.last_name as user_name
      FROM bookings b
      JOIN wedding_halls wh ON b.hall_id = wh.hall_id
      JOIN users u ON b.user_id = u.user_id
    `;

    let whereClauses = [];
    let params = [];

    if (status) {
      params.push(status);
      whereClauses.push(`b.status = $${params.length}`);
    }
    if (venue) {
      params.push(venue);
      whereClauses.push(`wh.name = $${params.length}`);
    }

    let whereClause = whereClauses.length ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    let orderClause = ' ORDER BY b.booking_date ASC';
    if (sortBy) {
      const columns = {
        booking_date: 'b.booking_date',
        venue: 'wh.name',
        status: 'b.status',
      };
      const col = columns[sortBy] || 'b.booking_date';
      const ord = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
      orderClause = ` ORDER BY ${col} ${ord}`;
    }

    const finalQuery = baseQuery + whereClause + orderClause;

    const result = await pool.query(finalQuery, params);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get Bookings error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Bronni bekor qilish
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE booking_id = $1 RETURNING *`,
      [bookingId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Bron topilmadi' });
    }
    res.json({ message: 'Bron bekor qilindi', booking: result.rows[0] });
  } catch (error) {
    console.error('Cancel Booking error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Rayonlar ro’yxatini olish
exports.getDistricts = async (req, res) => {
  try {
    const result = await pool.query('SELECT district_id, name FROM districts ORDER BY name');
    res.json({ districts: result.rows });
  } catch (error) {
    console.error('Get Districts error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// Dashboard statistikasi
exports.getDashboardStats = async (req, res) => {
  try {
    const totalVenuesRes = await pool.query('SELECT COUNT(*) FROM wedding_halls');
    const approvedVenuesRes = await pool.query("SELECT COUNT(*) FROM wedding_halls WHERE status = 'approved'");
    const pendingVenuesRes = await pool.query("SELECT COUNT(*) FROM wedding_halls WHERE status = 'pending'");
    const ownersCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'owner'");
    const upcomingBookingsRes = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'upcoming' AND booking_date >= CURRENT_DATE");
    const pastBookingsRes = await pool.query("SELECT COUNT(*) FROM bookings WHERE booking_date < CURRENT_DATE");

    res.json({
      totalVenues: parseInt(totalVenuesRes.rows[0].count),
      approvedVenues: parseInt(approvedVenuesRes.rows[0].count),
      pendingVenues: parseInt(pendingVenuesRes.rows[0].count),
      ownersCount: parseInt(ownersCountRes.rows[0].count),
      upcomingBookings: parseInt(upcomingBookingsRes.rows[0].count),
      pastBookings: parseInt(pastBookingsRes.rows[0].count),
    });
  } catch (error) {
    console.error('Dashboard Stats error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
};

// To’yxona bron kalendari uchun ma’lumotlar
exports.getVenueBookingsCalendar = async (req, res) => {
  try {
    const venueId = req.params.id;

    // To'yxona mavjudligini tekshirish va tasdiqlanganligini tekshirish
    const venueCheck = await pool.query(
      `SELECT * FROM wedding_halls WHERE hall_id = $1 AND status = 'approved'`,
      [venueId]
    );

    if (venueCheck.rowCount === 0) {
      return res.status(404).json({ message: "To'yxona topilmadi yoki tasdiqlanmagan" });
    }

    // To'yxona bo'yicha bronlarni olish
    const bookingsRes = await pool.query(
      `SELECT booking_date, status, number_of_guests, client_name, client_phone_number
       FROM bookings WHERE hall_id = $1 ORDER BY booking_date ASC`,
      [venueId]
    );

    res.json({ bookings: bookingsRes.rows });
  } catch (error) {
    console.error('Get Venue Bookings Calendar error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
};
