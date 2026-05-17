const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// Helper — check user is a workspace member
const isMember = (workspace, userId) =>
  workspace.owner.equals(userId) ||
  workspace.members.some((m) => m.user.equals(userId));

// @desc    Get all tasks in a workspace (with optional filters)
// @route   GET /api/workspaces/:workspaceId/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    if (!isMember(workspace, req.user._id))
      return res.status(403).json({ success: false, message: 'Not a workspace member' });

    const { status, priority, assignedTo } = req.query;
    const filter = { workspace: req.params.workspaceId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/workspaces/:workspaceId/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      workspace: req.params.workspaceId,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!isMember(workspace, req.user._id))
      return res.status(403).json({ success: false, message: 'Not a workspace member' });

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a task
// @route   POST /api/workspaces/:workspaceId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    if (!isMember(workspace, req.user._id))
      return res.status(403).json({ success: false, message: 'Not a workspace member' });

    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
      workspace: req.params.workspaceId,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task
// @route   PUT /api/workspaces/:workspaceId/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    if (!isMember(workspace, req.user._id))
      return res.status(403).json({ success: false, message: 'Not a workspace member' });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, workspace: req.params.workspaceId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/workspaces/:workspaceId/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    if (!isMember(workspace, req.user._id))
      return res.status(403).json({ success: false, message: 'Not a workspace member' });

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      workspace: req.params.workspaceId,
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
