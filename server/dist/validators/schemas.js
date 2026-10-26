"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewUpdateSchema = exports.bookingUpdateSchema = exports.adminLoginSchema = exports.contactSchema = exports.reviewSchema = exports.bookingSchema = void 0;
const zod_1 = require("zod");
exports.bookingSchema = zod_1.z.object({
    customer_name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().regex(/^[0-9+\s\-()]{10,20}$/, 'Please enter a valid phone number with at least 10 digits'),
    service_category: zod_1.z.enum([
        'CCTV Surveillance',
        'Solar Power',
        'Hydraulic Systems',
        'General Consultation'
    ]),
    service_type: zod_1.z.string().min(2, 'Please select a specific service type'),
    preferred_date: zod_1.z.string().refine((dateStr) => {
        const selected = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(selected.getTime()) && selected >= today;
    }, { message: 'Preferred appointment date cannot be in the past' }),
    preferred_time_slot: zod_1.z.string().min(2, 'Please select a preferred time slot'),
    service_address: zod_1.z.string().min(5, 'Service address must be at least 5 characters'),
    project_description: zod_1.z.string().min(10, 'Please describe your requirements (min 10 characters)'),
    budget_range: zod_1.z.string().optional(),
    consent: zod_1.z.boolean().refine((val) => val === true, {
        message: 'You must consent to be contacted regarding this request'
    })
});
exports.reviewSchema = zod_1.z.object({
    customer_name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().optional(),
    service_received: zod_1.z.string().min(2, 'Please select the service received'),
    rating: zod_1.z.number().int().min(1).max(5, 'Rating must be between 1 and 5 stars'),
    review_title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(150),
    written_feedback: zod_1.z.string().min(10, 'Review feedback must be at least 10 characters').max(2000),
    consent: zod_1.z.boolean().refine((val) => val === true, {
        message: 'Consent to publish review is required'
    })
});
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().min(10, 'Please provide a valid contact number'),
    subject: zod_1.z.string().min(3, 'Subject must be at least 3 characters'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters')
});
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid admin email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
exports.bookingUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled']).optional(),
    admin_notes: zod_1.z.string().optional(),
    preferred_date: zod_1.z.string().optional(),
    preferred_time_slot: zod_1.z.string().optional()
});
exports.reviewUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'rejected', 'archived']).optional(),
    is_verified: zod_1.z.boolean().optional()
});
