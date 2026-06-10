const { body, param } = require('express-validator');

const workspaceValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Workspace name is required'),
    body('description').optional().isString(),
  ];
};

const taskValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('Task title is required'),
    body('workspaceId').notEmpty().withMessage('Workspace ID is required').isMongoId().withMessage('Invalid Workspace ID'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ];
};

const updateTaskValidationRules = () => {
  return [
    body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ];
};

module.exports = {
  workspaceValidationRules,
  taskValidationRules,
  updateTaskValidationRules
};
