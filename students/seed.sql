-- Demo data. Run after schema.sql: mysql -u root -p < students/seed.sql
-- Logins (already verified): admin@example.com / admin (E2E projectA), userb@example.com / userb-pass (E2E projectB)
USE stevegel_students;

INSERT INTO admins (id, email, password_hash, is_verified) VALUES
  (1, 'admin@example.com', '$2a$10$crs3lKK29YwfNyrrxp5i9uAQN/csbiQr.V2Is5rF0HfaVJhQGwTg6', 1),
  (2, 'userb@example.com', '$2a$10$BnvEoUYydQyat.JXzrBIEumQbwSvQV3vSU6G6TYihmyyLjb6ooENa', 1);

INSERT INTO classes (id, admin_id, name) VALUES
  (1, 1, 'Math 101'),
  (2, 1, 'English 201');

INSERT INTO students (class_id, admin_id, name, student_number, email, grades) VALUES
  (1, 1, 'Dana Levi', 1, 'dana@example.com', 'Algebra: 92, Geometry: 88'),
  (1, 1, 'Noam Cohen', 2, 'noam@example.com', 'Algebra: 75, Geometry: 81'),
  (2, 1, 'Dana Levi', 1, 'dana@example.com', 'Essay: 95');
