export interface ServiceItem {
  id: number;
  slug: string;
  category: 'cctv' | 'solar' | 'hydraulics';
  title: string;
  tagline: string;
  description: string;
  features: string[] | string;
  specs: Record<string, string> | string;
  image_url: string;
  icon_name: string;
  sort_order: number;
  is_active?: boolean;
}

export interface Booking {
  id: number;
  booking_ref: string;
  customer_name: string;
  email: string;
  phone: string;
  service_category: string;
  service_type: string;
  preferred_date: string;
  preferred_time_slot: string;
  service_address: string;
  project_description: string;
  budget_range?: string;
  consent: boolean;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewItem {
  id: number;
  customer_name: string;
  email?: string;
  phone?: string;
  service_received: string;
  rating: number;
  review_title: string;
  written_feedback: string;
  consent?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'archived';
  is_verified?: boolean;
  created_at: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  category: 'cctv' | 'solar' | 'hydraulics';
  description: string;
  client_type?: string;
  location?: string;
  image_url: string;
  completion_date?: string;
  technical_specs?: Record<string, string> | string;
  is_featured?: boolean;
  created_at?: string;
}

export interface BusinessSettings {
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  udyam?: string;
  business_hours?: string;
  whatsapp_number?: string;
  google_maps_url?: string;
  [key: string]: string | undefined;
}

export interface DashboardStats {
  bookings: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  projects: {
    total: number;
  };
  recentBookings: Booking[];
  pendingReviews: ReviewItem[];
  recentLogs: Array<{
    id: number;
    action: string;
    entity_type: string;
    entity_id?: number;
    details?: any;
    ip_address?: string;
    created_at: string;
  }>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
