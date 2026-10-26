"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Get general company information
router.get('/public', async (req, res) => {
    try {
        const [rows] = await db_1.pool.query(`SELECT setting_key, setting_value FROM business_settings 
       WHERE setting_group IN ('company', 'contact', 'compliance', 'operations')`);
        const settingsMap = {};
        for (const r of rows) {
            settingsMap[r.setting_key] = r.setting_value;
        }
        res.json({ success: true, settings: settingsMap });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve company settings' });
    }
});
// Admin: Get all settings
router.get('/admin', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT * FROM business_settings');
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve settings' });
    }
});
// Admin: Update settings in bulk
router.patch('/admin', auth_1.authenticateToken, async (req, res) => {
    try {
        const { settings } = req.body; // array of { key, value, group } or key-value object
        if (Array.isArray(settings)) {
            for (const s of settings) {
                await db_1.pool.query(`INSERT INTO business_settings (setting_key, setting_value, setting_group) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [s.key, s.value, s.group || 'general']);
            }
        }
        else if (typeof settings === 'object') {
            for (const [key, value] of Object.entries(settings)) {
                await db_1.pool.query(`INSERT INTO business_settings (setting_key, setting_value, setting_group) 
           VALUES (?, ?, 'general') 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [key, String(value)]);
            }
        }
        // Audit log
        await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', ['SETTINGS_UPDATED', 'settings', null, JSON.stringify({ updated_by: req.user?.email }), req.ip || null]);
        res.json({ success: true, message: 'Settings updated successfully' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Failed to update settings' });
    }
});
// Admin: Get audit activity logs
router.get('/admin/audit-logs', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT id, action, entity_type, entity_id, details, ip_address, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100');
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve audit logs' });
    }
});
exports.default = router;
