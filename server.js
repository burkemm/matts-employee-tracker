//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3003,
    // This is the localhost username
    user:"root",
    // This is the password for mySQL.
    password: "Wo0denCh@!r",
    database: "employee_tracker_db"
});

function initiate(){
    inquirer
    .prompt([
        {
            type: "list",
            name: "initiate",
            message: "Choose one of the following.",
            choices: ["View", "Add", "Update", "Exit"]
        }
    ]).then (function(res){
        switch(res.initiate){
            case "View":
                view();
                break;
            case "Add":
                add();
                break;
            case "Update":
                updateEmployee();
            break;
            case "Exit":
                console.log("--------------------------------");
                console.log("All done");
                console.log("--------------------------------");
                break;
            default:
                console.log("default");
        }
    });
}

// This is what connects to the SQL Server.
connection.connect(function(err){
    if(err) throw err;
    console.log("SQL connected");

    // This calls on the initiate function to initiate the app.
    initiate();
});
// This function populates a view list giving the user choices on what to view.
function view(){
    inquirer
    .prompt([
        {
            type: "list",
            name: "view",
            message: "Choose one of the following.",
            choices: ["All employees", "By department", "By role",]
        }
    ]).then (function(res){
        switch(res.view){
            case "All employees":
                viewEmployees();
                break;
            case "By department":
                viewByDepartment();
                break;
            case "By role":
                viewByRole();
            default:
                console.log("default");
        }
    });
}

function viewByRole(){
    //this is a query for all roles
      connection.query("SELECT title FROM role", function(err, results){
      if(err) throw err;
      //prompt the user with a choice after all roles have been populated.
      inquirer
      .prompt([
          {
              name: "choice",
              type: "list",
              choices: function(){
                  let choiceArr = [];
                  for(i=0; i< results.length; i++){
                      choiceArr.push(results[i].title);
                  }
                  return choiceArr;
              },
              message: "Select role"
          }
      ]).then(function(answer){
          console.log(answer.choice);
          connection.query(
              "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e. role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE e.role_id =?", [answer.choice], function(err, results)
              {
                  if(err) throw err;
                  console.table(results);
                  initiate();
              }
          )
      })
  })

}

function viewByDepartment(){
    //this queries a database for all departments.
    connection.query("SELECT * FROM department", function(err, results){
        if(err) throw err;
        // This prompts the user which department to choose after all departments is populated.
        inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: function(){
                    let choiceArr = [];
                    for(i=0; i< results.length; i++){
                        choiceArr.push(results[i].name);
                    }
                    return choiceArr;
                },
                message: "Select department"
            }
        ]).then(function(answer){
            connection.query(
                "SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE d.name =?", [answer.choice], function(err, results)
                {
                    if(err) throw err;
                    console.table(results);
                    initiate();
                }
            )
        })
    })

}
// This function queries the employees from the query.sql file and then runs the initiate function.
function viewEmployees(){
    connection.query("SELECT e.id AS ID, e.first_name AS First, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r. department_id = d.id", function(err, results)
    {
        if(err) throw err;
        console.table(results);
        initiate();
    });
}

// This add function is for adding new employees for department, role, employee tables.
function add(){
    inquirer
        .prompt([ 
            {
                type: "list",
                name:"add",
                message: "What would you like to add?",
                choices: ["Department", "Employee role", "Employee",]
            }   
        ]).then(function(res){
            switch(res.add) {
                case "Department":
                    addDepartment();
                    break;
                case "Employee role":
                    addEmployeeRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                default:
                    console.log("default");
            }
        });
    
}
// This function adds a new employee role.
function addEmployeeRole(){
    inquirer
    .prompt([
        {
            name: "role",
            type: "input",
            message: "Enter role title:"
        },
        {
            name: "salary",
            type: "number",
            message: "Enter salary",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "department_id",
            type: "number",
            message: "Enter department id",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.role,
                salary: answer.salary,
                department_id: answer.department_id
            },
            function(err){
                if(err) throw err;
                console.log("--------------------------------");
                console.log("Employee Roles updated with "+ answer.role);
                console.log("--------------------------------");
                initiate();
            }
        )
    })
}
// This function adds a new department
function addDepartment(){
    inquirer
    .prompt([ 
        {
            name:"department",
            type: "input",
            message: "What would you like the department name to be?"
        }   
    ]).then(function(answer){
        connection.query(
        "INSERT INTO department VALUES (DEFAULT, ?)",
            [answer.department],
            function(err){
                if(err) throw err;
                console.log("--------------------------------");
                console.log("Departments updated with "+ answer.department);
                console.log("--------------------------------");
                initiate();
            }
        )
    })
}
// This function adds an employee. It first queries the role table.
function addEmployee(){
    connection.query("Select * From role", function(err, results){
        if(err) throw err;
        // Once all choices are made populate the choice results.
        inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter employee first name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee last name"
            },
            {
                name: "role",
                type: "list",
                choices: function(){
                    var choiceArr = [];
                    for(i=0; i< results.length; i++){
                        choiceArr.push(results[i].title);
                    }
                    return choiceArr;
                },
                message: "Select title"
            },
            {
                name: "manager",
                type: "number",
                validate: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                },
                message: "Enter manager ID",
                default: "1"
            }
        ])
        .then(function(answer){
           // This adds new employee by first name, last name, role_id, manager_id.
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                }
            )
            console.log("--------------------------------");
            console.log("Employee added Successfully"),
            console.log("--------------------------------");
            initiate();
        });
    });
}
// This function is for updating employees.
function updateEmployee(){
    // Select an employee from the employee table to update.
    connection.query("SELECT * FROM employee",
    function(err, results){
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: "choice",
                type: "list",
                choices: function(){
                    let choiceArr = [];
                    for(i=0; i< results.length; i++)
                    {
                        choiceArr.push(results[i].last_name);
                    }
                    return choiceArr;
                },
                message: "Select employee to update"
            }
        ])
        .then(function(answer){
            // This is the employee.
            const saveName = answer.choice;

            connection.query("SELECT * FROM employee",
            function(err, results){
                if(err) throw err;
            inquirer
            .prompt([
                {
                    name: "role",
                    type: "list",
                    choices: function(){
                        let choiceArr = [];
                        for(i=0; i< results.length; i++){
                            choiceArr.push(results[i].role_id);
                        }
                        return choiceArr;
                    },
                    message: "Select title"
                },
                {
                    name: "manager",
                    type: "number",
                    validate: function(value){
                        if(isNaN(value) === false){
                            return true;
                        }
                        return false;
                    },
                    message: "Enter new manager ID",
                    default: "1"
                }
            ]).then(function(answer){
                console.log(answer);
                console.log(saveName);
                connection.query("UPDATE employee SET ? WHERE last_name = ?",
                    [{
                            role_id: answer.role,
                            manager_id: answer.manager
                        }, saveName
                    ],
                ),
                console.log("--------------------------------");
                console.log("Employee updated"),
                console.log("--------------------------------");
                initiate();
            });
        })
    })
})
}