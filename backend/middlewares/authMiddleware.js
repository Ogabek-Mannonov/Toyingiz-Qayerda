const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer TOKEN' ko‘rinishida kelsa

  if (!token) {
    return res.status(401).json({ message: 'Token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id va role bor
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token noto‘g‘ri yoki muddati o‘tgan' });
  }
};

module.exports = authMiddleware;
