const userModel = require('../models/userModel'); 
const jwt = require('jsonwebtoken'); 


const register = async (req, res) => {
  const { username, password, role, first_name, last_name, phone_number } = req.body;

  if (!username || !password || !role || !first_name || !last_name) {
    return res.status(400).json({ message: 'Kerakli maydonlar to\'ldirilmagan.' });
  }

  try {
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Bu username band. Boshqa username tanlang.' });
    }

    const newUser = await userModel.createUser({
        username,
        password,
        role,
        first_name,
        last_name,
        phone_number
    });

    res.status(201).json({
        message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
        user: {
            user_id: newUser.user_id,
            username: newUser.username,
            role: newUser.role,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            phone_number: newUser.phone_number,
            created_at: newUser.created_at
        }
    });

  } catch (error) {
    console.error('Registratsiya jarayonida xato:', error);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' });
  }
};


const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username va parol kiritilishi shart.' });
    }

    try {
        const user = await userModel.findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Username yoki parol noto\'g\'ri.' });
        }

        const isMatch = await userModel.comparePasswords(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Username yoki parol noto\'g\'ri.' });
        }

        const payload = {
            user: {
                id: user.user_id,
                role: user.role 
            }
        };

        // Tokenni yaratish. process.env.JWT_SECRET - .env faylidagi maxfiy kalit
        // expiresIn - tokenning amal qilish muddati (masalan, 1 soat)
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token 1 soatdan keyin amal qilishni to'xtatadi
            (err, token) => {
                if (err) throw err;
                
                res.status(200).json({
                    message: 'Muvaffaqiyatli tizimga kirildi',
                    token, // Mijozga token yuborish
                    user: { // Foydalanuvchi ma'lumotlarini ham yuborish (parolsiz)
                        user_id: user.user_id,
                        username: user.username,
                        role: user.role,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        phone_number: user.phone_number
                    }
                });
            }
        );

    } catch (error) {
        console.error('Login jarayonida xato:', error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' });
    }
};

// Boshqa kontroller funksiyalari (getUser, getAllUsers) shu yerga qo'shiladi
// Agar oldingi funksiyalarni saqlab qolgan bo'lsangiz, ularni ham shu faylga qo'shishingiz kerak

// Funksiyalarni eksport qilish
module.exports = {
  register,
  login,
  // getUser,
  // getAllUsers,
};
