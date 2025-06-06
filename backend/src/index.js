require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const logger = require('./config/logger');
const { auth, requireRole, requirePermission } = require('./middleware/auth');
require('./models');

// Import controllers
const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const adminController = require('./controllers/adminController');

const app = express();

// Security middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://fyp-research-hub.netlify.app'  // Production frontend URL
    : 'http://localhost:3000',                // Development frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// File upload directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Response Formatting Middleware
app.use((req, res, next) => {
  // Add success response method
  res.success = (data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  // Add error response method
  res.error = (message = 'Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };

  next();
});

// Routes
// Auth routes
app.post('/api/register', userController.register);
app.post('/api/login', userController.login);
app.post('/api/forgot-password', userController.forgotPassword);
app.post('/api/reset-password', userController.resetPassword);

// User routes
app.get('/api/profile', auth, userController.getProfile);
app.put('/api/profile', auth, userController.updateProfile);

// Project routes
app.post('/api/projects/submit/step1', projectController.submitStep1);
app.post('/api/projects/submit/step2', projectController.submitStep2);
app.post('/api/projects/submit/step3', auth, projectController.submitStep3);
app.get('/api/projects', projectController.browseProjects);
app.get('/api/projects/:id', projectController.getProject);
app.get('/api/projects/:id/download', projectController.downloadProject);
app.post('/api/projects/:id/like', auth, projectController.likeProject);

// Admin routes
app.get('/api/admin/dashboard-stats', auth, requireRole(['admin']), adminController.getDashboardStats);

// User management
app.get('/api/admin/users', auth, requirePermission('manage_users'), adminController.listUsers);
app.get('/api/admin/users/:id', auth, requirePermission('manage_users'), adminController.getUser);
app.put('/api/admin/users/:id', auth, requirePermission('manage_users'), adminController.updateUser);
app.delete('/api/admin/users/:id', auth, requirePermission('manage_users'), adminController.deleteUser);

// Project management
app.get('/api/admin/projects', auth, requirePermission('review_projects'), adminController.listProjects);
app.get('/api/admin/projects/:id', auth, requirePermission('review_projects'), adminController.getProject);
app.put('/api/admin/projects/:id', auth, requirePermission('review_projects'), adminController.updateProject);
app.delete('/api/admin/projects/:id', auth, requirePermission('review_projects'), adminController.deleteProject);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.error('Validation Error', 400, err.errors);
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.error('Unauthorized', 401);
  }
  
  if (err.name === 'ForbiddenError') {
    return res.error('Forbidden', 403);
  }
  
  // Default error
  res.error('Internal Server Error', 500);
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync database models
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized.');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`CORS Origin: ${corsOptions.origin}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer(); 