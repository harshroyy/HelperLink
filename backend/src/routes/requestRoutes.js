const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const protect = require('../middleware/auth'); // Import the Security Guard

// POST /api/requests
// Uses 'protect' because you must be logged in to ask for help
router.post('/', protect, requestController.createRequest);

// GET /api/requests/my-requests
// Uses 'protect' because you must be logged in to view your requests
router.get('/my-requests', protect, requestController.getMyRequests);

// PUT /api/requests/:id/accept
// Uses 'protect' because you must be logged in to accept
router.put('/:id/accept', protect, requestController.acceptRequest);

// PUT /api/requests/:id/decline
// Uses 'protect' because you must be logged in to decline
router.put('/:id/decline', protect, requestController.declineRequest);

// DELETE /api/requests/:id
// Uses 'protect' because you must be logged in to delete
router.delete('/:id', protect, requestController.deleteRequest);

module.exports = router;