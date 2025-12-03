CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subject VARCHAR(255),
    description TEXT,
    due_date DATE,
    status VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

INSERT INTO user (name, email, password) 
VALUES ('JOJO', 'jojo@gmail.com', '$2b$10$nmKs0mm9MNM4E.n72pD4sODhHNbzZ/8mGUsFD9UcdC5i6F8Qdyv.m');

INSERT INTO tasks (user_id, title, subject, description, due_date, status)
VALUES
(1, 'Math Homework', 'Mathematics', 'Complete algebra exercises', '2026-08-12', 'Overdue'),
(1, 'Science Project', 'Science', 'Build AI model', '2026-12-19', 'In Progress');
