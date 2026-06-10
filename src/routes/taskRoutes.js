const express = require('express');
const {
  createTask,
  getTasks,
  getTaskDetails,
  updateTask,
  deleteTask,
  patchTaskStatus,
  patchTaskAssign
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const { taskValidationRules, updateTaskValidationRules } = require('../validators/appValidator');
const { validate } = require('../validators/authValidator');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(taskValidationRules(), validate, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskDetails)
  .put(updateTaskValidationRules(), validate, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', patchTaskStatus);
router.patch('/:id/assign', patchTaskAssign);

module.exports = router;
