const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

const User = require('./User');
const Invoice = require('./Invoice');
const PageTemplate = require('./PageTemplate');
const Skill = require('./Skill');
const Integration = require('./Integration');
const Task = require('./Task');
const FormTemplate = require('./FormTemplate');
const ServiceRequest = require('./ServiceRequest');
const Trip = require('./Trip');
const Document = require('./Document');
const Resource = require('./Resource');
const Research = require('./Research');
const Call = require('./Call');
const RoutingRule = require('./RoutingRule');
const Message = require('./Message');

// Associations

// Invoices
User.hasMany(Invoice, { foreignKey: 'clientId', as: 'clientInvoices' });
User.hasMany(Invoice, { foreignKey: 'assistantId', as: 'assistantInvoices' });
Invoice.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Invoice.belongsTo(User, { as: 'assistant', foreignKey: 'assistantId' });

// Skills (Many-to-Many for Assistants)
User.belongsToMany(Skill, { through: 'UserSkills', as: 'skills' });
Skill.belongsToMany(User, { through: 'UserSkills', as: 'assistants' });

// Tasks
User.hasMany(Task, { foreignKey: 'clientId', as: 'requestedTasks' });
User.hasMany(Task, { foreignKey: 'assistantId', as: 'assignedTasks' });
Task.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Task.belongsTo(User, { as: 'assistant', foreignKey: 'assistantId' });

// Service Requests
User.hasMany(ServiceRequest, { foreignKey: 'clientId', as: 'serviceRequests' });
ServiceRequest.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
FormTemplate.hasMany(ServiceRequest, { foreignKey: 'formTemplateId' });
ServiceRequest.belongsTo(FormTemplate, { foreignKey: 'formTemplateId' });

// Trips
User.hasMany(Trip, { foreignKey: 'clientId', as: 'trips' });
Trip.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// Documents
User.hasMany(Document, { foreignKey: 'clientId', as: 'documents' });
Document.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// Research
User.hasMany(Research, { foreignKey: 'clientId', as: 'researchItems' });
Research.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// Communication
User.hasMany(Call, { foreignKey: 'clientId', as: 'calls' });
Call.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
RoutingRule.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// Messages
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = {
    sequelize,
    User,
    Invoice,
    PageTemplate,
    Skill,
    Integration,
    Task,
    FormTemplate,
    ServiceRequest,
    Resource,
    Trip,
    Document,
    Research,
    Call,
    RoutingRule,
    Message
};
