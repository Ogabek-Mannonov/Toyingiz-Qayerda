const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Serverda ichki xatolik yuz berdi';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
