const express = require('express');
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  getWorkspaceStats
} = require('../controllers/workspaceController');
const { protect, authorize } = require('../middlewares/auth');
const { workspaceValidationRules } = require('../validators/appValidator');
const { validate } = require('../validators/authValidator');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(workspaceValidationRules(), validate, createWorkspace)
  .get(getWorkspaces);

router.route('/:id')
  .get(getWorkspaceDetails)
  .put(authorize('owner', 'admin'), updateWorkspace)
  .delete(authorize('owner'), deleteWorkspace);

router.post('/:id/members', authorize('owner', 'admin'), addMember);
router.delete('/:id/members/:userId', authorize('owner', 'admin'), removeMember);
router.get('/:id/stats', getWorkspaceStats);

module.exports = router;
