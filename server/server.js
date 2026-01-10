const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/invoices', require('./routes/invoices'));
app.use('/pages', require('./routes/pages'));
app.use('/integrations', require('./routes/integrations'));
app.use('/trips', require('./routes/trips'));
app.use('/documents', require('./routes/documents'));
app.use('/research', require('./routes/research'));
app.use('/ai', require('./routes/ai'));
app.use('/communication', require('./routes/communication'));
app.use('/messages', require('./routes/messages'));
app.use('/tasks', require('./routes/tasks'));
app.use('/forms', require('./routes/forms'));
app.use('/resources', require('./routes/resources'));

// Basic Route
app.get('/', (req, res) => {
    res.send('MilAssist API is running');
});

// Sync Database and Start Server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
