DROP DATABASE IF EXISTS company;

CREATE DATABASE company;

USE company;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
    deptName VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(2),
    dept_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(dept_id)
		REFERENCES department(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(role_id, manager_id)
		REFERENCES role(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);