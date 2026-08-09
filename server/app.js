const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const organizerRequestRoutes = require('./routes/organizerRequestRoutes');
const notFound = require('./middleware/notFound');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();

// --- Security & parsing middleware -----------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Static file serving for uploaded banners, avatars, certs and generated tickets.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/tickets', express.static(path.join(__dirname, 'tickets')));

// --- Routes -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizer-requests', organizerRequestRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;
