const express = require('express');
const documentController = require('../../controllers/document.controller');
const { verifyToken, verifyAdmin } = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/search', documentController.searchDocuments);
router.get('/:slug', documentController.getDocumentBySlug);
router.get('/', documentController.getDocuments);

// Admin routes
router.get('/admin/all', verifyToken, verifyAdmin, documentController.getAdminDocuments);
router.post('/', verifyToken, verifyAdmin, documentController.createDocument);
router.put('/:id', verifyToken, verifyAdmin, documentController.updateDocument);
router.delete('/:id', verifyToken, verifyAdmin, documentController.deleteDocument);

module.exports = router;
