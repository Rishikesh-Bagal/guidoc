const express = require('express');
const healthRoutes = require('./health.routes');
const documentRoutes = require('./document.routes');
const aiRoutes = require('./ai.routes');
const eligibilityRoutes = require('./eligibility.routes');

const router = express.Router();

// API v1 routes
router.use('/health', healthRoutes);
router.use('/documents', documentRoutes);
router.use('/ai', aiRoutes);
router.use('/eligibility', eligibilityRoutes);

module.exports = router;
