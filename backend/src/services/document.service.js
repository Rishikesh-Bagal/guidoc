const Document = require('../models/Document');

/**
 * Get all active documents with pagination and sorting
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @returns {Promise<Object>}
 */
const getDocuments = async ({ page = 1, limit = 10 }) => {
  const query = { isActive: true };
  const skip = (page - 1) * limit;

  const [documents, totalDocuments] = await Promise.all([
    Document.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Document.countDocuments(query)
  ]);

  return {
    documents,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments
  };
};

/**
 * Get a single active document by slug
 * @param {string} slug 
 * @returns {Promise<Object>}
 */
const getDocumentBySlug = async (slug) => {
  const document = await Document.findOne({ slug, isActive: true }).lean();
  return document;
};

/**
 * Search active documents using text index
 * @param {string} keyword 
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @returns {Promise<Object>}
 */
const searchDocuments = async (keyword, { page = 1, limit = 10 }) => {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedKeyword, 'i');
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: regex } },
      { category: { $regex: regex } },
      { description: { $regex: regex } }
    ]
  };
  const skip = (page - 1) * limit;

  const [documents, totalDocuments] = await Promise.all([
    Document.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Document.countDocuments(query)
  ]);

  return {
    documents,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments
  };
};

module.exports = {
  getDocuments,
  getDocumentBySlug,
  searchDocuments
};
