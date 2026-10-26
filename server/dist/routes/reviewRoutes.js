"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const schemas_1 = require("../validators/schemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Get only approved reviews
router.get('/', async (req, res) => {
    try {
        const [rows] = await db_1.pool.query(`SELECT id, customer_name, service_received, rating, review_title, written_feedback, is_verified, created_at 
       FROM reviews 
       WHERE status = 'approved' 
       ORDER BY created_at DESC 
       LIMIT 50`);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
    }
});
// Public: Submit a customer review (defaults to pending moderation)
router.post('/', async (req, res) => {
    try {
        const validated = schemas_1.reviewSchema.parse(req.body);
        const [result] = await db_1.pool.query(`INSERT INTO reviews 
       (customer_name, email, phone, service_received, rating, review_title, written_feedback, consent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`, [
            validated.customer_name,
            validated.email,
            validated.phone || null,
            validated.service_received,
            validated.rating,
            validated.review_title,
            validated.written_feedback,
            validated.consent
        ]);
        await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', ['REVIEW_SUBMITTED', 'review', result.insertId, JSON.stringify({ author: validated.customer_name, rating: validated.rating }), req.ip || null]);
        res.status(201).json({
            success: true,
            message: 'Thank you for sharing your experience! Your review has been submitted for moderation and will appear publicly once verified.'
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
            });
            return;
        }
        console.error('Review submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
});
// Admin: Get all reviews with status filter
router.get('/admin/all', auth_1.authenticateToken, async (req, res) => {
    try {
        const { status = 'all' } = req.query;
        let query = 'SELECT * FROM reviews';
        const params = [];
        if (status && status !== 'all') {
            query += ' WHERE status = ?';
            params.push(status);
        }
        query += ' ORDER BY created_at DESC';
        const [rows] = await db_1.pool.query(query, params);
        res.json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve reviews for moderation' });
    }
});
// Admin: Moderate review (approve, reject, archive, verify)
router.patch('/admin/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const validated = schemas_1.reviewUpdateSchema.parse(req.body);
        await db_1.pool.query(`UPDATE reviews SET
         status = COALESCE(?, status),
         is_verified = COALESCE(?, is_verified),
         moderated_by = ?,
         moderated_at = CURRENT_TIMESTAMP
       WHERE id = ?`, [validated.status || null, validated.is_verified !== undefined ? validated.is_verified : null, req.user?.id, id]);
        await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', ['REVIEW_MODERATED', 'review', Number(id), JSON.stringify({ new_status: validated.status, moderator: req.user?.email }), req.ip || null]);
        res.json({ success: true, message: `Review status updated to ${validated.status}` });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Failed to moderate review' });
    }
});
// Admin: Delete review
router.delete('/admin/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.pool.query('DELETE FROM reviews WHERE id = ?', [id]);
        await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', ['REVIEW_DELETED', 'review', Number(id), JSON.stringify({ deleted_by: req.user?.email }), req.ip || null]);
        res.json({ success: true, message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
});
exports.default = router;
