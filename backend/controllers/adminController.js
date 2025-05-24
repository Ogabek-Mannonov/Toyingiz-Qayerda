const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const upload = require('../middlewares/uploadMiddleware');

// To’yxona yaratish va rasm yuklash
exports.createVenue = [
  upload.array('images', 5), // maksimal 5 ta rasm yuklash
  async (req, res) => {
    try {
      const {
        name,
        district_id,
        address,
        capacity,
        price_per_seat,
        phone_number,
        description,
        owner_id
      } = req.body;

      const venueResult = await pool.query(
        `INSERT INTO wedding_halls 
          (name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8) 
         RETURNING hall_id`,
        [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id]
      );

      const hall_id = venueResult.rows[0].hall_id;

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

      res.status(201).json({ message: 'To’yxona va rasm(lar) muvaffaqiyatli qo‘shildi', hall_id });
    } catch (error) {
      console.error('Create Venue error:', error);
      res.status(500).json({ error: 'Server xatosi' });
    }
  }
];

// Owner yaratish (faqat admin uchun)
exports.createOwner = async (req, res) => {
  try {
    const { first_name, last_name, username, password, phone_number } = req.body;

    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = 'owner';

    const result = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, username, password_hash, role, phone_number, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
       RETURNING user_id, username, role, first_name, last_name, phone_number`,
      [first_name, last_name, username, hashedPassword, role, phone_number]
    );

    res.status(201).json({ message: 'Owner yaratildi', owner: result.rows[0] });
  } catch (error) {
    console.error('Create Owner error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

// To’yxonalar ro’yxatini olish (filter va sort bilan)
exports.getVenues = async (req, res) => {
  try {
    const { sortBy, order, search } = req.query;

    let baseQuery = `
      SELECT wh.*, d.name as district_name, u.first_name || ' ' || u.last_name as owner_name
      FROM wedding_halls wh
      JOIN districts d ON wh.district_id = d.district_id
      JOIN users u ON wh.owner_id = u.user_id
    `;

    let whereClause = '';
    let params = [];
    if (search) {
      whereClause = ` WHERE LOWER(wh.name) LIKE $1 OR LOWER(d.name) LIKE $1`;
      params.push(`%${search.toLowerCase()}%`);
    }

    let orderClause = '';
    if (sortBy) {
      const columns = {
        price_per_seat: 'wh.price_per_seat',
        capacity: 'wh.capacity',
        district: 'd.name',
        status: 'wh.status'
      };
      const col = columns[sortBy] || 'wh.name';
      const ord = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
      orderClause = ` ORDER BY ${col} ${ord}`;
    } else {
      orderClause = ' ORDER BY wh.name ASC';
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

// To’yxonani tahrirlash
exports.updateVenue = async (req, res) => {
  const venueId = req.params.id;
  const {
    name,
    district_id,
    address,
    capacity,
    price_per_seat,
    phone_number,
    description,
    owner_id,
    status
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE wedding_halls SET 
        name=$1, district_id=$2, address=$3, capacity=$4, price_per_seat=$5, phone_number=$6, description=$7, owner_id=$8, status=$9, updated_at=NOW()
       WHERE hall_id=$10 RETURNING *`,
      [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id, status, venueId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'To’yxona topilmadi' });
    }

    res.json({ venue: result.rows[0] });
  } catch (error) {
    console.error('Update Venue error:', error);
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
    const { sortBy, order, status } = req.query;

    let baseQuery = `
      SELECT b.booking_id, b.booking_date, b.number_of_guests, b.client_name, b.client_phone_number, b.status,
             wh.name as venue_name, u.first_name || ' ' || u.last_name as user_name
      FROM bookings b
      JOIN wedding_halls wh ON b.hall_id = wh.hall_id
      JOIN users u ON b.user_id = u.user_id
    `;

    let whereClause = '';
    let params = [];
    if (status) {
      whereClause = ` WHERE b.status = $1`;
      params.push(status);
    }

    let orderClause = '';
    if (sortBy) {
      const columns = {
        booking_date: 'b.booking_date',
        venue: 'wh.name',
        status: 'b.status',
      };
      const col = columns[sortBy] || 'b.booking_date';
      const ord = (order && order.toLowerCase() === 'desc') ? 'DESC' : 'ASC';
      orderClause = ` ORDER BY ${col} ${ord}`;
    } else {
      orderClause = ' ORDER BY b.booking_date ASC';
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
