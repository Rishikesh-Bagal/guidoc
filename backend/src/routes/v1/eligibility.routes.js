const express = require('express');
const eligibilityController = require('../../controllers/eligibility.controller');

const router = express.Router();

router.post('/', eligibilityController.checkEligibility);

module.exports = router;
