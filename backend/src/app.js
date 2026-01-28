const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboards');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'campus-connect-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

