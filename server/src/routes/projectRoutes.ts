import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public: Get projects by category
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    let query = 'SELECT id, title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured FROM projects';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY is_featured DESC, id DESC';

    const [rows]: any = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve projects' });
  }
});

// Admin: Get all projects
router.get('/admin/all', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin projects' });
  }
});

// Admin: Create project
router.post('/admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO projects (title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        description,
        client_type || null,
        location || null,
        image_url,
        completion_date || null,
        technical_specs ? JSON.stringify(technical_specs) : null,
        is_featured ? true : false
      ]
    );

    res.status(201).json({ success: true, message: 'Project added successfully', id: result.insertId });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to add project' });
  }
});

// Admin: Update project
router.patch('/admin/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, description, client_type, location, image_url, completion_date, technical_specs, is_featured } = req.body;

    await pool.query(
      `UPDATE projects SET
         title = COALESCE(?, title),
         category = COALESCE(?, category),
         description = COALESCE(?, description),
         client_type = COALESCE(?, client_type),
         location = COALESCE(?, location),
         image_url = COALESCE(?, image_url),
         completion_date = COALESCE(?, completion_date),
         technical_specs = COALESCE(?, technical_specs),
         is_featured = COALESCE(?, is_featured)
       WHERE id = ?`,
      [
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
      ]
    );

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update project' });
  }
});

// Admin: Delete project
router.delete('/admin/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

export default router;
