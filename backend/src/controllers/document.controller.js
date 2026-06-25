const documentService = require('../services/document.service');

/**
 * Get all active documents
 * GET /api/v1/documents
 */
const getDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await documentService.getDocuments({ page, limit });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single document by slug
 * GET /api/v1/documents/:slug
 */
const getDocumentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const document = await documentService.getDocumentBySlug(slug);

    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }

    res.status(200).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search documents
 * GET /api/v1/documents/search
 */
const searchDocuments = async (req, res, next) => {
  try {
    const { q: keyword } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (!keyword) {
      res.status(400);
      throw new Error('Search keyword (q) is required');
    }

    const result = await documentService.searchDocuments(keyword, { page, limit });

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  getDocumentBySlug,
  searchDocuments
};
