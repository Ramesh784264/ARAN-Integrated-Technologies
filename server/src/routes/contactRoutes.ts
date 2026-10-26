import { Router, Request, Response } from 'express';
import { pool } from '../config/db';
import { contactSchema } from '../validators/schemas';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = contactSchema.parse(req.body);

    // Save contact inquiry into audit logs
    const [result]: any = await pool.query(
      'INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      [
        'CONTACT_FORM_SUBMISSION',
        'contact',
        null,
        JSON.stringify({
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          subject: validated.subject,
          message: validated.message
        }),
        req.ip || null
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting ARAN Integrated Technologies! Our engineering specialists will get in touch with you shortly.'
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
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to process inquiry' });
  }
});

export default router;
