-- Schema for the admin-only grades app. Run once: mysql -u root -p < students/schema.sql
CREATE DATABASE IF NOT EXISTS stevegel_students CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stevegel_students;

DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  verification_token CHAR(64) NULL,
  verification_expires DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email),
  KEY idx_admins_verification_token (verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per logged-in device; the token is the Bearer token the client sends
CREATE TABLE sessions (
  token CHAR(64) NOT NULL,
  admin_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (token),
  KEY idx_sessions_admin (admin_id),
  CONSTRAINT fk_sessions_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE classes (
  id INT NOT NULL AUTO_INCREMENT,
  admin_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_classes_admin_name (admin_id, name),
  CONSTRAINT fk_classes_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per student per class. admin_id is denormalized so every query can be scoped with WHERE admin_id = ?
CREATE TABLE students (
  id INT NOT NULL AUTO_INCREMENT,
  class_id INT NOT NULL,
  admin_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  student_number INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  grades MEDIUMTEXT NULL,
  favorites TINYINT(1) NOT NULL DEFAULT 0,
  last_emailed_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_class_number (class_id, student_number),
  KEY idx_students_admin (admin_id),
  CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
  CONSTRAINT fk_students_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
