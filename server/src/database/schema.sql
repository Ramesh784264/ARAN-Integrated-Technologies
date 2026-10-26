-- ARAN Integrated Technologies Database Schema

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL, -- 'cctv', 'solar', 'hydraulics'
  title VARCHAR(200) NOT NULL,
  tagline VARCHAR(255),
  description TEXT NOT NULL,
  features JSON,
  specs JSON,
  image_url VARCHAR(500),
  icon_name VARCHAR(80),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_ref VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  service_category VARCHAR(80) NOT NULL,
  service_type VARCHAR(150) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_slot VARCHAR(60) NOT NULL,
  service_address TEXT NOT NULL,
  project_description TEXT NOT NULL,
  budget_range VARCHAR(100),
  consent BOOLEAN NOT NULL DEFAULT TRUE,
  status ENUM('Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ref (booking_ref),
  INDEX idx_status (status),
  INDEX idx_date (preferred_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  service_received VARCHAR(120) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(200) NOT NULL,
  written_feedback TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT TRUE,
  status ENUM('pending', 'approved', 'rejected', 'archived') DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  moderated_by INT NULL,
  moderated_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  FOREIGN KEY (moderated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'cctv', 'solar', 'hydraulics'
  description TEXT NOT NULL,
  client_type VARCHAR(100),
  location VARCHAR(150),
  image_url VARCHAR(500) NOT NULL,
  completion_date VARCHAR(50),
  technical_specs JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_group VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_date DATE NOT NULL,
  time_slot VARCHAR(60) NOT NULL,
  max_bookings INT DEFAULT 3,
  booked_count INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_date_slot (slot_date, time_slot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NULL,
  details JSON NULL,
  ip_address VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
