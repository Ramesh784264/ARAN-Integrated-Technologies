"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const schemas_1 = require("../validators/schemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const validated = schemas_1.adminLoginSchema.parse(req.body);
        const [rows] = await db_1.pool.query('SELECT id, name, email, password_hash, role FROM admins WHERE email = ?', [validated.email]);
        if (rows.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const admin = rows[0];
        const isMatch = await bcryptjs_1.default.compare(validated.password, admin.password_hash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'aran_default_secret_fallback_key';
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role, name: admin.name }, secret, { expiresIn: '7d' });
        // Record audit log
        await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', ['ADMIN_LOGIN', 'admin', admin.id, JSON.stringify({ email: admin.email }), req.ip || null]);
        res.json({
            success: true,
            message: 'Authentication successful',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Login failed' });
    }
});
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT id, name, email, role, created_at FROM admins WHERE id = ?', [req.user?.id]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, message: 'Admin not found' });
            return;
        }
        res.json({ success: true, admin: rows[0] });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
    }
});
exports.default = router;
