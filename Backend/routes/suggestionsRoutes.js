const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { 
  verifyTokenAndPermissions,
  createSuggestion,
  getAdminSuggestions,
  getSuggestions,
  updateSuggestionStatus,
  deleteSuggestion
} = require('../controllers/suggestionsController');

// Create new suggestion
router.post('/', 
  verifyTokenAndPermissions, 
  upload.array('images', 5), 
  createSuggestion
);

// Get all suggestions (for admin)
router.get('/admin', 
  verifyTokenAndPermissions, 
  getAdminSuggestions
);

// Get all suggestions
router.get('/', getSuggestions);

// Update suggestion status
router.patch('/:id/status', 
  verifyTokenAndPermissions, 
  updateSuggestionStatus
);

// Delete suggestion
router.delete('/:id', 
  verifyTokenAndPermissions, 
  deleteSuggestion
);



module.exports = router;