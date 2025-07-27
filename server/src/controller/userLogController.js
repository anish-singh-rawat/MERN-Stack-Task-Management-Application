const UserLog = require('../models/UserLog');
const jwt = require('jsonwebtoken');

// Save user log (login/logout)
const saveUserLog = async ({ userId, username, role, action, tokenName, ipAddress }) => {
  const log = new UserLog({
    userId,
    username,
    role,
    action,
    loginTime: action === 'login' ? new Date() : undefined,
    logoutTime: action === 'logout' ? new Date() : undefined,
    ipAddress,
    tokenName,
  });
  await log.save();
};

// Get all logs
const getUserLogs = async (req, res) => {
  try {
    const logs = await UserLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

// Delete log by id
const deleteUserLog = async (req, res) => {
  try {
    const { id } = req.params;
    await UserLog.findByIdAndDelete(id);
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete log' });
  }
};

module.exports = { saveUserLog, getUserLogs, deleteUserLog };
