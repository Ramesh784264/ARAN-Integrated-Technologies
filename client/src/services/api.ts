import axios from 'axios';
import { Booking, ReviewItem, ProjectItem, ServiceItem, BusinessSettings, DashboardStats, AdminUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aran_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API
export const fetchServices = async (): Promise<ServiceItem[]> => {
  const res = await apiClient.get('/services');
  return res.data.data;
};

export const fetchProjects = async (category: string = 'all'): Promise<ProjectItem[]> => {
  const res = await apiClient.get(`/projects?category=${category}`);
  return res.data.data;
};

export const fetchApprovedReviews = async (): Promise<ReviewItem[]> => {
  const res = await apiClient.get('/reviews');
  return res.data.data;
};

export const submitBooking = async (bookingData: any): Promise<{ booking_ref: string; message: string }> => {
  const res = await apiClient.post('/bookings', bookingData);
  return {
    booking_ref: res.data.data.booking_ref,
    message: res.data.message,
  };
};

export const trackBooking = async (ref: string, phone?: string): Promise<Booking> => {
  const query = phone ? `?phone=${encodeURIComponent(phone)}` : '';
  const res = await apiClient.get(`/bookings/track/${encodeURIComponent(ref)}${query}`);
  return res.data.booking;
};

export const submitReview = async (reviewData: any): Promise<{ message: string }> => {
  const res = await apiClient.post('/reviews', reviewData);
  return { message: res.data.message };
};

export const submitContact = async (contactData: any): Promise<{ message: string }> => {
  const res = await apiClient.post('/contact', contactData);
  return { message: res.data.message };
};

export const fetchPublicSettings = async (): Promise<BusinessSettings> => {
  const res = await apiClient.get('/settings/public');
  return res.data.settings;
};

// Admin API
export const adminLogin = async (credentials: { email: string; password: string }): Promise<{ token: string; admin: AdminUser }> => {
  const res = await apiClient.post('/admin/auth/login', credentials);
  if (res.data.token) {
    localStorage.setItem('aran_admin_token', res.data.token);
    localStorage.setItem('aran_admin_user', JSON.stringify(res.data.admin));
  }
  return res.data;
};

export const adminLogout = () => {
  localStorage.removeItem('aran_admin_token');
  localStorage.removeItem('aran_admin_user');
};

export const getStoredAdmin = (): AdminUser | null => {
  const user = localStorage.getItem('aran_admin_user');
  return user ? JSON.parse(user) : null;
};

export const checkAdminAuth = async (): Promise<AdminUser | null> => {
  try {
    const res = await apiClient.get('/admin/auth/me');
    return res.data.admin;
  } catch {
    adminLogout();
    return null;
  }
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data;
};

export const fetchAdminBookings = async (params: { search?: string; category?: string; status?: string; page?: number } = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.category && params.category !== 'All') queryParams.append('category', params.category);
  if (params.status && params.status !== 'All') queryParams.append('status', params.status);
  if (params.page) queryParams.append('page', String(params.page));

  const res = await apiClient.get(`/bookings/admin/all?${queryParams.toString()}`);
  return res.data;
};

export const updateBookingStatus = async (id: number, data: { status?: string; admin_notes?: string; preferred_date?: string; preferred_time_slot?: string }) => {
  const res = await apiClient.patch(`/bookings/admin/${id}`, data);
  return res.data;
};

export const deleteBooking = async (id: number) => {
  const res = await apiClient.delete(`/bookings/admin/${id}`);
  return res.data;
};

export const fetchAdminReviews = async (status: string = 'all'): Promise<ReviewItem[]> => {
  const res = await apiClient.get(`/reviews/admin/all?status=${status}`);
  return res.data.data;
};

export const updateReviewStatus = async (id: number, data: { status?: string; is_verified?: boolean }) => {
  const res = await apiClient.patch(`/reviews/admin/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: number) => {
  const res = await apiClient.delete(`/reviews/admin/${id}`);
  return res.data;
};

export const fetchAdminProjects = async (): Promise<ProjectItem[]> => {
  const res = await apiClient.get('/projects/admin/all');
  return res.data.data;
};

export const createProject = async (projectData: any) => {
  const res = await apiClient.post('/projects/admin', projectData);
  return res.data;
};

export const updateProject = async (id: number, projectData: any) => {
  const res = await apiClient.patch(`/projects/admin/${id}`, projectData);
  return res.data;
};

export const deleteProject = async (id: number) => {
  const res = await apiClient.delete(`/projects/admin/${id}`);
  return res.data;
};

export const fetchAdminSettings = async () => {
  const res = await apiClient.get('/settings/admin');
  return res.data.data;
};

export const updateAdminSettings = async (settings: Record<string, string> | any[]) => {
  const res = await apiClient.patch('/settings/admin', { settings });
  return res.data;
};

export const fetchAuditLogs = async () => {
  const res = await apiClient.get('/settings/admin/audit-logs');
  return res.data.data;
};
