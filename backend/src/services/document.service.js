const Document = require('../models/Document');

/**
 * Get all documents with pagination and sorting
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {boolean} options.includeInactive
 * @returns {Promise<Object>}
 */
const getDocuments = async ({ page = 1, limit = 10, includeInactive = false }) => {
  const query = includeInactive ? {} : { isActive: true };
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
const searchDocuments = async (keyword, { page = 1, limit = 10, includeInactive = false }) => {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedKeyword, 'i');
  const query = {
    $or: [
      { name: { $regex: regex } },
      { category: { $regex: regex } },
      { description: { $regex: regex } }
    ]
  };
  if (!includeInactive) {
    query.isActive = true;
  }
  
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
 * Create a new document
 */
const createDocument = async (data) => {
  const document = new Document(data);
  return await document.save();
};

/**
 * Update an existing document
 */
const updateDocument = async (id, data) => {
  return await Document.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

/**
 * Delete a document
 */
const deleteDocument = async (id) => {
  return await Document.findByIdAndDelete(id);
};

module.exports = {
  getDocuments,
  getDocumentBySlug,
  searchDocuments,
  createDocument,
  updateDocument,
  deleteDocument
};
