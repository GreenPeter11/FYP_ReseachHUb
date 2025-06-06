const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const User = require('../models/User');
const Project = require('../models/Project');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalUsers,
      totalDownloads,
      pendingSubmissions
    ] = await Promise.all([
      Project.count(),
      User.count(),
      Project.sum('downloads_count'),
      Project.count({ where: { status: 'pending' } })
    ]);

    res.json({
      total_projects: totalProjects,
      total_users: totalUsers,
      total_downloads: totalDownloads || 0,
      pending_submissions: pendingSubmissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// List all users
exports.listUsers = async (req, res) => {
  try {
    const {
      search,
      role,
      is_active,
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { student_id: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      total_pages: Math.ceil(count / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      full_name,
      email,
      student_id,
      school,
      department,
      role,
      is_active,
      admin_permissions
    } = req.body;

    // Update user fields
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (student_id) user.student_id = student_id;
    if (school) user.school = school;
    if (department) user.department = department;
    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;
    if (admin_permissions) user.admin_permissions = admin_permissions;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// List all projects (admin view)
exports.listProjects = async (req, res) => {
  try {
    const {
      search,
      status,
      discipline,
      year,
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { short_description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;
    if (discipline) where.discipline = discipline;
    if (year) where.year_submitted = year;

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['full_name', 'school', 'department']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      total_pages: Math.ceil(count / limit),
      projects
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single project (admin view)
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['full_name', 'school', 'department']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update project (admin)
exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      title,
      short_description,
      full_description,
      discipline,
      year_submitted,
      keywords,
      supervisor_names,
      team_members,
      status
    } = req.body;

    // Update project fields
    if (title) project.title = title;
    if (short_description) project.short_description = short_description;
    if (full_description) project.full_description = full_description;
    if (discipline) project.discipline = discipline;
    if (year_submitted) project.year_submitted = year_submitted;
    if (keywords) project.keywords = keywords;
    if (supervisor_names) project.supervisor_names = supervisor_names;
    if (team_members) project.team_members = team_members;
    if (status) {
      project.status = status;
      if (status === 'approved') {
        project.approved_by_id = req.user.id;
        project.approved_at = new Date();
      }
    }

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project: {
        id: project.id,
        title: project.title,
        status: project.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // TODO: Delete project file from storage
    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 