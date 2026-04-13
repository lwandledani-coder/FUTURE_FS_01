const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact, contactLimiter } = require('../middleware/validation');

// Public routes
router.post('/submit', contactLimiter, validateContact, contactController.submitContact);

// Admin routes (for now, these are unprotected - add authentication in production)
router.get('/messages', contactController.getAllMessages);
router.get('/messages/:id', contactController.getMessage);
router.put('/messages/:id/status', contactController.updateMessageStatus);
router.delete('/messages/:id', contactController.deleteMessage);

module.exports = router;