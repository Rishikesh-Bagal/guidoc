const eligibilityService = require('../services/eligibility.service');

const checkEligibility = async (req, res, next) => {
  try {
    const { document, answers } = req.body;

    if (!document) {
      return res.status(400).json({
        success: false,
        error: 'Document type is required'
      });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Answers object is required'
      });
    }

    const result = await eligibilityService.evaluateEligibility(document, answers);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message.includes('are not defined')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  checkEligibility
};
