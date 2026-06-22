const config = require('../config/env');

// Handle not found routes
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    status: 'error',
    message: err.message,
    // Only show stack trace in development
    stack: config.env === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
