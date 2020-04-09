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
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.deptName, role.salary 
                      FROM employee 
                      JOIN role ON employee.id = role.id 
                      JOIN role.id = department.id`, function(err, res) {
        if (err) throw err;
    });
}

function viewAllRoles(){

}

function viewAllDepartments(){

}

function updateEmpRole(){

}

function addEmployee(){

}

function addRole(){

}

function addDepartment(){

}