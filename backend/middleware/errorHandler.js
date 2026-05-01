const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.message);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired, please log in again' });
  }

  // SQL unique constraint violation
  if (err.number === 2627 || err.number === 2601) {
    return res.status(409).json({ success: false, message: 'A record with that value already exists' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;