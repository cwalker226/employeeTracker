const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Lookup0226!",
    database: "company"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

function runSearch(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "Update Employee Role",
                "Add Employee",
                "Add Role",
                "Add Department",
                "exit"
            ]
        }).then(answer => {
            switch(answer.action){
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "exit":
                    connection.end();
                    break;
                default:
                    console.log("You picked wrong!");
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees(){
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.deptName AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                      FROM employee 
                      LEFT JOIN role on employee.role_id = role.id 
                      LEFT JOIN department on role.dept_id = department.id 
                      LEFT JOIN employee manager on manager.id = employee.manager_id;`, function(err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function viewAllRoles(){
    connection.query(`SELECT * FROM role;`, function(err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function viewAllDepartments(){
    connection.query(`SELECT * FROM department;`, function(err, res) {
        if (err) throw err;
        console.table(res);
    });
}

function updateEmpRole(){
    inquirer
        .prompt({
            name: "firstName",
            type: "input",
            message: "What is the first name of the employee you would like to update?"
        },{
            name: "lastName",
            type: "input",
            message: "What is the last name of the employee you would like to update?"
        },{
            name: "role",
            type: "list",
            message: "What new role would you like to assign to the employee?",
            choices: function(){
                connection.query(`SELECT * FROM role;`, function(err, res) {
                    if (err) throw err;
                    return res;
                });
            }
        }).then(answer => {
            connection.query(`UPDATE employee
                            SET role_id = ?
                            WHERE first_name = ? AND last_name = ?`, function(err, res) {
                if (err) throw err;
            });
        });    
}

function addEmployee(){
    inquirer
        .prompt({
            name: "firstName",
            type: "input",
            message: "What is the first name of the new employee?"
        },{
            name: "lastName",
            type: "input",
            message: "What is the last name of the new employee?"
        },{
            name: "role",
            type: "list",
            message: "What role would you like to assign the new employee to?",
            choices: function(){
                connection.query(`SELECT * FROM role;`, function(err, res) {
                    if (err) throw err;
                    return res;
                });
            }
        },{
            name: "dept",
            type: "list",
            message: "What department would you like the assign the new employee to?",
            choices: function() {
                connection.query(`SELECT * FROM department;`, function(err, res) {
                    if (err) throw err;
                    return res;
                });
            }
        }).then(answer => {
            connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
                              VALUES (?, ?, ?, ?);`, function(err, res) {
                if (err) throw err;
            });
        });
}

function addRole(){
    inquirer
        .prompt({
            name: "title",
            type: "input",
            message: "What is the title of the new role?"
        },{
            name: "salary",
            type: "input",
            message: "What is the salary of the new role?"
        },{
            name: "role",
            type: "list",
            message: "What department should this new role be associated to?",
            choices: function(){
                connection.query(`SELECT * FROM role;`, function(err, res) {
                    if (err) throw err;
                });
            }
        }).then(answer => {
            connection.query(`INSERT INTO role(title, salary, dept_id)
                              VALUES(?, ?, ?);`, function(err, res) {
                if (err) throw err;
            });
        });
}

function addDepartment(){
    inquirer
        .prompt({
            name: "deptName",
            type: "input",
            message: "What is the name of the new department?"
        }).then(answer => {
            connection.query(`INSERT INTO department(deptName)
                              VALUES (?);`, function(err, res) {
                if (err) throw err;
            });
        });
}