const router = require('express').Router()
const Joi = require('@hapi/joi')
const con = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify_route = require('./verify_route')
const verify_role = require('./verify_role')




router.get('/', verify_route, verify_role, (req, res) => {
    con.query("SELECT * FROM users WHERE role = 1", (error, employee, fields) => {
        if (error){
            throw error
        }else{
            const total_employee = Object.keys(employee).length
            con.query("SELECT id, name FROM projects", (error, projects, fields) => {
                if (error){
                    throw error
                }else{
                    const total_projects = Object.keys(projects).length
                    res.render('dashboard', {total_employee: total_employee, employee: employee, total_projects: total_projects, projects: projects})
                }
            })
        }
    })  
})

router.get('/signup', verify_route, verify_role, (req, res) => {
    res.render('signup')
})

router.post('/signup', verify_route, verify_role, (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        designation: Joi.string().required(),
        password: Joi.string().min(5).required(),
        role: Joi.number().required(),
        status: Joi.number().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})

    if(error){
        res.redirect('/admin/signup')
    }else{
        // check if user already exists
        con.query("SELECT COUNT(id) AS id FROM users WHERE email = ?", [value.email], async (error, id, fields) => {
            if(id[0].id > 0){
                return res.status(400).send('Email Already Exists')
            }else{
                // hash password
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(value.password, salt)

                con.query("INSERT INTO users (NAME, email, designation, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
                [value.name, value.email, value.designation, hashPassword, value.role, value.status], (error, result, fields) => {
                    res.redirect('/admin/view_users')
                })
            }
        })
    }
})


//login check
router.post('/logincheck', (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})

    if (error){
        res.redirect('/login')
    }else{
        con.query("SELECT * FROM users WHERE email = ? limit 1", [value.email], async (error, user, fields) => {
            if (Object.keys(user).length == 0){
                return res.status(400).send('Email or Password is wrong')
            }else{
                // comapre password
                const validPassowrd = await bcrypt.compare(value.password, user[0].password)

                if(!validPassowrd){
                    return res.status(400).send('Email or password is wrong')
                }else{
                    const token = jwt.sign({name: user[0].name, id:user[0].id, role: user[0].role}, process.env.TOKEN_SECRET, {expiresIn: '10h'})
                    res.cookie('auth_token', token, {httpOnly: true})
                    res.redirect('/admin/')
                }
            }
        })
    }
})


// get the lists of the users
router.get('/view_users', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name, email, designation, role, status FROM users", (error, users, fields) => {
        res.render('view_users', {users: users})
    })
    
})

// get details of the user
router.get('/view_user/details/:id', verify_route, verify_role, (req, res) => {
    var id = req.params.id 
    con.query("SELECT id, name, email, designation, role, status FROM users where id = ?",[id], (error, user, fields) => {
        if (error){
            throw error
        }else{
            if (user[0].role == 0){
                user[0].role = "Admin"
            }else{
                user[0].role = "Employee"
            }
            con.query("SELECT user_details.task_done, user_details.task_to_do, DATE_FORMAT(user_details.work_date, '%b %d, %Y %a %k:%i:%s') AS work_date FROM user_details, users WHERE user_details.user_id = users.id AND user_details.user_id = ? ORDER BY user_details.work_date DESC",
            [id], (error, user_details, fields) => {
                res.render('view_user_details', {user: user[0], user_details: user_details})
            })
        }
    })
})


// edit user
router.get('/edit/user/:id', verify_route, verify_role, (req, res) => {
    var id = req.params.id
    con.query("SELECT * FROM users WHERE id = ?", [id], (error, user, fields) => {
        res.render("edit_user", {user: user[0]})
    })
})

router.post('/edit/user', verify_route, verify_role, (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        designation: Joi.string().required(),
        role: Joi.number().required(),
        status: Joi.number().required(),
        id: Joi.number().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})
    
    if(error){
        console.log(error)
        res.redirect('/admin/signup')
    }else{
                con.query("UPDATE users SET name = ?, email = ?, designation = ?, role = ?, status = ? WHERE id = ?",
                [value.name, value.email, value.designation, value.role, value.status, value.id], (error, result, fields) => {
                   console.log(value)
                    if (error){
                        throw error
                    }else{
                        res.redirect('/admin/view_users')
                    }
                })
            
    }
})

