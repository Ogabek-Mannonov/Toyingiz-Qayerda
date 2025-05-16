    // middleware/uploadMiddleware.js
    const multer = require('multer'); // multer kutubxonasini import qilish
    const path = require('path'); // Fayl yo'llari bilan ishlash uchun path modulini import qilish
    const fs = require('fs'); // Fayl tizimi bilan ishlash uchun fs modulini import qilish

    // Yuklangan fayllarni saqlash uchun papka yaratish
    const uploadDir = path.join(__dirname, '../uploads/halls'); // uploads/halls papkasiga saqlash
    // __dirname - hozirgi fayl (middleware) joylashgan papka
    // '../uploads/halls' - middleware papkasidan chiqib, uploads/halls papkasiga kirish

    // Agar papka mavjud bo'lmasa, uni yaratish
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Rekursiv yaratish, agar uploads ham bo'lmasa
    }

    // Fayllarni saqlash konfiguratsiyasi (diskStorage)
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Fayllarni yuqorida belgilangan papkaga saqlash
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            // Fayl nomini belgilash: original nom + hozirgi vaqt + fayl kengaytmasi
            // Bu nomlarning takrorlanmasligini ta'minlashga yordam beradi
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // Multer upload middleware ni yaratish
    // 'photos' - bu frontenddan fayllar yuborilayotganda ishlatiladigan maydon nomi (form-data key)
    // array(10) - bir so'rovda ko'pi bilan 10 ta fayl yuklashga ruxsat berish
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5 // Fayl hajmi limiti (masalan, 5MB)
        },
        fileFilter: (req, file, cb) => {
            // Fayl turini tekshirish (masalan, faqat rasmlarga ruxsat berish)
            const filetypes = /jpeg|jpg|png|gif/; // Ruxsat berilgan fayl kengaytmalari
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Kengaytmani tekshirish
            const mimetype = filetypes.test(file.mimetype); // MIME turini tekshirish

            if (mimetype && extname) {
                return cb(null, true); // Agar to'g'ri bo'lsa, faylni qabul qilish
            } else {
                cb('Error: Only Images!'); // Agar noto'g'ri bo'lsa, xato qaytarish
            }
        }
    }).array('photos', 10); // 'photos' maydonidan kelgan 10 tagacha faylni qabul qilish

    // Upload middleware ni eksport qilish
    module.exports = upload;
    