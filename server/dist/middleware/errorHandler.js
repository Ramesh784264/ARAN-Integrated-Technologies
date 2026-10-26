"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err);
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
        return;
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
