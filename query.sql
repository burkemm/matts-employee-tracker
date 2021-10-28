SELECT
	e.id AS ID,
    e.first_name AS First,
    e.last_name AS Last,
    e.role_id AS Role,
    r.salary AS Salary,
    m.last_name AS Manager,
    d.name AS Department
    
	-- Join employee to the employee table.
    FROM employee e 
    LEFT join employee m
		ON e.manager_id = m.id
	-- Join role to the role table.
    LEFT JOIN role r 
		ON e.role_id = r.title
    -- Join department to the department table.
    LEFT JOIN department d
		ON r.department_id = d.id