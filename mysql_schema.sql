-- GlobeTrotter MySQL Schema Migration
-- Aligning database with Node.js backend implementation

-- Drop existing tables if they exist to start fresh
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS trip_stops;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS trip_activities;
DROP TABLE IF EXISTS shared_trips;
DROP TABLE IF EXISTS city_cost_index;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS stop_activities;
DROP TABLE IF EXISTS admin_analytics;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    public_share_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cities and Cost Index (Merged or reference)
CREATE TABLE city_cost_index (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    accommodation_per_day_usd DECIMAL(10,2) DEFAULT 0,
    food_per_day_usd DECIMAL(10,2) DEFAULT 0,
    transport_per_day_usd DECIMAL(10,2) DEFAULT 0,
    cost_index DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (city_name, country)
);

-- Trip Stops table
CREATE TABLE trip_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    city_id INT,
    city_name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    estimated_cost DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Activities catalog
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    typical_duration_hours DECIMAL(5,2),
    min_cost_usd DECIMAL(10,2) DEFAULT 0,
    max_cost_usd DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Activities (linking stops to activities)
CREATE TABLE stop_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_stop_id INT NOT NULL,
    activity_id INT,
    custom_activity_name VARCHAR(255),
    estimated_cost DECIMAL(10,2) DEFAULT 0,
    duration_hours DECIMAL(5,2),
    notes TEXT,
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
);

-- Shared Trips links
CREATE TABLE shared_trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    share_token VARCHAR(100) NOT NULL UNIQUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Budgets / Cost Breakdowns
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL UNIQUE,
    total_accommodation DECIMAL(10,2) DEFAULT 0,
    total_food DECIMAL(10,2) DEFAULT 0,
    total_transport DECIMAL(10,2) DEFAULT 0,
    total_activities DECIMAL(10,2) DEFAULT 0,
    total_estimated_cost DECIMAL(10,2) DEFAULT 0,
    per_day_average DECIMAL(10,2) DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Analytics table
CREATE TABLE admin_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_users INT DEFAULT 0,
    total_trips INT DEFAULT 0,
    total_shares INT DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
