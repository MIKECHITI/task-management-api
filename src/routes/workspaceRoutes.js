const express = require('express');
const {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  addMember,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use(protect);

// Re-route nested task requests into taskRouter
router.use('/:workspaceId/tasks', taskRoutes);

router.route('/').get(getWorkspaces).post(createWorkspace);
router.route('/:id').get(getWorkspace);
router.route('/:id/members').post(addMember);

module.exports = router;
