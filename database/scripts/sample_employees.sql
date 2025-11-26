-- Sample Employee Data for Testing
-- Run this SQL script to add some sample employees to test the authentication

INSERT INTO employees (first_name, last_name, email, title, department) VALUES
('John', 'Doe', 'john.doe@example.com', 'Software Engineer', 'IT'),
('Jane', 'Smith', 'jane.smith@example.com', 'Project Manager', 'IT'),
('Alice', 'Johnson', 'alice.johnson@example.com', 'HR Manager', 'Human Resources'),
('Bob', 'Wilson', 'bob.wilson@example.com', 'Finance Manager', 'Finance'),
('Charlie', 'Brown', 'charlie.brown@example.com', 'System Administrator', 'IT');

-- Add your own Google email here to test OAuth authentication
INSERT INTO employees (first_name, last_name, email, title, department) VALUES
('Aayank', 'Singhai', 'aayanksinghai02@gmail.com', 'SDE', 'Outreach');

