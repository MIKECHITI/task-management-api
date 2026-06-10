const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logAction } = require('../services/auditService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || 'member' 
    });

    await logAction('USER_REGISTER', user._id, { email: user.email }, 'success', req);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      await logAction('USER_LOGIN_FAILED', null, { email }, 'failure', req);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await logAction('USER_LOGIN', user._id, { email: user.email }, 'success', req);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
