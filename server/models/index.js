const { sequelize } = require('./db');

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
const TimeEntry = require('./TimeEntry');
const PrivacyRequest = require('./PrivacyRequest');
const SystemSetting = require('./SystemSetting');
const EmailConnection = require('./EmailConnection');
const VideoIntegration = require('./VideoIntegration');
const Meeting = require('./Meeting');
const CalendarConnection = require('./CalendarConnection');
const TaskHandoff = require('./TaskHandoff');

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

// Time Entries
User.hasMany(TimeEntry, { foreignKey: 'assistantId', as: 'timeEntries' });
TimeEntry.belongsTo(User, { as: 'assistant', foreignKey: 'assistantId' });
TimeEntry.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Task.hasMany(TimeEntry, { foreignKey: 'taskId' });
TimeEntry.belongsTo(Task, { foreignKey: 'taskId' });

// Privacy Requests
User.hasMany(PrivacyRequest, { foreignKey: 'userId', as: 'privacyRequests' });
PrivacyRequest.belongsTo(User, { foreignKey: 'userId' });

// Email Connections
User.hasMany(EmailConnection, { foreignKey: 'userId', as: 'emailConnections' });
EmailConnection.belongsTo(User, { foreignKey: 'userId' });

// Video Integrations
User.hasMany(VideoIntegration, { foreignKey: 'userId', as: 'videoIntegrations' });
VideoIntegration.belongsTo(User, { foreignKey: 'userId' });

// Meetings
User.hasMany(Meeting, { foreignKey: 'clientId', as: 'clientMeetings' });
User.hasMany(Meeting, { foreignKey: 'assistantId', as: 'assistantMeetings' });
Meeting.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Meeting.belongsTo(User, { as: 'assistant', foreignKey: 'assistantId' });

// Calendar Connections
User.hasMany(CalendarConnection, { foreignKey: 'userId', as: 'calendarConnections' });
CalendarConnection.belongsTo(User, { foreignKey: 'userId' });

// Task Handoffs
Task.hasMany(TaskHandoff, { foreignKey: 'taskId', as: 'handoffs' });
TaskHandoff.belongsTo(Task, { foreignKey: 'taskId' });
User.hasMany(TaskHandoff, { foreignKey: 'fromAssistantId', as: 'handoffsGiven' });
User.hasMany(TaskHandoff, { foreignKey: 'toAssistantId', as: 'handoffsReceived' });
TaskHandoff.belongsTo(User, { as: 'fromAssistant', foreignKey: 'fromAssistantId' });
TaskHandoff.belongsTo(User, { as: 'toAssistant', foreignKey: 'toAssistantId' });

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
    Message,
    TimeEntry,
    PrivacyRequest,
    SystemSetting,
    EmailConnection,
    VideoIntegration,
    Meeting,
    CalendarConnection,
    TaskHandoff
};
