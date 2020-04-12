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
                      LEFT JOIN employee manager on manager.id = employee.manager_id;`, function(err, result) {
        if (err) throw err;
        console.table(result);
        runSearch();
    });
}

function viewAllRoles(){
    connection.query(`SELECT * FROM role;`, function(err, result) {
        if (err) throw err;
        console.table(result);
        runSearch();
    });
}

function viewAllDepartments(){
    connection.query(`SELECT * FROM department;`, function(err, result) {
        if (err) throw err;
        console.table(result);
        runSearch();
    });
}

function updateEmpRole(){
    getEmployeeList(function (err, choices) {
        inquirer.prompt({
            name: "employee",
            type: "list",
            message: "Which employee would you like to update their role?",
            choices: choices
        }).then(answer => {
            const employeeID = answer.employee.substring(0, answer.employee.indexOf(" |"));
            getRoleList(function (err, choices2) {
                inquirer
                .prompt({
                    name: "role",
                    type: "list",
                    message: "What new role would you like to assign to the employee?",
                    choices: choices2
                }).then(answer2 => {
                    const roleID = answer2.role.substring(0, answer2.role.indexOf(" |"));
                    connection.query(`UPDATE employee
                                    SET role_id = ?
                                    WHERE id = ?`, [roleID, employeeID], function(err, result) {
                        if (err) throw err;
                        console.table(result);
                        runSearch();
                    });
                }); 
            });
        });
    });
    
}

function addEmployee(){
    getRoleList(function (err, choices) {
        inquirer
            .prompt([{
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
                choices: choices
            },{
                name: "assignManager",
                type: "confirm",
                message: "Should this employee be assigned a manager?"
            }]).then(answer => {
                const roleID = answer.role.substring(0, answer.role.indexOf(" |"));
                if(answer.assignManager) {
                    getEmployeeList(function (err, choices2) {
                        inquirer.prompt({
                            name: "manager",
                            type: "list",
                            message: "Who should be the new employee's manager?",
                            choices: choices2
                        }).then(answer2 => {
                            const managerID = answer2.manager.substring(0, answer2.manager.indexOf(" |"));
                            connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
                                              VALUES (?, ?, ?, ?);`, [answer.firstName, answer.lastName, roleID, managerID], function(err, result) {
                                if (err) throw err;
                                console.table(result);
                                runSearch();
                            });
                        });
                    });
                } else {
                    connection.query(`INSERT INTO employee(first_name, last_name, role_id)
                                      VALUES (?, ?, ?);`, [answer.firstName, answer.lastName, roleID], function(err, result) {
                        if (err) throw err;
                        console.table(result);
                        runSearch();
                    });
                }
                
            });
    });
}

function addRole(){
    getDepartmentList(function (err, choices) {
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
            },{
                name: "salary",
                type: "input",
                message: "What is the salary of the new role?"
            },{
                name: "dept",
                type: "list",
                message: "What department would you like the new role under?",
                choices: choices
            }]).then(answer => {
                const deptID = answer.dept.substring(0, answer.dept.indexOf(" |"));
                connection.query(`INSERT INTO role(title, salary, dept_id)
                                VALUES(?, ?, ?);`, [answer.title, answer.salary, deptID], function(err, result) {
                    if (err) throw err;
                    console.table(result);
                    runSearch();
                });
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
                              VALUES (?);`, [answer.deptName], function(err, result) {
                if (err) throw err;
                console.table(result);
                runSearch();
            });
        });
}

function getEmployeeList(cb) {
    connection.query(`SELECT id, first_name, last_name FROM employee`, function(err, result) {
        const empList = [];
        if(err){
            cb(err);
            return;
        }
        result.forEach(ele => {
            empList.push(`${ele.id} | ${ele.first_name} ${ele.last_name}`);
        });
        cb(null, empList);
    });
}

function getRoleList(cb){
    connection.query(`SELECT id, title FROM role;`, function(err, result) {
        const roleList = [];
        if (err) {
            cb(err);
            return;
        }
        result.forEach(element => {
            roleList.push(`${element.id} | ${element.title}`);
        });
        cb(null, roleList);
    });
}

function getDepartmentList(cb) {
    connection.query(`SELECT id, deptName FROM department;`, function(err, result) {
        const deptList = [];
        if (err) {
            cb(err);
            return;
        }
        result.forEach(ele => {
            deptList.push(`${ele.id} | ${ele.deptName}`);
        });
        cb(null, deptList);
    });
}