-- Creates the database
DROP DATABASE  IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
-- Implements the database
USE employee_tracker_db;
-- This creates the department table
CREATE TABLE department( 
	ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);
-- This creates the role table.
CREATE TABLE role(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    primary key (id)
);
-- This creates the employee table.
CREATE TABLE employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id VARCHAR(30),
    manager_id INT,
    PRIMARY KEY (id)
);

-- This insets the values into the employee table.
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jim", "Carrey", "Director", null), ("Linda", "Burke", "Office Manager", 1), ("Jason", "Unger", "Web Dev", null ), ("Marshall", "Brett", "Intern", null);

-- This inserts the values into the role table.
INSERT INTO role(title, salary, department_id)
VALUES ("Director", 75000, 1), ("Web Dev", 50000, 2), ("Office Manager", 30000, 3), ("Intern", 20000, 4);

-- This insets the values into the department table.
INSERT INTO department(name)
VALUES ("HR"), ("Tech"), ("Admin"), ("Management");

