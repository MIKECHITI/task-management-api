const Workspace = require('../models/Workspace');
const Task = require('../models/Task');
const { logAction } = require('../services/auditService');

const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }]
    });

    await logAction('WORKSPACE_CREATE', req.user.id, { workspaceId: workspace._id }, 'success', req);
    res.status(201).json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('owner', 'name email');
    res.json({ success: true, count: workspaces.length, workspaces });
  } catch (err) {
    next(err);
  }
};

const getWorkspaceDetails = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    res.json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only owner can delete workspace' });
    }

    await Workspace.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ workspaceId: req.params.id });
    
    await logAction('WORKSPACE_DELETE', req.user.id, { workspaceId: req.params.id }, 'success', req);
    res.json({ success: true, message: 'Workspace and associated tasks deleted' });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const isAlreadyMember = workspace.members.find(m => m.user.toString() === userId);
    if (isAlreadyMember) {
      return res.status(400).json({ success: false, message: 'User already a member' });
    }

    workspace.members.push({ user: userId, role: role || 'member' });
    await workspace.save();

    await logAction('MEMBER_ADD', req.user.id, { workspaceId: workspace._id, addedUser: userId }, 'success', req);
    res.json({ success: true, workspace });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    workspace.members = workspace.members.filter(m => m.user.toString() !== req.params.userId);
    await workspace.save();

    await logAction('MEMBER_REMOVE', req.user.id, { workspaceId: workspace._id, removedUser: req.params.userId }, 'success', req);
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (err) {
    next(err);
  }
};

const getWorkspaceStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { workspaceId: new (require('mongoose').Types.ObjectId)(req.params.id) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { workspaceId: new (require('mongoose').Types.ObjectId)(req.params.id) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        priorityStats: priorityStats
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  getWorkspaceStats
};
