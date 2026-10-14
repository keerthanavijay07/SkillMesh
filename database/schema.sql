-- ============================================================
-- SkillMesh – Database Schema & Seed Data
-- Subject: CS23531 Web Programming
-- Relational Database: MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS skillmesh_db;
USE skillmesh_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    role VARCHAR(100) NOT NULL,
    avatar_color VARCHAR(20) DEFAULT '#1a6cf6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'Technical'
);

-- 3. Student Skills Mapping (Many-to-Many with proficiency)
CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    skill_level INT NOT NULL CHECK (skill_level BETWEEN 1 AND 100),
    level_label VARCHAR(30) DEFAULT 'Intermediate',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_skill (student_id, skill_id)
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    required_team_size INT NOT NULL DEFAULT 4,
    status VARCHAR(30) DEFAULT 'Active',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES students(id) ON DELETE CASCADE
);

-- 5. Project Required Skills (Target thresholds for rule-based analysis)
CREATE TABLE IF NOT EXISTS project_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level INT NOT NULL DEFAULT 70,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_skill (project_id, skill_id)
);

-- 6. Team Members (Many-to-Many between projects and students)
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    student_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_member (project_id, student_id)
);

-- 7. Collaboration Requests (Privacy-safe student recruitment)
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    from_student_id INT NOT NULL,
    to_student_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (from_student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (to_student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED SAMPLE DATA FOR VIVA DEMONSTRATION
-- ============================================================

-- Master Skills
INSERT INTO skills (id, name, category) VALUES
(1, 'Frontend', 'Technical'),
(2, 'Backend', 'Technical'),
(3, 'Database', 'Technical'),
(4, 'JavaScript', 'Technical'),
(5, 'ReactJS', 'Technical'),
(6, 'PHP', 'Technical'),
(7, 'UI/UX', 'Design'),
(8, 'Machine Learning', 'AI/Data'),
(9, 'Cloud', 'Infrastructure'),
(10, 'Agriculture', 'Domain'),
(11, 'Python', 'Technical'),
(12, 'DevOps', 'Infrastructure'),
(13, 'Figma', 'Design'),
(14, 'MySQL', 'Technical'),
(15, 'Research', 'Domain')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Students (Passwords hashed: 'password123')
INSERT INTO students (id, name, student_id, email, password_hash, department, year, role, avatar_color) VALUES
(1, 'Arjun Kumar', 'CS21001', 'arjun@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '3rd Year', 'Frontend Developer', '#1a6cf6'),
(2, 'Priya Sharma', 'DS21015', 'priya@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Design', '3rd Year', 'UI/UX Designer', '#9c27b0'),
(3, 'Rahul Verma', 'AE21032', 'rahul@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Agriculture Engineering', '4th Year', 'Domain Expert', '#2e7d32'),
(4, 'Karthik Rajan', 'CS21008', 'karthik@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '4th Year', 'Backend Developer', '#e65100'),
(5, 'Meena Lakshmi', 'IT21044', 'meena@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Information Technology', '4th Year', 'Cloud Engineer', '#00838f'),
(6, 'Sanjay Patel', 'CS21022', 'sanjay@skillmesh.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Computer Science', '3rd Year', 'Full Stack & ML Developer', '#6a1b9a')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Student Skills
INSERT INTO student_skills (student_id, skill_id, skill_level, level_label) VALUES
(1, 1, 92, 'Expert'),
(1, 4, 90, 'Expert'),
(1, 5, 88, 'Advanced'),
(1, 2, 65, 'Intermediate'),
(1, 7, 50, 'Intermediate'),
(2, 7, 92, 'Expert'),
(2, 13, 90, 'Expert'),
(2, 1, 75, 'Advanced'),
(3, 10, 90, 'Expert'),
(3, 15, 85, 'Advanced'),
(3, 11, 60, 'Intermediate'),
(4, 2, 94, 'Expert'),
(4, 6, 90, 'Expert'),
(4, 3, 92, 'Expert'),
(5, 9, 88, 'Advanced'),
(5, 12, 80, 'Advanced'),
(5, 2, 75, 'Advanced'),
(6, 1, 75, 'Advanced'),
(6, 3, 70, 'Advanced'),
(6, 7, 65, 'Advanced'),
(6, 8, 85, 'Advanced'),
(6, 11, 80, 'Advanced')
ON DUPLICATE KEY UPDATE skill_level=VALUES(skill_level);

-- Projects
INSERT INTO projects (id, name, description, category, required_team_size, status, created_by) VALUES
(1, 'Smart Agriculture Platform', 'An IoT-based platform for smart farming with real-time sensor monitoring, crop health tracking, automated irrigation control, and yield prediction using rule-based analysis.', 'AgriTech', 5, 'Active', 1),
(2, 'Campus Event Management System', 'A full-stack web application to manage college events, student registrations, volunteer coordination, and post-event feedback collection.', 'EdTech', 4, 'Planning', 1),
(3, 'Student Health Tracker', 'A web portal helping students log daily health metrics, get wellness tips, and track their mental and physical wellbeing throughout the semester.', 'HealthTech', 4, 'Planning', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Project Required Skills
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(1, 1, 70), -- Frontend
(1, 2, 75), -- Backend
(1, 3, 70), -- Database
(1, 8, 60), -- ML
(1, 7, 65), -- UI/UX
(1, 10, 70), -- Agriculture Domain
(1, 9, 60),  -- Cloud
(2, 1, 70), -- Frontend
(2, 2, 70), -- Backend
(2, 3, 65), -- Database
(2, 7, 60), -- UI/UX
(2, 4, 65), -- JavaScript
(3, 1, 65), -- Frontend
(3, 2, 70), -- Backend
(3, 3, 65), -- Database
(3, 7, 70), -- UI/UX
(3, 8, 55)  -- Data Analysis / ML
ON DUPLICATE KEY UPDATE required_level=VALUES(required_level);

-- Team Members
INSERT INTO team_members (project_id, student_id) VALUES
(1, 1),
(1, 4),
(1, 6),
(2, 1),
(2, 2),
(2, 4),
(3, 2),
(3, 6)
ON DUPLICATE KEY UPDATE project_id=VALUES(project_id);

-- Collaboration Requests
INSERT INTO collaboration_requests (id, project_id, from_student_id, to_student_id, message, status) VALUES
(1, 1, 2, 1, 'Hi Arjun! I saw your team needs a UI/UX designer for the Smart Agriculture Platform. Would love to join!', 'pending'),
(2, 1, 5, 1, 'Hello! I specialise in Cloud & DevOps and noticed your project needs cloud coverage.', 'accepted')
ON DUPLICATE KEY UPDATE message=VALUES(message);
