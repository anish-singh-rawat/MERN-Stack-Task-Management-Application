const express = require('express');
const { getUserLogs, deleteUserLog } = require('../controller/userLogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all user logs (admin only)
router.get('/logs', protect, adminOnly, getUserLogs);

// Delete log by id (admin only)
router.delete('/logs/:id', protect, adminOnly, deleteUserLog);

module.exports = router;
