import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { reviewSchema, reviewUpdateSchema } from '../validators/schemas';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Public: Get only approved reviews
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, customer_name, service_received, rating, review_title, written_feedback, is_verified, created_at 
       FROM reviews 
       WHERE status = 'approved' 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
  }
});

// Public: Submit a customer review (defaults to pending moderation)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = reviewSchema.parse(req.body);

    const [result]: any = await pool.query(
      `INSERT INTO reviews 
       (customer_name, email, phone, service_received, rating, review_title, written_feedback, consent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        validated.customer_name,
        validated.email,
        validated.phone || null,
        validated.service_received,
        validated.rating,
        validated.review_title,
        validated.written_feedback,
        validated.consent
      ]
    );

    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['REVIEW_SUBMITTED', 'review', result.insertId, JSON.stringify({ author: validated.customer_name, rating: validated.rating }), req.ip || null]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for sharing your experience! Your review has been submitted for moderation and will appear publicly once verified.'
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
      });
      return;
    }
    console.error('Review submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// Admin: Get all reviews with status filter
router.get('/admin/all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = 'all' } = req.query;

    let query = 'SELECT * FROM reviews';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows]: any = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews for moderation' });
  }
});

// Admin: Moderate review (approve, reject, archive, verify)
router.patch('/admin/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = reviewUpdateSchema.parse(req.body);

    await pool.query(
      `UPDATE reviews SET
         status = COALESCE(?, status),
         is_verified = COALESCE(?, is_verified),
         moderated_by = ?,
         moderated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [validated.status || null, validated.is_verified !== undefined ? validated.is_verified : null, req.user?.id, id]
    );

    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['REVIEW_MODERATED', 'review', Number(id), JSON.stringify({ new_status: validated.status, moderator: req.user?.email }), req.ip || null]
    );

    res.json({ success: true, message: `Review status updated to ${validated.status}` });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to moderate review' });
  }
});

// Admin: Delete review
router.delete('/admin/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);

    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['REVIEW_DELETED', 'review', Number(id), JSON.stringify({ deleted_by: req.user?.email }), req.ip || null]
    );

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

export default router;
