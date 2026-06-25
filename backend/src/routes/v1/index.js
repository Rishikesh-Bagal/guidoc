const express = require('express');
const healthRoutes = require('./health.routes');
const documentRoutes = require('./document.routes');

const router = express.Router();

// API v1 routes
router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);

module.exports = router;
