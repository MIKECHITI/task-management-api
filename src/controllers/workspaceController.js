const Workspace = require('../models/Workspace');

// @desc    Create workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });
    res.status(201).json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my workspaces
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    }).populate('owner', 'name email');
    res.json({ success: true, count: workspaces.length, workspaces });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single workspace
// @route   GET /api/workspaces/:id
// @access  Private
const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });

    const isMember =
      workspace.owner.equals(req.user._id) ||
      workspace.members.some((m) => m.user._id.equals(req.user._id));

    if (!isMember) return res.status(403).json({ success: false, message: 'Access denied' });

    res.json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

// @desc    Add member to workspace
// @route   POST /api/workspaces/:id/members
// @access  Private (owner only)
const addMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ success: false, message: 'Workspace not found' });
    if (!workspace.owner.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Only the owner can add members' });

    const { userId, role = 'member' } = req.body;
    const alreadyMember = workspace.members.some((m) => m.user.equals(userId));
    if (alreadyMember)
      return res.status(409).json({ success: false, message: 'User is already a member' });

    workspace.members.push({ user: userId, role });
    await workspace.save();

    res.json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

module.exports = { createWorkspace, getWorkspaces, getWorkspace, addMember };
