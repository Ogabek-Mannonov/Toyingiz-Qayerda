    // models/hallModel.js
    const pool = require('../config/db'); // Import the database connection pool

    // Function to create a new wedding hall in the database (oldingi koddan o'zgarishsiz)
    const createHallInDB = async (hallData) => {
        const { name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id, status } = hallData;
        try {
            const result = await pool.query(
                `INSERT INTO wedding_halls (name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING hall_id, name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id, created_at`,
                [name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id, status]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error creating hall in database:', err);
            throw err;
        }
    };

    // Function to get a hall by its ID from the database (Rasmlarni olish qo'shildi)
    const getHallByIdFromDB = async (hallId) => {
        try {
            // Get hall details
            const hallResult = await pool.query(
                'SELECT hall_id, name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id, created_at FROM wedding_halls WHERE hall_id = $1',
                [hallId]
            );

            const hall = hallResult.rows[0];

            if (!hall) {
                return undefined; // Return undefined if hall not found
            }

            // Get hall photos
            const photosResult = await pool.query(
                'SELECT photo_id, image_url FROM hall_photos WHERE hall_id = $1 ORDER BY uploaded_at ASC',
                [hallId]
            );

            const photos = photosResult.rows;

            // Return hall object with photos array
            return { ...hall, photos }; // Hall obyektiga rasmlar massivini qo'shib qaytarish

        } catch (err) {
            console.error('Error getting hall by ID from database:', err);
            throw err;
        }
    };

    // Function to get all halls from the database (Rasmlarni olish qo'shilmadi, chunki bu ko'p so'rov talab qiladi)
    const getAllHallsFromDB = async () => {
        try {
            const result = await pool.query(
                'SELECT hall_id, name, district_id, address, capacity, price_per_seat, phone_number, description, status, owner_id, created_at FROM wedding_halls'
                // Agar har bir zal uchun bitta rasmni ko'rsatish kerak bo'lsa, JOIN yoki alohida so'rovlar kerak bo'ladi
            );
            return result.rows;
        } catch (err) {
            console.error('Error getting all halls from database:', err);
            throw err;
        }
    };

    // Function to add photo URLs to the hall_photos table
    const addHallPhotosToDB = async (hallId, photoUrls) => {
        // Agar rasm yo'llari massivi bo'sh bo'lsa, hech narsa qilmaslik
        if (!photoUrls || photoUrls.length === 0) {
            return;
        }

        // INSERT buyrug'i uchun qiymatlar massivini tayyorlash
        // Har bir rasm uchun (hall_id, image_url) juftligini yaratamiz
        const values = photoUrls.map(url => `(${hallId}, '${url}')`).join(',');

        try {
            // SQL INSERT buyrug'i (ko'p qatorni birdan qo'shish)
            const queryText = `INSERT INTO hall_photos (hall_id, image_url) VALUES ${values} RETURNING photo_id, image_url`;
            const result = await pool.query(queryText);

            return result.rows; // Yaratilgan rasm yozuvlarini qaytarish
        } catch (err) {
            console.error('Error adding hall photos to database:', err);
            throw err; // Xatoni yuqoriga uzatish
        }
    };

    // Function to get photos for a specific hall (alohida funksiya)
    const getHallPhotosFromDB = async (hallId) => {
        try {
            const result = await pool.query(
                'SELECT photo_id, image_url FROM hall_photos WHERE hall_id = $1 ORDER BY uploaded_at ASC',
                [hallId]
            );
            return result.rows;
        } catch (err) {
            console.error('Error getting hall photos from database:', err);
            throw err;
        }
    };


    // Other necessary hall functions (e.g., update, delete) will be added here

    // Export the functions
    module.exports = {
      createHallInDB,
      getHallByIdFromDB,
      getAllHallsFromDB,
      addHallPhotosToDB, // Export the new function
      getHallPhotosFromDB, // Export the new function
      // Other functions
    };
    