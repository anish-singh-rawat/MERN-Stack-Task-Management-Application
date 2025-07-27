const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  role: String,
  action: String, // login/logout
  loginTime: Date,
  logoutTime: Date,
  ipAddress: String,
  tokenName: String,
}, { timestamps: true });

module.exports = mongoose.model('UserLog', UserLogSchema);
