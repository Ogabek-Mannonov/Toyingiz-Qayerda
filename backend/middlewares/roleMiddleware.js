// middleware/roleMiddleware.js

// Ruxsat beriladigan rollar ro'yxatini qabul qiladi va keyingi middleware ga o'tkazadi
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // req.user.token tekshiruvdan o'tgan (authMiddleware orqali) deb taxmin qilamiz
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Foydalanuvchi roli aniqlanmadi' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Sizda ushbu amalni bajarishga ruxsat yo‘q' });
    }

    next();
  };
};

module.exports = roleMiddleware;
