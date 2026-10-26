"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body Parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate Limiters
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
const submissionLimiter = (0, express_rate_limit_1.default)({
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
app.use('/api/admin/auth', authRoutes_1.default);
app.use('/api/admin/dashboard', dashboardRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/settings', settingRoutes_1.default);
// Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server
async function startServer() {
    const isDbReady = await (0, db_1.testConnection)();
    if (!isDbReady) {
        console.error('⚠️ Database connection could not be established. Ensure MySQL is running.');
    }
    app.listen(PORT, () => {
        console.log(`🚀 ARAN Backend Server running on http://localhost:${PORT}`);
    });
}
startServer();
