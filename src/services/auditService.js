const AuditLog = require('../models/AuditLog');

const logAction = async (action, userId, details = {}, status = 'success', req = null) => {
  try {
    const logData = {
      action,
      user: userId,
      details,
      status
    };

    if (req) {
      logData.ip = req.ip;
      logData.userAgent = req.get('user-agent');
    }

    await AuditLog.create(logData);
  } catch (error) {
    console.error('Audit Logging Error:', error);
  }
};

module.exports = { logAction };
