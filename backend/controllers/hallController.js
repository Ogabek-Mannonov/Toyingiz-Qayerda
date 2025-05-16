    // controllers/hallController.js
    const hallModel = require('../models/hallModel'); // Import the hallModel
    const fs = require('fs'); // Fayl tizimi bilan ishlash uchun fs modulini import qilish
    const path = require('path'); // Fayl yo'llari bilan ishlash uchun path modulini import qilish

    // Admin: Function to create a new wedding hall
    const createHall = async (req, res) => {
        // Get hall data from the request body
        // Note: When using multer for file uploads, req.body will only contain text fields
        const { name, district_id, address, capacity, price_per_seat, phone_number, description, owner_id } = req.body;

        // Get uploaded files from req.files (if using .array() or .any())
        // req.files will be an array of file objects
        const files = req.files;

        // Validation (required text fields)
        if (!name || !district_id || !address || !capacity || !price_per_seat || !phone_number || !owner_id) {
             // Agar kerakli maydonlar to'ldirilmagan bo'lsa, yuklangan fayllarni o'chirib yuborish
            if (files && files.length > 0) {
                files.forEach(file => {
                    fs.unlink(file.path, (err) => { // Yuklangan faylni o'chirish
                        if (err) console.error('Error deleting uploaded file:', err);
                    });
                });
            }
            return res.status(400).json({ message: 'Kerakli maydonlar to\'ldirilmagan.' });
        }

        // Validation (check if at least one file is uploaded)
        if (!files || files.length === 0) {
             return res.status(400).json({ message: 'Kamida bitta rasm yuklanishi shart.' });
        }

        try {
            // Ma'lumotlarni hallModel ga yuborib, yangi zal yaratish
            const newHall = await hallModel.createHallInDB({
                name,
                district_id,
                address,
                capacity,
                price_per_seat,
                phone_number,
                description,
                owner_id,
                status: 'approved' // Admin adds, status is approved
            });

            // Yaratilgan zalning ID sini olish
            const hallId = newHall.hall_id;

            // Yuklangan fayllarning yo'llarini (paths) olish
            const photoPaths = files.map(file => {
                // Lokal saqlash uchun fayl yo'lini qaytaramiz
                // Real loyihada bu yerda bulutli saqlashga yuklab, URL ni olish kerak
                return file.path; // Masalan: uploads\halls\photos-1678888888888.jpeg
            });

            // Rasmlarning yo'llarini ma'lumotlar bazasiga saqlash
            // Bu funksiyani hallModel da yaratamiz
            await hallModel.addHallPhotosToDB(hallId, photoPaths);


            // Muvaffaqiyatli javob qaytarish
            res.status(201).json({
                message: 'To\'yxona va rasmlar muvaffaqiyatli qo\'shildi',
                hall: newHall,
                photos: photoPaths // Qaytgan javobga rasmlar yo'llarini ham qo'shish mumkin
            });

        } catch (error) {
            console.error('To\'yxona yaratishda xato:', error);

            // Xato yuz bersa, yuklangan fayllarni o'chirib yuborish
            if (files && files.length > 0) {
                files.forEach(file => {
                    fs.unlink(file.path, (err) => { // Yuklangan faylni o'chirish
                        if (err) console.error('Error deleting uploaded file after error:', err);
                    });
                });
            }

            res.status(500).json({ message: 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' });
        }
    };

    // Function to get a hall by ID (oldingi koddan o'zgarishsiz)
    const getHallById = async (req, res) => {
        const hallId = req.params.id;

        if (!hallId || isNaN(hallId)) {
            return res.status(400).json({ message: 'Noto\'g\'ri zal ID si.' });
        }

        try {
            const hall = await hallModel.getHallByIdFromDB(hallId);

            if (!hall) {
                return res.status(404).json({ message: 'Zal topilmadi.' });
            }

            // Zal rasmlarini ham olish (agar kerak bo'lsa)
            const photos = await hallModel.getHallPhotosFromDB(hallId); // Bu funksiyani hallModel da yaratamiz

            // Zal ma'lumotlari va rasmlarini qaytarish
            res.status(200).json({ hall, photos });

        } catch (error) {
            console.error('Zal ma\'lumotlarini olishda xato:', error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' });
        }
    };

    // Function to get all halls (oldingi koddan o'zgarishsiz)
    const getAllHalls = async (req, res) => {
        try {
            const halls = await hallModel.getAllHallsFromDB();

            // Har bir zal uchun rasmlarni ham olish mumkin, lekin bu ko'p so'rov talab qiladi
            // Yoki faqat birinchi rasmni olish mumkin
            // Hozircha rasmlarsiz qaytaramiz

            res.status(200).json({ halls });

        } catch (error) {
            console.error('Error getting all halls:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    };


    // Other controller functions will be added here
    // For example: updateHall, deleteHall, filterHalls, searchHalls

    // Export the functions
    module.exports = {
      createHall,
      getHallById,
      getAllHalls,
      // Other functions
    };
    