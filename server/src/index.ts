import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { testConnection } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import projectRoutes from './routes/projectRoutes';
import contactRoutes from './routes/contactRoutes';
import settingRoutes from './routes/settingRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

const submissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: { success: false, message: 'Too many submissions. Please wait a few minutes before submitting again.' }
});

app.use('/api', generalLimiter);
app.use('/api/bookings', submissionLimiter);
app.use('/api/reviews', submissionLimiter);
app.use('/api/contact', submissionLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ARAN Integrated Technologies REST API'
  });
});

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  const isDbReady = await testConnection();
  if (!isDbReady) {
    console.error('⚠️ Database connection could not be established. Ensure MySQL is running.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 ARAN Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
