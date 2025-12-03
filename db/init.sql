-- MySQL init script: creates schema and seeds data on first container start
-- Uses env-provisioned database name created by MYSQL_DATABASE

-- Ensure we use the target DB (created by MYSQL_DATABASE)
-- Note: docker entrypoint sets the default DB to MYSQL_DATABASE during init
-- For safety, explicitly USE when available
USE personal_task_db;

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(191) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  subject VARCHAR(191) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Not Started',
  user_id INT NOT NULL,
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id)
    REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed minimal data (idempotent inserts)
INSERT IGNORE INTO user (id, name, email, password)
VALUES
  (1, 'Demo User', 'demo@example.com', '$2b$10$H8xzF4e4P7ZgQ8bCEK8PLOeQ1k2vF2W8V9EwS7bG9VZk9X6pYp9Z2');
-- The password here is a bcrypt hash placeholder; replace via app registration if needed

INSERT IGNORE INTO tasks (id, title, subject, description, due_date, status, user_id)
VALUES
  (1, 'Math Homework', 'Mathematics', 'Complete algebra exercises', '2026-08-12', 'Overdue', 1),
  (2, 'Science Project', 'Science', 'Build AI model', '2026-12-19', 'In Progress', 1);

