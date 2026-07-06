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
 * Get all documents (including inactive) for admin
 * GET /api/v1/documents/admin/all
 */
const getAdminDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.q;

    let result;
    if (keyword) {
      result = await documentService.searchDocuments(keyword, { page, limit, includeInactive: true });
    } else {
      result = await documentService.getDocuments({ page, limit, includeInactive: true });
    }

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

/**
 * Create a document
 * POST /api/v1/documents
 */
const createDocument = async (req, res, next) => {
  try {
    const document = await documentService.createDocument(req.body);
    res.status(201).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a document
 * PUT /api/v1/documents/:id
 */
const updateDocument = async (req, res, next) => {
  try {
    const document = await documentService.updateDocument(req.params.id, req.body);
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
 * Delete a document
 * DELETE /api/v1/documents/:id
 */
const deleteDocument = async (req, res, next) => {
  try {
    const document = await documentService.deleteDocument(req.params.id);
    if (!document) {
      res.status(404);
      throw new Error('Document not found');
    }
    res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getDocuments,
  getAdminDocuments,
  getDocumentBySlug,
  searchDocuments,
  createDocument,
  updateDocument,
  deleteDocument
};
