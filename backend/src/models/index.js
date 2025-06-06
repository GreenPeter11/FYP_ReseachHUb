const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Project = require('./Project');
const ProjectLike = require('./ProjectLike');
const ProjectTag = require('./ProjectTag');
const Tag = require('./Tag');
const Category = require('./Category');
const ProjectView = require('./ProjectView');
const ProjectDownload = require('./ProjectDownload');
const UserStats = require('./UserStats');
const Question = require('./Question');
const Answer = require('./Answer');
const AnswerVote = require('./AnswerVote');
const Comment = require('./Comment');
const CommentLike = require('./CommentLike');
const Notification = require('./Notification');
const UserSession = require('./UserSession');
const UserActivity = require('./UserActivity');
const UserSetting = require('./UserSetting');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Badge = require('./Badge');
const UserBadge = require('./UserBadge');
const ReputationHistory = require('./ReputationHistory');

// User-Project
User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

// Project-Category
Category.hasMany(Project, { foreignKey: 'category_id' });
Project.belongsTo(Category, { foreignKey: 'category_id' });

// Project-Tag (Many-to-Many)
Project.belongsToMany(Tag, { through: ProjectTag, foreignKey: 'ProjectId' });
Tag.belongsToMany(Project, { through: ProjectTag, foreignKey: 'TagId' });

// Project-Like (Many-to-Many)
User.belongsToMany(Project, { through: ProjectLike, foreignKey: 'UserId' });
Project.belongsToMany(User, { through: ProjectLike, foreignKey: 'ProjectId' });
ProjectLike.belongsTo(User, { foreignKey: 'UserId' });
ProjectLike.belongsTo(Project, { foreignKey: 'ProjectId' });
User.hasMany(ProjectLike, { foreignKey: 'UserId' });
Project.hasMany(ProjectLike, { foreignKey: 'ProjectId' });

// Project-View
Project.hasMany(ProjectView, { foreignKey: 'ProjectId' });
User.hasMany(ProjectView, { foreignKey: 'UserId' });
ProjectView.belongsTo(Project, { foreignKey: 'ProjectId' });
ProjectView.belongsTo(User, { foreignKey: 'UserId' });

// Project-Download
Project.hasMany(ProjectDownload, { foreignKey: 'ProjectId' });
User.hasMany(ProjectDownload, { foreignKey: 'UserId' });
ProjectDownload.belongsTo(Project, { foreignKey: 'ProjectId' });
ProjectDownload.belongsTo(User, { foreignKey: 'UserId' });

// UserStats
User.hasOne(UserStats, { foreignKey: 'UserId' });
UserStats.belongsTo(User, { foreignKey: 'UserId' });

// Q&A
User.hasMany(Question, { foreignKey: 'UserId' });
Question.belongsTo(User, { foreignKey: 'UserId' });
Question.hasMany(Answer, { foreignKey: 'QuestionId' });
Answer.belongsTo(Question, { foreignKey: 'QuestionId' });
User.hasMany(Answer, { foreignKey: 'UserId' });
Answer.belongsTo(User, { foreignKey: 'UserId' });

// AnswerVote
User.hasMany(AnswerVote, { foreignKey: 'UserId' });
Answer.hasMany(AnswerVote, { foreignKey: 'AnswerId' });
AnswerVote.belongsTo(User, { foreignKey: 'UserId' });
AnswerVote.belongsTo(Answer, { foreignKey: 'AnswerId' });

// Comments
User.hasMany(Comment, { foreignKey: 'UserId' });
Comment.belongsTo(User, { foreignKey: 'UserId' });
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_id' });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_id' });

// CommentLike
User.hasMany(CommentLike, { foreignKey: 'UserId' });
Comment.hasMany(CommentLike, { foreignKey: 'CommentId' });
CommentLike.belongsTo(User, { foreignKey: 'UserId' });
CommentLike.belongsTo(Comment, { foreignKey: 'CommentId' });

// Notification
User.hasMany(Notification, { foreignKey: 'UserId' });
Notification.belongsTo(User, { foreignKey: 'UserId' });

// UserSession
User.hasMany(UserSession, { foreignKey: 'UserId' });
UserSession.belongsTo(User, { foreignKey: 'UserId' });

// UserActivity
User.hasMany(UserActivity, { foreignKey: 'UserId' });
UserActivity.belongsTo(User, { foreignKey: 'UserId' });

// UserSetting
User.hasOne(UserSetting, { foreignKey: 'UserId' });
UserSetting.belongsTo(User, { foreignKey: 'UserId' });

// Roles
User.belongsToMany(Role, { through: UserRole, foreignKey: 'UserId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'RoleId' });
UserRole.belongsTo(User, { foreignKey: 'UserId' });
UserRole.belongsTo(Role, { foreignKey: 'RoleId' });

// Badges
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'UserId' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'BadgeId' });
UserBadge.belongsTo(User, { foreignKey: 'UserId' });
UserBadge.belongsTo(Badge, { foreignKey: 'BadgeId' });

// ReputationHistory
User.hasMany(ReputationHistory, { foreignKey: 'UserId' });
ReputationHistory.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectLike,
  ProjectTag,
  Tag,
  Category,
  ProjectView,
  ProjectDownload,
  UserStats,
  Question,
  Answer,
  AnswerVote,
  Comment,
  CommentLike,
  Notification,
  UserSession,
  UserActivity,
  UserSetting,
  Role,
  UserRole,
  Badge,
  UserBadge,
  ReputationHistory
}; 