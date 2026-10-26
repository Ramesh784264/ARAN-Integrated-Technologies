import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public: GET all active services
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, slug, category, title, tagline, description, features, specs, image_url, icon_name, sort_order FROM services WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve services' });
  }
});

// Admin: GET all services (including inactive)
router.get('/admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM services ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin services' });
  }
});

// Admin: Create service
router.post('/admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, category, title, tagline, description, features, specs, image_url, icon_name, sort_order, is_active } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO services (slug, category, title, tagline, description, features, specs, image_url, icon_name, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        category,
        title,
        tagline,
        description,
        JSON.stringify(features || []),
        JSON.stringify(specs || {}),
        image_url,
        icon_name,
        sort_order || 0,
        is_active !== undefined ? is_active : true
      ]
    );

    res.status(201).json({ success: true, message: 'Service created successfully', id: result.insertId });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create service' });
  }
});

// Admin: Update service
router.patch('/admin/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, tagline, description, features, specs, image_url, icon_name, sort_order, is_active } = req.body;

    await pool.query(
      `UPDATE services SET 
         title = COALESCE(?, title),
         tagline = COALESCE(?, tagline),
         description = COALESCE(?, description),
         features = COALESCE(?, features),
         specs = COALESCE(?, specs),
         image_url = COALESCE(?, image_url),
         icon_name = COALESCE(?, icon_name),
         sort_order = COALESCE(?, sort_order),
         is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        title,
        tagline,
        description,
        features ? JSON.stringify(features) : null,
        specs ? JSON.stringify(specs) : null,
        image_url,
        icon_name,
        sort_order,
        is_active,
        id
      ]
    );

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update service' });
  }
});

// Admin: Delete service
router.delete('/admin/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

export default router;