router.get('/inactive/user/:id', verify_route, verify_role, (req, res) => {
    con.query("UPDATE users SET status = 0 WHERE id = ?", [req.params.id], (error, result, fields) => {
        if (error){
            throw error
        }else{
            res.redirect('/admin/view_users')
        }
    })
})

router.get('/inactive_users', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name, email, designation, role, status FROM users WHERE status = 0", (error, users, fields) => {
        res.render('inactive_users', {users: users})
    })
})
router.get('/active/user/:id', verify_route, verify_role, (req, res) => {
    con.query("UPDATE users SET status = 1 WHERE id = ?", [req.params.id], (error, result, fields) => {
        if (error){
            throw error
        }else{
            res.redirect('/admin/view_users')
        }
    })
})

// projects
// add new projects
router.get('/add_project', verify_route, verify_role, (req, res) => {
    res.render('add_project')
})

router.post('/add_project', verify_route, verify_role, (req, res) => {
    const schema = Joi.object({
        project_name: Joi.string().required(),
        frontend_language: Joi.string().required(),
        backend_language: Joi.string().required(),
        project_details: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})
    if (error){
        throw error
    }else{
        con.query("INSERT INTO projects (NAME, frontend, backend, details) VALUES (?, ?, ?, ?)",
        [value.project_name, value.frontend_language, value.backend_language, value.project_details], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.send("Saved Successfully")
            }
        })
    }
})


router.get('/add_project_todo', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name FROM projects", (error, projects, fields) => {
        if (error){
            throw error
        }else{
            res.render('add_project_todo', {projects: projects})
        }
    })
})

router.post('/add_project_todo', verify_route, verify_role, (req, res) => {
    console.log(req.body)
    let project_id = req.body.project
    console.log(req.body["project_todo" + 1])
    con.beginTransaction((err) => {
        if (err){
            throw err
        }else{
            for(let i = 0; i < Object.keys(req.body).length; i++){
                if (i == 0){
                    continue
                }else{
                    let todo = req.body["project_todo" + i]
                    console.log(todo)
                    con.query("INSERT INTO projects_todo (todo, project_id) VALUES (?, ?)",
                    [todo, project_id], (error, results, fields) => {
                        if(error){
                            return con.rollback(() => {
                                throw error
                            })
                        }
                    })
                }
            }
            con.commit((err) => {
                return con.rollback(() => {
                    throw err
                })
            })
            return res.json("Saved Successfully")

        }
        
    })
})

router.get('/project_todos/:id', verify_route, verify_role, (req, res) => {
    let project_id = req.params.id
    con.query("SELECT id, todo, status FROM projects_todo WHERE project_id = ?",[project_id],
    (error, todos, fields) => {
        // console.log(todos)
        return res.json(todos)
    })
})


router.get('/assign_programmer', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name FROM users WHERE STATUS = 1", (error, users, fields) => {
        if (error){
            throw error
        }else{
            con.query("SELECT id, name FROM projects WHERE STATUS = 1", (error, projects, fields) => {
                if (error){
                    throw error
                }
                res.render('assign_programmer', {users: users, projects: projects})
            })
        }
    })
})

// assign todos and and project to programmer
router.post('/assign_programmer', verify_route, verify_role, (req, res) => {
    con.beginTransaction((err) => {
        if (err){
            throw err
        }else{
            con.query("INSERT INTO assigned_projects (user_id, designation, project_id) VALUES (?, ?, ?)",
            [req.body.programmer, req.body.designation, req.body.project], (error, results, fields) => {
                if (error){
                    return con.rollback(() => {
                        throw error
                    })
                }
                // console.log(results)
                let project_todo = req.body.project_todo
                // console.log(project_todo)
                for(let i = 0; i < project_todo.length; i++){
                    con.query("INSERT INTO assigned_todos (assigned_projects_id, assigned_todo) VALUES (?, ?)",
                    [results.insertId, project_todo[i]], (error, result1, fields) => {
                        if (error){
                            return con.rollback(() => {
                                throw error
                            })
                        }
                    })
                }
                con.commit((err) => {
                    if (err){
                        return con.rollback(() => {
                            throw err
                        })
                    }
                    return res.json("Saved Successfully")
                })
            })
        }  
    })
})

// view all todos
router.get('/view_todos', verify_route, verify_role, (req, res) => {
    res.render('view_todos')
})

module.exports = router