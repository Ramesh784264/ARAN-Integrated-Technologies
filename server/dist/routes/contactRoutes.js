"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const validated = schemas_1.contactSchema.parse(req.body);
        // Save contact inquiry into audit logs
        const [result] = await db_1.pool.query('INSERT INTO audit_logs (action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?)', [
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
        ]);
        res.status(200).json({
            success: true,
            message: 'Thank you for contacting ARAN Integrated Technologies! Our engineering specialists will get in touch with you shortly.'
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
        console.error('Contact submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to process inquiry' });
    }
});
exports.default = router;
