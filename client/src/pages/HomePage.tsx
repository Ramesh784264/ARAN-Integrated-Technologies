import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { ProjectGallery } from '../components/ProjectGallery';
import { HowItWorks } from '../components/HowItWorks';
import { CustomerReviews } from '../components/CustomerReviews';
import { ContactSection } from '../components/ContactSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { TrackBookingModal } from '../components/TrackBookingModal';
import { ReviewModal } from '../components/ReviewModal';

import { fetchServices, fetchProjects, fetchApprovedReviews, fetchPublicSettings } from '../services/api';
import { ServiceItem, ProjectItem, ReviewItem, BusinessSettings } from '../types';

export const HomePage: React.FC = () => {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<string>('CCTV Surveillance');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Data states from backend API
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({});

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [servicesData, projectsData, reviewsData, settingsData] = await Promise.all([
          fetchServices().catch(() => []),
          fetchProjects('all').catch(() => []),
          fetchApprovedReviews().catch(() => []),
          fetchPublicSettings().catch(() => ({}))
        ]);

        if (servicesData) setServices(servicesData);
        if (projectsData) setProjects(projectsData);
        if (reviewsData) setReviews(reviewsData);
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.error('Error loading public data:', err);
      }
    };

    loadPublicData();
  }, []);

  const handleOpenBooking = (category?: string) => {
    if (category) setBookingCategory(category);
    setIsBookingOpen(true);
  };

  const handleExplore = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-gray-100 flex flex-col">
      {/* Sticky Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      <main className="flex-grow">
        {/* Cinematic Hero */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExplore={handleExplore}
        />

        {/* 3 Specialized Engineering Divisions */}
        <ServicesSection
          services={services}
          onBookService={handleOpenBooking}
        />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Engineering Field Portfolio */}
        <ProjectGallery
          projects={projects}
        />

        {/* 3-Step Service Workflow */}
        <HowItWorks
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Customer Reviews & Moderated Feedback */}
        <CustomerReviews
          reviews={reviews}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />

        {/* Official Contact & Field Location */}
        <ContactSection
          settings={settings}
        />

        {/* Mandatory Final Orange-and-Navy CTA Section */}
        <CTASection
          onOpenBooking={() => handleOpenBooking()}
          phone={settings.phone}
          whatsapp={settings.whatsapp_number}
        />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        settings={settings}
        onOpenBooking={handleOpenBooking}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedCategory={bookingCategory}
      />

      <TrackBookingModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
