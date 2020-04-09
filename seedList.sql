USE company;

INSERT INTO department (deptName)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, dept_id)
VALUES ("Sales Lead", 100000, 1),
		("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 1250000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);
        
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES	("John", "Doe", 1, NULL),
		("Mike", "Chan", 2, 1),
        ("Ashley", "Rodriguez", 3, NULL),
        ("Kevin", "Tupik", 4, 3),
        ("Kunal", "Singh", 5, NULL),
        ("Malia", "Brown", 6, 5),
        ("Sarah", "Lourd", 7, NULL),
        ("Tom", "Allen", 8, 7);
        
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.deptName, role.salary 
                      FROM employee JOIN role ON employee.id = role.id 
                      JOIN department ON role.id = department.id;