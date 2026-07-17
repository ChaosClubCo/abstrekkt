insert into users (email, role) values
('student@example.com','student'),
('teacher@example.com','teacher'),
('owner@example.com','owner'),
('admin@example.com','admin')
on conflict do nothing;
