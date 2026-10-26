"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Get projects by category
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT id, title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured FROM projects';
        const params = [];
        if (category && category !== 'all') {
            query += ' WHERE category = ?';
            params.push(category);
        }
        query += ' ORDER BY is_featured DESC, id DESC';
        const [rows] = await db_1.pool.query(query, params);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve projects' });
    }
});
// Admin: Get all projects
router.get('/admin/all', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await db_1.pool.query('SELECT * FROM projects ORDER BY id DESC');
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve admin projects' });
    }
});
// Admin: Create project
router.post('/admin', auth_1.authenticateToken, async (req, res) => {
    try {
        const { title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured } = req.body;
        const [result] = await db_1.pool.query(`INSERT INTO projects (title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            title,
            category,
            description,
            client_type || null,
            location || null,
            image_url,
            completion_date || null,
            technical_specs ? JSON.stringify(technical_specs) : null,
            is_featured ? true : false
        ]);
        res.status(201).json({ success: true, message: 'Project added successfully', id: result.insertId });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Failed to add project' });
    }
});
// Admin: Update project
router.patch('/admin/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured } = req.body;
        await db_1.pool.query(`UPDATE projects SET
         title = COALESCE(?, title),
         category = COALESCE(?, category),
         description = COALESCE(?, description),
         client_type = COALESCE(?, client_type),
         location = COALESCE(?, location),
         image_url = COALESCE(?, image_url),
         completion_date = COALESCE(?, completion_date),
         technical_specs = COALESCE(?, technical_specs),
         is_featured = COALESCE(?, is_featured)
       WHERE id = ?`, [
            title,
            category,
            description,
            client_type,
            location,
            image_url,
            completion_date,
            technical_specs ? JSON.stringify(technical_specs) : null,
            is_featured,
            id
        ]);
        res.json({ success: true, message: 'Project updated successfully' });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Failed to update project' });
    }
});
// Admin: Delete project
router.delete('/admin/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.pool.query('DELETE FROM projects WHERE id = ?', [id]);
        res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
});
exports.default = router;
