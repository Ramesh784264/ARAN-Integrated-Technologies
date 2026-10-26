import { z } from 'zod';

export const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+\s\-()]{10,20}$/, 'Please enter a valid phone number with at least 10 digits'),
  service_category: z.enum([
    'CCTV Surveillance',
    'Solar Power',
    'Hydraulic Systems',
    'General Consultation'
  ]),
  service_type: z.string().min(2, 'Please select a specific service type'),
  preferred_date: z.string().refine((dateStr) => {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(selected.getTime()) && selected >= today;
  }, { message: 'Preferred appointment date cannot be in the past' }),
  preferred_time_slot: z.string().min(2, 'Please select a preferred time slot'),
  service_address: z.string().min(5, 'Service address must be at least 5 characters'),
  project_description: z.string().min(10, 'Please describe your requirements (min 10 characters)'),
  budget_range: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted regarding this request'
  })
});

export const reviewSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service_received: z.string().min(2, 'Please select the service received'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5 stars'),
  review_title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  written_feedback: z.string().min(10, 'Review feedback must be at least 10 characters').max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Consent to publish review is required'
  })
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please provide a valid contact number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled']).optional(),
  admin_notes: z.string().optional(),
  preferred_date: z.string().optional(),
  preferred_time_slot: z.string().optional()
});

export const reviewUpdateSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'archived']).optional(),
  is_verified: z.boolean().optional()
});
