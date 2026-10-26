import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  MessageSquare,
  Layers,
  Settings,
  Activity,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  User,
  Key
} from 'lucide-react';
import {
  adminLogin,
  adminLogout,
  getStoredAdmin,
  fetchDashboardStats,
  fetchAdminBookings,
  updateBookingStatus,
  deleteBooking,
  fetchAdminReviews,
  updateReviewStatus,
  deleteReview,
  fetchAdminProjects,
  createProject,
  deleteProject,
  fetchAdminSettings,
  updateAdminSettings,
  fetchAuditLogs
} from '../services/api';
import { DashboardStats, Booking, ReviewItem, ProjectItem, AdminUser } from '../types';
import { Logo } from '../components/Logo';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(getStoredAdmin());
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('admin@aran-tech.com');
  const [loginPassword, setLoginPassword] = useState('AranAdmin@2025');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reviews' | 'projects' | 'settings' | 'logs'>('overview');

  // Dashboard Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingCategoryFilter, setBookingCategoryFilter] = useState('All');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');

  // New Project Form state
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'cctv',
    description: '',
    location: '',
    client_type: 'Industrial',
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
    completion_date: '2025',
    is_featured: true
  });

  // Settings edit state
  const [settingsForm, setSettingsForm] = useState({
    phone: '',
    email: '',
    address: '',
    business_hours: '',
    gstin: '',
    udyam: '',
    whatsapp_number: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Load dashboard overview & current tab data
  const loadData = async () => {
    if (!adminUser) return;
    setLoading(true);
    try {
      const statsData = await fetchDashboardStats();
      setStats(statsData);

      if (activeTab === 'bookings' || activeTab === 'overview') {
        const bData = await fetchAdminBookings({
          search: bookingSearch,
          status: bookingStatusFilter,
          category: bookingCategoryFilter
        });
        setBookings(bData.data || []);
      }

      if (activeTab === 'reviews' || activeTab === 'overview') {
        const rData = await fetchAdminReviews(reviewStatusFilter);
        setReviews(rData || []);
      }

      if (activeTab === 'projects') {
        const pData = await fetchAdminProjects();
        setProjects(pData || []);
      }

      if (activeTab === 'settings') {
        const sData = await fetchAdminSettings();
        const map: Record<string, string> = {};
        sData.forEach((item: any) => {
          map[item.setting_key] = item.setting_value;
        });
        setSettingsMap(map);
        setSettingsForm({
          phone: map.phone || '+91 90256 72856',
          email: map.email || 'aranidts@gmail.com',
          address: map.address || '10/264 A3, Kamaraj Nagar North, Pavoorchatram, Tenkasi District, Tamil Nadu 627808.',
          business_hours: map.business_hours || 'Monday - Saturday: 9:00 AM - 7:00 PM',
          gstin: map.gstin || '33AABPX4889K3ZY',
          udyam: map.udyam || 'TN-37-0063266',
          whatsapp_number: map.whatsapp_number || '919025672856'
        });
      }

      if (activeTab === 'logs') {
        const lData = await fetchAuditLogs();
        setAuditLogs(lData || []);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadData();
    }
  }, [adminUser, activeTab, bookingStatusFilter, bookingCategoryFilter, reviewStatusFilter]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await adminLogin({ email: loginEmail, password: loginPassword });
      setAdminUser(res.admin);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setAdminUser(null);
  };

  // Actions for Bookings
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      loadData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await deleteBooking(id);
      loadData();
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  // Actions for Reviews
  const handleModerateReview = async (id: number, status: string, is_verified?: boolean) => {
    try {
      await updateReviewStatus(id, { status, is_verified });
      loadData();
    } catch (err) {
      alert('Failed to update review');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id);
      loadData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  // Actions for Projects
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setShowAddProject(false);
      setNewProject({
        title: '',
        category: 'cctv',
        description: '',
        location: '',
        client_type: 'Industrial',
        image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
        completion_date: '2025',
        is_featured: true
      });
      loadData();
    } catch (err) {
      alert('Failed to add project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  // Actions for Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsNotice(null);
    try {
      await updateAdminSettings(settingsForm);
      setSettingsNotice('Business configuration updated successfully in MySQL!');
      setTimeout(() => setSettingsNotice(null), 3500);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  // 1. Unauthenticated Login Screen
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-brand-midnight flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-navy rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-orange rounded-full blur-[140px] opacity-15" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Engineering Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-brand-gray-300">
              Authorized access for bookings management, review moderation, and system settings.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-navy/80 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5 text-left">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                  Admin Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1.5 uppercase font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-brand-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-brand-gray-500 text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating...' : 'Sign In to Management Portal'}
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="pt-3 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@aran-tech.com');
                  setLoginPassword('AranAdmin@2025');
                }}
                className="text-xs font-mono text-brand-orange hover:underline cursor-pointer"
              >
                Auto-fill Verified Admin Credentials
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-brand-gray-400 hover:text-white transition-colors">
              ← Return to ARAN Public Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-brand-midnight text-brand-gray-100 flex flex-col text-left">
      
      {/* Top Admin Bar */}
      <header className="bg-brand-navy border-b border-white/10 px-4 sm:px-8 py-3.5 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-mono bg-brand-orange/20 text-brand-orange font-bold uppercase border border-brand-orange/30">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-brand-gray-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <div className="h-4 w-[1px] bg-white/20" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-bold text-xs text-brand-orange">
                {adminUser.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-white">{adminUser.name}</div>
                <div className="text-[10px] font-mono text-brand-gray-400">{adminUser.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Activity },
            { id: 'bookings', label: 'Service Bookings', icon: Calendar, badge: stats?.bookings.pending },
            { id: 'reviews', label: 'Review Moderation', icon: MessageSquare, badge: stats?.reviews.pending },
            { id: 'projects', label: 'Project Portfolio', icon: Layers },
            { id: 'settings', label: 'Business Settings', icon: Settings },
            { id: 'logs', label: 'Audit Logs', icon: Clock }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25'
                    : 'text-brand-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-brand-gray-400 text-xs font-mono uppercase">
                  <span>Total Bookings</span>
                  <Calendar className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">{stats.bookings.total}</div>
                <div className="text-[11px] text-brand-gray-300 flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">{stats.bookings.confirmed} Confirmed</span>
                  <span>•</span>
                  <span>{stats.bookings.completed} Done</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-amber-500/30 shadow-xl space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between text-amber-400 text-xs font-mono uppercase font-bold">
                  <span>Pending Requests</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">{stats.bookings.pending}</div>
                <div className="text-[11px] text-amber-400">Requires engineer contact</div>
              </div>

              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-brand-gray-400 text-xs font-mono uppercase">
                  <span>Customer Reviews</span>
                  <MessageSquare className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">{stats.reviews.total}</div>
                <div className="text-[11px] text-brand-gray-300 flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">{stats.reviews.approved} Published</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{stats.reviews.pending} To Moderate</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-brand-gray-400 text-xs font-mono uppercase">
                  <span>Portfolio Projects</span>
                  <Layers className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">{stats.projects.total}</div>
                <div className="text-[11px] text-brand-gray-400">All 3 divisions verified</div>
              </div>

            </div>

            {/* Quick Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Bookings Queue */}
              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-orange" />
                    Latest Consultation Requests
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-brand-orange hover:underline font-semibold"
                  >
                    View All ({stats.bookings.total})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((b) => (
                      <div key={b.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{b.customer_name}</span>
                            <span className="font-mono text-[10px] text-brand-orange">({b.booking_ref})</span>
                          </div>
                          <div className="text-brand-gray-400 text-[11px] mt-0.5">
                            {b.service_category} • {new Date(b.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-400' :
                          b.status === 'Contacted' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-amber-500/15 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-brand-gray-400 py-6 text-center">No bookings submitted yet.</div>
                  )}
                </div>
              </div>

              {/* Reviews Pending Moderation Queue */}
              <div className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-orange" />
                    Reviews Needing Moderation
                  </h3>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs text-brand-orange hover:underline font-semibold"
                  >
                    Manage ({stats.reviews.pending} Pending)
                  </button>
                </div>

                <div className="space-y-2.5">
                  {stats.pendingReviews.length > 0 ? (
                    stats.pendingReviews.map((r) => (
                      <div key={r.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{r.customer_name}</span>
                          <span className="text-amber-400 font-mono">★ {r.rating}/5</span>
                        </div>
                        <p className="text-brand-gray-300 italic text-[11px]">"{r.written_feedback}"</p>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleModerateReview(r.id, 'approved', true)}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleModerateReview(r.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-brand-gray-400 py-6 text-center">
                      ✓ All customer reviews have been moderated.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Service Bookings Management
                </h3>
                <p className="text-xs text-brand-gray-300 mt-0.5">
                  Search, filter, update appointment status, and maintain customer communication logs.
                </p>
              </div>

              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-brand-gray-200 border border-white/10 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-brand-navy/70 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-brand-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, phone, ref..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-gray-500 text-xs focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-midnight border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <select
                  value={bookingCategoryFilter}
                  onChange={(e) => setBookingCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-midnight border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange"
                >
                  <option value="All">All Categories</option>
                  <option value="CCTV Surveillance">CCTV Surveillance</option>
                  <option value="Solar Power">Solar Power</option>
                  <option value="Hydraulic Systems">Hydraulic Systems</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-brand-navy/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-midnight/90 text-brand-gray-400 font-mono uppercase text-[11px] border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Ref & Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Service Scope</th>
                      <th className="py-3.5 px-4">Preferred Slot</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-mono">
                            <span className="font-bold text-brand-orange block">{b.booking_ref}</span>
                            <span className="text-[10px] text-brand-gray-400">
                              {new Date(b.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-white">
                            {b.customer_name}
                            <span className="block text-[11px] font-normal text-brand-gray-400 truncate max-w-xs">
                              {b.service_address}
                            </span>
                          </td>
                          <td className="py-4 px-4 space-y-1">
                            <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-white hover:text-brand-orange font-mono">
                              <Phone className="w-3 h-3 text-brand-orange" />
                              <span>{b.phone}</span>
                            </a>
                            <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 text-brand-gray-400 hover:text-white truncate max-w-[140px]">
                              <Mail className="w-3 h-3" />
                              <span>{b.email}</span>
                            </a>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-white block">{b.service_category}</span>
                            <span className="text-[11px] text-brand-gray-400 block">{b.service_type}</span>
                            <span className="text-[10px] text-brand-gray-400 italic line-clamp-1 mt-0.5">"{b.project_description}"</span>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <span className="text-white block">{new Date(b.preferred_date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-brand-orange font-semibold">{b.preferred_time_slot}</span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border focus:outline-none cursor-pointer ${
                                b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                                b.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                                b.status === 'Completed' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' :
                                b.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                                'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-brand-gray-400">
                          No booking records found matching current filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEW MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Customer Review Moderation
                </h3>
                <p className="text-xs text-brand-gray-300 mt-0.5">
                  Approve genuine reviews for public website display, reject inappropriate spam, and assign verified client status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={reviewStatusFilter}
                  onChange={(e) => setReviewStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-brand-midnight border border-white/10 text-white text-xs"
                >
                  <option value="all">All Reviews</option>
                  <option value="pending">Pending Moderation</option>
                  <option value="approved">Approved & Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl bg-brand-navy/70 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.customer_name}</span>
                        {rev.is_verified && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Verified
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        rev.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        rev.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <div className="text-amber-400 text-xs font-mono">
                      ★ {rev.rating} / 5 • <span className="text-brand-orange">{rev.service_received}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">{rev.review_title}</div>
                      <p className="text-xs text-brand-gray-300 italic leading-relaxed">
                        "{rev.written_feedback}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-brand-gray-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'approved', true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold"
                          >
                            Publish Review
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-gray-400 hover:text-white"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-12 text-center text-brand-gray-400 bg-brand-navy/40 rounded-2xl border border-white/5">
                  No reviews in this moderation state.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS PORTFOLIO */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  Project Gallery Manager
                </h3>
                <p className="text-xs text-brand-gray-300 mt-0.5">
                  Manage showcased engineering installations with real technical specs and photography.
                </p>
              </div>

              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-lg shadow-brand-orange/25 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddProject ? 'Close Form' : 'Add New Project'}</span>
              </button>
            </div>

            {/* Add Project Form Drawer */}
            {showAddProject && (
              <form onSubmit={handleCreateProject} className="p-6 rounded-2xl bg-brand-navy/90 border border-brand-orange/30 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase">New Installation Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. 20kW Rooftop Solar Installation"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1">Category *</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-brand-midnight border border-white/10 text-white text-xs"
                    >
                      <option value="cctv">CCTV Surveillance</option>
                      <option value="solar">Solar Power</option>
                      <option value="hydraulics">Hydraulics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={newProject.location}
                      onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                      placeholder="e.g. Pavoorchatram, Tenkasi"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1">Client Type</label>
                    <input
                      type="text"
                      value={newProject.client_type}
                      onChange={(e) => setNewProject({ ...newProject, client_type: e.target.value })}
                      placeholder="e.g. Commercial Plaza"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-brand-gray-300 mb-1">Image URL *</label>
                    <input
                      type="url"
                      required
                      value={newProject.image_url}
                      onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Provide technical scope..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 text-xs text-brand-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden bg-brand-navy/70 border border-white/10 flex flex-col justify-between">
                  <div className="h-44 relative">
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-brand-midnight/90 text-brand-orange text-[10px] font-mono font-bold uppercase">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-brand-gray-300 line-clamp-2 mt-1">{p.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-brand-gray-400">{p.location}</span>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Company & Operations Configuration
              </h3>
              <p className="text-xs text-brand-gray-300 mt-0.5">
                Update official contact numbers, address, business hours, and compliance identifiers saved in MySQL.
              </p>
            </div>

            {settingsNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{settingsNotice}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-brand-navy/70 border border-white/10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                  Official Business Address
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    GSTIN Registration Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.gstin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                    UDYAM Registration Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.udyam}
                    onChange={(e) => setSettingsForm({ ...settingsForm, udyam: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                  Business & Operating Hours
                </label>
                <input
                  type="text"
                  value={settingsForm.business_hours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, business_hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-brand-gray-300 mb-1 uppercase font-semibold">
                  WhatsApp Contact Number (Without symbols, e.g. 919025672856)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsapp_number}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-lg shadow-brand-orange/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {settingsSaving ? 'Saving Changes...' : 'Update Business Settings in MySQL'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Security & Activity Audit Logs
              </h3>
              <p className="text-xs text-brand-gray-300 mt-0.5">
                Immutable chronological log of administrative logins, customer submissions, and status updates.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 overflow-hidden bg-brand-navy/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-brand-midnight/90 text-brand-gray-400 uppercase text-[11px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-brand-gray-400">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-brand-orange font-bold">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                          </td>
                          <td className="py-3 px-4 text-brand-gray-300 max-w-xs truncate">
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '-'}
                          </td>
                          <td className="py-3 px-4 text-brand-gray-400">
                            {log.ip_address || 'local'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-brand-gray-400">
                          No audit entries recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
