const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Project = require('../models/Project');
const User = require('../models/User');
const ProjectLike = require('../models/ProjectLike');

// Submit project (Step 1: User Info)
exports.submitStep1 = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, student_id } = req.body;
    const submission_id = req.session.submission_id || Date.now().toString();
    req.session.submission_id = submission_id;

    res.json({
      message: 'Step 1 completed',
      submission_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit project (Step 2: Project Info)
exports.submitStep2 = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      short_description,
      full_description,
      discipline,
      year_submitted,
      keywords,
      supervisor_names,
      team_members
    } = req.body;

    req.session.projectInfo = {
      title,
      short_description,
      full_description,
      discipline,
      year_submitted,
      keywords,
      supervisor_names,
      team_members
    };

    res.json({
      message: 'Step 2 completed',
      submission_id: req.session.submission_id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Submit project (Step 3: File Upload & Finalize)
exports.submitStep3 = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Project file is required' });
    }

    const projectInfo = req.session.projectInfo;
    if (!projectInfo) {
      return res.status(400).json({ error: 'Project information not found' });
    }

    const project = await Project.create({
      ...projectInfo,
      author_id: req.user.id,
      file_path: req.file.path,
      status: 'pending'
    });

    // Clear session data
    delete req.session.submission_id;
    delete req.session.projectInfo;

    res.status(201).json({
      message: 'Project submitted successfully',
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

// Browse projects
exports.browseProjects = async (req, res) => {
  try {
    const {
      search,
      discipline,
      year,
      school,
      department,
      sort = 'recent',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { short_description: { [Op.iLike]: `%${search}%` } },
        { keywords: { [Op.contains]: [search] } }
      ];
    }
    if (discipline) where.discipline = discipline;
    if (year) where.year_submitted = year;

    // Build sort options
    let order = [];
    switch (sort) {
      case 'popular':
        order = [['views_count', 'DESC']];
        break;
      case 'downloads':
        order = [['downloads_count', 'DESC']];
        break;
      case 'likes':
        order = [['likes_count', 'DESC']];
        break;
      default:
        order = [['createdAt', 'DESC']];
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['full_name', 'school', 'department'],
          where: school || department ? {
            ...(school && { school }),
            ...(department && { department })
          } : {}
        }
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
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

// Get single project
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

    // Increment views count
    project.views_count += 1;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Download project
exports.downloadProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment downloads count
    project.downloads_count += 1;
    await project.save();

    // TODO: Implement secure file download
    res.download(project.file_path);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Like project
exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user already liked the project
    const existingLike = await ProjectLike.findOne({
      where: {
        UserId: req.user.id,
        ProjectId: project.id
      }
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Project already liked' });
    }

    // Create like
    await ProjectLike.create({
      UserId: req.user.id,
      ProjectId: project.id
    });

    // Increment likes count
    project.likes_count += 1;
    await project.save();

    res.json({ message: 'Project liked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.status = status;
    if (status === 'approved') {
      project.approved_by_id = req.user.id;
      project.approved_at = new Date();
    }

    await project.save();

    res.json({
      message: 'Project status updated successfully',
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