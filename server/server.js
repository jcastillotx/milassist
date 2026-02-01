const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/invoices', require('./routes/invoices'));
app.use('/pages', require('./routes/pages'));
app.use('/integrations', require('./routes/integrations'));
app.use('/trips', require('./routes/trips'));
app.use('/travel', require('./routes/travel'));
app.use('/twilio', require('./routes/twilio'));
app.use('/documents', require('./routes/documents'));
app.use('/research', require('./routes/research'));
app.use('/ai', require('./routes/ai'));
app.use('/communication', require('./routes/communication'));
app.use('/messages', require('./routes/messages'));
app.use('/tasks', require('./routes/tasks'));
app.use('/forms', require('./routes/forms'));
app.use('/resources', require('./routes/resources'));
app.use('/time', require('./routes/time'));
app.use('/settings', require('./routes/settings'));
app.use('/payments', require('./routes/payments'));
app.use('/email', require('./routes/email'));
app.use('/video', require('./routes/video'));
app.use('/meetings', require('./routes/meetings'));
app.use('/calendar', require('./routes/calendar'));
app.use('/setup', require('./routes/setup'));
app.use('/audit-logs', require('./routes/auditLogs'));
app.use('/rbac', require('./routes/rbac'));
app.use('/va-profiles', require('./routes/vaProfiles'));
app.use('/va-matching', require('./routes/vaMatching'));
app.use('/ai', require('./routes/aiProductivity'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: NODE_ENV });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('MilAssist API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Sync Database and Start Server
sequelize.sync().then(() => {
    if (NODE_ENV !== 'production') {
        console.log('Database synced');
    }
    app.listen(PORT, () => {
        if (NODE_ENV !== 'production') {
            console.log(`Server is running on port ${PORT}`);
        }
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
    process.exit(1);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        sequelize.close();
    });
});
