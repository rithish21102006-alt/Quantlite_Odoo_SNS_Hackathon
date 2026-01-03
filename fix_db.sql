CREATE DATABASE IF NOT EXISTS globetrotter_planning;
CREATE USER IF NOT EXISTS 'globetrotter_user'@'localhost' IDENTIFIED BY 'travel_pass_123';
GRANT ALL PRIVILEGES ON globetrotter_planning.* TO 'globetrotter_user'@'localhost';
FLUSH PRIVILEGES;
