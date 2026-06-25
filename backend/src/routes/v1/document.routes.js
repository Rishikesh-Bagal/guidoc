const express = require('express');
const documentController = require('../../controllers/document.controller');

const router = express.Router();

router.get('/search', documentController.searchDocuments);
router.get('/:slug', documentController.getDocumentBySlug);
router.get('/', documentController.getDocuments);

module.exports = router;
