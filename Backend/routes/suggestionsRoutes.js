const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { 
  verifyTokenAndPermissions,
  createSuggestion

} = require('../controllers/suggestionsController');

// Create new suggestion
router.post('/', 
  verifyTokenAndPermissions, 
  upload.array('images', 8), 
  createSuggestion
);







module.exports = router;