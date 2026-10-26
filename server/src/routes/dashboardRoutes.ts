import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    // Bookings summary
    const [bookingCounts]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'Contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM bookings
    `);

    // Reviews summary
    const [reviewCounts]: any = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM reviews
    `);

    // Projects count
    const [projectCount]: any = await pool.query('SELECT COUNT(*) as total FROM projects');

    // Recent 5 bookings
    const [recentBookings]: any = await pool.query(`
      SELECT id, booking_ref, customer_name, email, phone, service_category, preferred_date, preferred_time_slot, status, created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Recent 5 pending reviews
    const [pendingReviews]: any = await pool.query(`
      SELECT id, customer_name, service_received, rating, review_title, written_feedback, created_at
      FROM reviews
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Recent activity logs
    const [recentLogs]: any = await pool.query(`
      SELECT id, action, entity_type, entity_id, details, ip_address, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 8
    `);

    res.json({
      success: true,
      data: {
        bookings: {
          total: bookingCounts[0]?.total || 0,
          pending: bookingCounts[0]?.pending || 0,
          contacted: bookingCounts[0]?.contacted || 0,
          confirmed: bookingCounts[0]?.confirmed || 0,
          completed: bookingCounts[0]?.completed || 0,
          cancelled: bookingCounts[0]?.cancelled || 0,
        },
        reviews: {
          total: reviewCounts[0]?.total || 0,
          pending: reviewCounts[0]?.pending || 0,
          approved: reviewCounts[0]?.approved || 0,
          rejected: reviewCounts[0]?.rejected || 0,
        },
        projects: {
          total: projectCount[0]?.total || 0,
        },
        recentBookings,
        pendingReviews,
        recentLogs
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics' });
  }
});

export default router;
