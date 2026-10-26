import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { adminLoginSchema } from '../validators/schemas';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = adminLoginSchema.parse(req.body);

    const [rows]: any = await pool.query(
      'SELECT id, name, email, password_hash, role FROM admins WHERE email = ?',
      [validated.email]
    );

    if (rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(validated.password, admin.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'aran_default_secret_fallback_key';
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      secret,
      { expiresIn: '7d' }
    );

    // Record audit log
    await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      ['ADMIN_LOGIN', 'admin', admin.id, JSON.stringify({ email: admin.email }), req.ip || null]
    );

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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Login failed' });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, name, email, role, created_at FROM admins WHERE id = ?',
      [req.user?.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({ success: true, admin: rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
});

export default router;
