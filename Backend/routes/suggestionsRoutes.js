const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
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