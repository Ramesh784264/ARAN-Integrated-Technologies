import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { bookingSchema, bookingUpdateSchema } from '../validators/schemas';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Helper to generate unique booking reference: ARAN-YYYYMMDD-XXXX
function generateBookingReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ARAN-${year}${month}${day}-${random}`;
}

// Public: Submit a booking request
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = bookingSchema.parse(req.body);
    const bookingRef = generateBookingReference();

    const [result]: any = await pool.query(
      `INSERT INTO bookings 
       (booking_ref, customer_name, email, phone, service_category, service_type, preferred_date, preferred_time_slot, service_address, project_description, budget_range, consent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        bookingRef,
        validated.customer_name,
        validated.email,
        validated.phone,
        validated.service_category,
        validated.service_type,
        validated.preferred_date,
        validated.preferred_time_slot,
        validated.service_address,
        validated.project_description,
        validated.budget_range || null,
        validated.consent
      ]
    );

    // Audit log
    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['NEW_BOOKING_SUBMITTED', 'booking', result.insertId, JSON.stringify({ booking_ref: bookingRef, category: validated.service_category }), req.ip || null]
    );

    res.status(201).json({
      success: true,
      message: 'Service consultation request submitted successfully! Our engineering team will review your requirements and reach out to confirm your appointment.',
      data: {
        booking_ref: bookingRef,
        customer_name: validated.customer_name,
        service_category: validated.service_category,
        preferred_date: validated.preferred_date,
        preferred_time_slot: validated.preferred_time_slot,
        status: 'Pending'
      }
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
    console.error('Booking submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to process booking request. Please try again.' });
  }
});

// Public: Track booking status by reference
router.get('/track/:ref', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ref } = req.params;
    const { phone } = req.query;

    let query = 'SELECT booking_ref, service_category, service_type, preferred_date, preferred_time_slot, status, created_at FROM bookings WHERE booking_ref = ?';
    const params: any[] = [ref];

    if (phone) {
      query += ' AND phone LIKE ?';
      params.push(`%${phone}%`);
    }

    const [rows]: any = await pool.query(query, params);

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Booking reference not found. Please verify your reference code.' });
      return;
    }

    res.json({ success: true, booking: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to track booking status' });
  }
});

// Admin: Get all bookings with filtering & search
router.get('/admin/all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    if (search) {
      whereConditions.push('(booking_ref LIKE ? OR customer_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (category && category !== 'All') {
      whereConditions.push('service_category = ?');
      queryParams.push(category);
    }

    if (status && status !== 'All') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM bookings ${whereClause}`,
      queryParams
    );
    const total = countRows[0].total;

    const [rows]: any = await pool.query(
      `SELECT * FROM bookings ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, Number(limit), offset]
    );

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: rows
    });
  } catch (error: any) {
    console.error('Admin bookings fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings' });
  }
});

// Admin: Update booking status or notes
router.patch('/admin/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validated = bookingUpdateSchema.parse(req.body);

    const [existing]: any = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (existing.length === 0) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    await pool.query(
      `UPDATE bookings SET
         status = COALESCE(?, status),
         admin_notes = COALESCE(?, admin_notes),
         preferred_date = COALESCE(?, preferred_date),
         preferred_time_slot = COALESCE(?, preferred_time_slot)
       WHERE id = ?`,
      [
        validated.status || null,
        validated.admin_notes !== undefined ? validated.admin_notes : null,
        validated.preferred_date || null,
        validated.preferred_time_slot || null,
        id
      ]
    );

    // Audit log
    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      [
        'BOOKING_UPDATED',
        'booking',
        Number(id),
        JSON.stringify({
          updated_by: req.user?.email,
          new_status: validated.status,
          admin_notes: validated.admin_notes
        }),
        req.ip || null
      ]
    );

    res.json({ success: true, message: 'Booking updated successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update booking' });
  }
});

// Admin: Delete booking
router.delete('/admin/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);

    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['BOOKING_DELETED', 'booking', Number(id), JSON.stringify({ deleted_by: req.user?.email }), req.ip || null]
    );

    res.json({ success: true, message: 'Booking record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

export default router;
