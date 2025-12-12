const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // <--- Import Auth Middleware

// Import getHelpers along with register and login
const { 
  registerUser, 
  loginUser, 
  getHelpers,
  updateUserProfile // <--- Import the new function
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/helpers', getHelpers); // <--- New Route for getting helpers

// NEW ROUTE: Update Profile (Protected)
router.put('/profile', protect, updateUserProfile);

module.exports = router;