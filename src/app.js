const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { setupSecurity, apiLimiter } = require('./middlewares/security');
const errorHandler = require('./middlewares/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// Security configuration
setupSecurity(app);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// Swagger Documentation
const { swaggerUi, specs } = require('./docs/swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/workspaces', apiLimiter, require('./routes/workspaceRoutes'));
app.use('/api/tasks', apiLimiter, require('./routes/taskRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
