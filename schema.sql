-- =============================================================================
-- Academic Student Information System - Database Schema
-- Aligned with: students.xml, students.dtd, and students.xsd specifications
-- =============================================================================

-- =============================================================================
-- Step 1: Create and Select Database
-- =============================================================================
CREATE DATABASE IF NOT EXISTS student_info_db;
USE student_info_db;

-- =============================================================================
-- Option 1: Standard Canonical Relational Schema (MySQL / PostgreSQL / SQLite)
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(10) PRIMARY KEY CHECK (id REGEXP '^S[0-9]{3,}$'),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL CHECK (
        department IN (
            'Computer Engineering',
            'Information Technology',
            'Electronics',
            'CE',
            'IT',
            'EXTC'
        )
    ),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    marks DECIMAL(5, 2) NOT NULL CHECK (marks BETWEEN 0.0 AND 100.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for optimal lookup performance
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_students_semester ON students(semester);
CREATE INDEX idx_students_marks ON students(marks);

-- Initial Canonical Seed Data (Matching students.xml baseline dataset)
INSERT INTO students (id, name, email, department, semester, marks) VALUES
('S101', 'Aarav Sharma', 'aarav.sharma@engg.edu', 'Computer Engineering', 6, 88.00),
('S102', 'Neha Patel', 'neha.patel@engg.edu', 'Information Technology', 4, 92.00),
('S103', 'Rohan Mehta', 'rohan.mehta@engg.edu', 'Electronics', 6, 74.00),
('S104', 'Pooja Verma', 'pooja.verma@engg.edu', 'Computer Engineering', 8, 65.00),
('S105', 'Siddharth Rao', 'siddharth.rao@engg.edu', 'Information Technology', 2, 38.00)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    email=VALUES(email),
    department=VALUES(department),
    semester=VALUES(semester),
    marks=VALUES(marks);

-- =============================================================================
-- Option 2: 3NF Enterprise Multi-Table Normalized Schema
-- =============================================================================

-- 1. Departments Lookup Table
CREATE TABLE IF NOT EXISTS departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_code VARCHAR(10) NOT NULL UNIQUE,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Enrolled Students Registry
CREATE TABLE IF NOT EXISTS student_registry (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    dept_id INT NOT NULL,
    current_semester INT NOT NULL DEFAULT 1 CHECK (current_semester BETWEEN 1 AND 8),
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. Academic Semester Performance / Evaluations Table
CREATE TABLE IF NOT EXISTS academic_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    marks DECIMAL(5, 2) NOT NULL CHECK (marks BETWEEN 0.0 AND 100.0),
    grade VARCHAR(2) GENERATED ALWAYS AS (
        CASE 
            WHEN marks >= 90 THEN 'O'
            WHEN marks >= 75 THEN 'A'
            WHEN marks >= 60 THEN 'B'
            WHEN marks >= 40 THEN 'C'
            ELSE 'F'
        END
    ) STORED,
    result_status VARCHAR(10) GENERATED ALWAYS AS (
        CASE WHEN marks >= 40 THEN 'PASS' ELSE 'FAIL' END
    ) STORED,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_registry(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_student_semester (student_id, semester)
);

-- Seed Data for Normalized Model
INSERT INTO departments (dept_code, dept_name) VALUES
('CE', 'Computer Engineering'),
('IT', 'Information Technology'),
('EXTC', 'Electronics')
ON DUPLICATE KEY UPDATE dept_name=VALUES(dept_name);
