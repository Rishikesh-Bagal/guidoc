const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const routesV1 = require('./routes/v1');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint (root api level)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GUIDOC API is running'
  });
});

// API routes (versioned)
app.use('/api/v1', routesV1);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} in ${config.env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
