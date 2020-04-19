const router = require('express').Router()
const Joi = require('@hapi/joi')
const con = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify_route = require('./verify_route')
const verify_role = require('./verify_role')
const multer = require('multer')


// for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/todo/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ '-' +file.originalname)
    }
})

// for file filter
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf'){
        cb(null, true)
    }else{
        cb("File type is not valid. Only allowed image or pdf", false)
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
})

 


// load admin page
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


// load signup page
router.get('/signup', verify_route, verify_role, (req, res) => {
    res.render('signup')
})


// add users
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
                if (error){
                    throw error
                }else{
                    con.query("SELECT projects.id, projects.name FROM projects JOIN assigned_projects ON projects.id = assigned_projects.project_id JOIN users ON users.id = assigned_projects.user_id AND users.id = ? GROUP BY projects.name ORDER BY projects.name ASC",
                    [id], (error, projects, fields) => {
                        if (error){
                            throw error
                        }else{
                            res.render('view_user_details', {user: user[0], user_details: user_details, projects: projects})
                        }
                    })
                }
               
            })
        }
    })
})


// load edit page for user
router.get('/edit/user/:id', verify_route, verify_role, (req, res) => {
    var id = req.params.id
    con.query("SELECT * FROM users WHERE id = ?", [id], (error, user, fields) => {
        res.render("edit_user", {user: user[0]})
    })
})


// edit user details
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
        // console.log(error)
        res.redirect('/admin/signup')
    }else{
                con.query("UPDATE users SET name = ?, email = ?, designation = ?, role = ?, status = ? WHERE id = ?",
                [value.name, value.email, value.designation, value.role, value.status, value.id], (error, result, fields) => {
                //    console.log(value)
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


// view inactive users
router.get('/inactive_users', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name, email, designation, role, status FROM users WHERE status = 0", (error, users, fields) => {
        res.render('inactive_users', {users: users})
    })
})


// view active users
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


// add project
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
                res.redirect('/admin/')
            }
        })
    }
})

// view project lists
router.get('/project_details', verify_route, verify_role, (req, res) => {
    con.query("SELECT * FROM projects ORDER BY STATUS DESC", (error, project_details, fields) => {
        if(error){
            throw error
        }else{
            for(let i = 0; i < Object.keys(project_details).length; i++){
                project_details[i]['short_details'] = project_details[i]['details'].substring(0, 100) + '...'
            }
            res.render('project_list', {project_details: project_details})
        }
    })

})

// view details of particular project
router.get('/project_details/:id', verify_route, verify_role, (req, res) => {
    con.query("SELECT * FROM projects WHERE id = ?", [req.params.id], (error, project, fields) => {
        if (error){
            throw error
        }else{
            con.query("SELECT users.name, assigned_projects.designation FROM users, assigned_projects WHERE assigned_projects.project_id = ? AND assigned_projects.user_id = users.id",
            [req.params.id], (error, assigned_users, fields) => {
                if (error){
                    throw error
                }else{
                    res.render('view_project_details', {project: project[0], assigned_users: assigned_users})
                }
            })
        }
    })
})

//edit project details of particular project
router.get('/edit/project_details/:id', verify_route, verify_role, (req, res) => {
    con.query("SELECT * FROM projects WHERE id = ?", [req.params.id], (error, project, fields) => {
        if (error){
            throw error
        }else{
            res.render('edit_project_details', {project: project[0]})  
        }
    })
    
})


// route to edit project details
router.post('/edit/project_details', verify_route, verify_role, (req, res) => {
    const schema = Joi.object({
        project_name: Joi.string().required(),
        frontend_language: Joi.string().required(),
        backend_language: Joi.string().required(),
        project_details: Joi.string().required(),
        status: Joi.number().required(),
        project_id: Joi.number().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})
    if (error){
        throw error
    }else{
        con.query("UPDATE projects SET NAME = ?, frontend = ?, backend = ?, details = ?, STATUS = ? WHERE id = ?",
        [value.project_name, value.frontend_language, value.backend_language, value.project_details, value.status, value.project_id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.redirect('/admin/project_details/'+value.project_id)
            
            }
        })
    }
})


// load add project todo page with project names
router.get('/add_project_todo', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name FROM projects", (error, projects, fields) => {
        if (error){
            throw error
        }else{
            res.render('add_project_todo', {projects: projects})
        }
    })
})

let cpUpload = upload.fields([
    {name:'attachment1'},
    {name:'attachment2'},
    {name:'attachment3'},
    {name:'attachment4'},
    {name:'attachment5'},
    {name:'attachment6'},
    {name:'attachment7'},
    {name:'attachment8'},
    {name:'attachment9'},
    {name:'attachment10'},
    {name:'attachment11'}
])
// add project todos
router.post('/add_project_todo', cpUpload, verify_route, verify_role, (req, res) =>{
    let project_id = req.body.project

    // console.log(req.body)
    // console.log(req.files.attachment3 ? true: false)
    con.beginTransaction((err) => {
        if (err){
            throw err
        }else{
            for(let i = 1; i <= (Object.keys(req.body).length - 1) / 2; i++){
                if (i == 0){
                    continue
                }else{
                    let todo = req.body["project_todo" + i]
                    let description = req.body["project_description" + i]
                    let file_name = 'attachment' + i
                    // console.log(req.files[file_name])
                    let file = req.files[file_name] ? req.files[file_name][0].filename : '' 
                    let user_id = req.user_id
                    var date = new Date()
                    var formattedDate = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-" + date.getDate() +" "+ date.getHours() +":"+ date.getMinutes()+":"+date.getSeconds()

                    if(todo.length == 0 || description.length == 0){
                        continue
                    }else{  
                        
                        con.query("INSERT INTO projects_todo (todo, description, file, project_id, user_id, owner_id, date_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [todo, description, file, project_id, user_id, user_id, formattedDate], (error, results, fields) => {
                                if(error){
                                    return con.rollback(() => {
                                        throw error
                                    })
                                }
                        })
                    }
                    
                }
            }
            con.commit((err) => {
                if(err){
                    return con.rollback(() => {
                        throw err
                    })
                }
                return res.redirect('/admin/add_project_todo')
            })
           
        }
        
    })
})

// get all project todos
router.get('/project_todos/:id', verify_route, verify_role, (req, res) => {
    let project_id = req.params.id
    con.query("SELECT id, todo, status FROM projects_todo WHERE project_id = ?",[project_id],
    (error, todos, fields) => {
        // console.log(todos)
        return res.json(todos)
    })
})

// get not assigned project todos
router.get('/not_assigned/project_todos/:id', verify_route, verify_role, (req, res) => {
    let project_id = req.params.id
    con.query("SELECT projects_todo.id, projects_todo.todo, projects_todo.status FROM projects_todo WHERE projects_todo.project_id = ? AND NOT EXISTS (SELECT assigned_todos.assigned_todo FROM assigned_todos WHERE projects_todo.id = assigned_todos.assigned_todo)",
    [project_id], (error, todos, fields) => {
        return res.json(todos)
    })
})


// load the assign programmer page with some details
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
                // console.log(typeof(project_todo))
                if (typeof(project_todo) == "object"){
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
                }else{
                    con.query("INSERT INTO assigned_todos (assigned_projects_id, assigned_todo) VALUES (?, ?)",
                    [results.insertId, project_todo], (error, result1, fields) => {
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
                    res.redirect('/admin/')
                })
            })
        }  
    })
})

// view all todos
router.get('/view_todos/:project_id', verify_route, verify_role, (req, res) => {
    con.query("SELECT projects_todo.project_id AS project_id, projects_todo.id AS projects_todo_id, assigned_projects.id AS assigned_projects_id, assigned_todos.id AS assigned_todos_id, projects_todo.id, projects_todo.todo, projects_todo.status, assigned_projects.designation, users.name, projects.name as project_name FROM assigned_projects JOIN assigned_todos ON  assigned_todos.assigned_projects_id = assigned_projects.id AND assigned_projects.project_id = ? JOIN projects_todo ON assigned_todos.assigned_todo = projects_todo.id JOIN users ON users.id = assigned_projects.user_id JOIN projects ON projects.id = assigned_projects.project_id ORDER BY users.name ASC", 
    [req.params.project_id], (error, todos, fields) => {
        if(error){
            throw error
        }else{
            // console.log(todos)
            if(Object.keys(todos).length == 0){
                con.query("SELECT projects_todo.id, projects_todo.todo FROM projects_todo WHERE projects_todo.project_id = ? AND NOT EXISTS (SELECT assigned_todos.assigned_todo FROM assigned_todos WHERE projects_todo.id = assigned_todos.assigned_todo)",
                [req.params.project_id], (error, todos_not_assigned, fields) => {
                res.render('view_todos', {todos_not_assigned: todos_not_assigned})
                })
            }else{
                con.query("SELECT projects_todo.id, projects_todo.todo FROM projects_todo WHERE projects_todo.project_id = ? AND NOT EXISTS (SELECT assigned_todos.assigned_todo FROM assigned_todos WHERE projects_todo.id = assigned_todos.assigned_todo)",
                [req.params.project_id], (error, todos_not_assigned, fields) => {
                res.render('view_todos', {todos: todos, project_name: todos[0].project_name, todos_not_assigned: todos_not_assigned})
                })
            }
            
        }
    })
})


// edit project todos status
router.get("/edit/project_todos/status/:id/:status/:project_id", verify_route, verify_role, (req, res) => {
    if (req.params.status == 0){
        con.query("UPDATE projects_todo SET STATUS = 1 WHERE id = ?", [req.params.id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.redirect('/admin/view_todos/'+req.params.project_id)
            }
        })
    }else{
        con.query("UPDATE projects_todo SET STATUS = 0 WHERE id = ?", [req.params.id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.redirect('/admin/view_todos/'+req.params.project_id)
            }
        })
    }
})


// remove assigned todos 
router.get('/remove_assigned_todo/:assigned_todo_id/:assigned_projects_id/:project_id', verify_route, verify_role, (req, res) => {
    let assigned_projects_id = req.params.assigned_projects_id
    let assigned_todo_id = req.params.assigned_todo_id
    let project_id = req.params.project_id
    con.query("SELECT COUNT(id) AS count  FROM assigned_todos WHERE assigned_projects_id = ?",
    [assigned_projects_id], (error, count, fields) => {
        if (error){
            throw error
        }else{
            if(count[0].count > 1){
                con.query("DELETE FROM assigned_todos WHERE id = ?", [assigned_todo_id], (error, results, fields) => {
                    if (error){
                        throw error
                    }else{
                        res.redirect('/admin/view_todos/'+project_id)
                    }
                })
            }else{
                con.beginTransaction((err) => {
                    if (err) throw err
                    con.query("DELETE FROM assigned_todos WHERE id = ?", [assigned_todo_id], (error, results, fields) => {
                        if (error){
                            return con.rollback(() => {
                                throw error
                            })
                        }
                        con.query("DELETE FROM assigned_projects WHERE id = ?", 
                        [assigned_projects_id], (error, results, fields) => {
                            if (error){
                                return con.rollback(() => {
                                    throw error
                                })
                            }
                            con.commit((err) => {
                                if(err){
                                    return con.rollback(() => {
                                        throw err
                                    })
                                }
                                res.redirect('/admin/view_todos/'+project_id)
                            })
                        })
                    })
                })
            }
        }
    })
})


// user todos
router.get('/view_user_todos/:user_id', verify_route, (req, res) => {
    let user_id = req.params.user_id
    // con.query("SELECT users.name, user_details.user_id AS user_id, user_details.task_done, user_details.task_to_do, DATE_FORMAT(user_details.work_date, '%b %d, %Y %a %k:%i:%s') AS work_date FROM user_details, users WHERE user_details.user_id = users.id AND user_id = 3 ORDER BY work_date DESC LIMIT 1",
    // [user_id], (error, todo_done, fields) =>{
    //     if (error){
    //         throw error
    //     }else{
            con.query("SELECT projects_todo.id, projects_todo.todo, projects.name, projects_todo.status FROM projects_todo, projects WHERE projects.id = projects_todo.project_id AND projects_todo.id IN (SELECT assigned_todos.assigned_todo FROM assigned_projects, assigned_todos WHERE assigned_projects.id = assigned_todos.assigned_projects_id AND assigned_projects.user_id = ?) ORDER BY projects.name ASC",
            [user_id], (error, todos, fields) => {
                if (error){
                    throw error
                }else{
                    return res.json(todos)
                }
            })
    //     }
    // })
    
})

router.get('/view_user_todo_done/:user_id', (req, res) => {
    let user_id = req.params.user_id
    con.query("SELECT users.name, user_details.user_id AS user_id, user_details.task_done, user_details.task_to_do, DATE_FORMAT(user_details.work_date, '%b %d, %Y %a %k:%i:%s') AS work_date FROM user_details, users WHERE user_details.user_id = users.id AND user_id = ? ORDER BY user_details.id DESC LIMIT 1",
    [user_id], (error, todo_done, fields) => {
        if (error){
            throw error
        }else{
            return res.json(todo_done)
        }
    })
})

// load view_todos_details page
router.get('/view_todos_details/:id', verify_route, verify_role, (req, res) => {
    let todo_id = req.params.id
    con.query("SELECT projects_todo.id, projects_todo.status, projects_todo.todo, projects_todo.description, projects_todo.file, projects_todo.user_id, DATE_FORMAT(projects_todo.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM projects_todo JOIN users ON users.id = projects_todo.user_id AND projects_todo.id = ?",
    [todo_id], (error, todo_info, fields) => {
        if (error){
            throw error
        }else{
            if(todo_info.length == 0){
                return res.redirect('/')
            }
            todo_info[0]['logged_userid'] = req.user_id
            // console.log(todo_info[0])
            con.query("SELECT users.name FROM users JOIN assigned_projects ON users.id = assigned_projects.user_id JOIN assigned_todos ON assigned_projects.id = assigned_todos.assigned_projects_id AND assigned_todos.assigned_todo = ?",
            [todo_id], (error, user_list, fields) => {
                if (error){
                    throw error
                }else{
                    con.query("SELECT todo_reply.comment, todo_reply.file, DATE_FORMAT(todo_reply.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM todo_reply JOIN users ON users.id = todo_reply.user_id AND projects_todo_id = ? ORDER BY todo_reply.id ASC", 
                    [todo_id], (error, comments, fields) => {
                        if (error){
                            throw error
                        }else{
                            con.query("SELECT projects_todo.owner_id, users.name FROM projects_todo, users WHERE projects_todo.owner_id = users.id AND projects_todo.id = ?",
                            [todo_id], (error, owner, fields) => {
                                if (error){
                                    throw error
                                }else{
                                    con.query("SELECT id, name FROM users", (error, users, fields) => {
                                        if(error){
                                            throw error
                                        }else{
                                            res.render('view_todo_details', {todo_info: todo_info[0], user_list: user_list, comments: comments, owner: owner[0], users: users})
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }

                
            })
        }
        
    })
})

// search todo according to todo id
router.post('/view_todos_details/', verify_route, verify_role, (req, res) => {
    let todo_id = req.body.id
    con.query("SELECT projects_todo.id, projects_todo.status, projects_todo.todo, projects_todo.description, projects_todo.file, projects_todo.user_id, DATE_FORMAT(projects_todo.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM projects_todo JOIN users ON users.id = projects_todo.user_id AND projects_todo.id = ?",
    [todo_id], (error, todo_info, fields) => {
        if (error){
            throw error
        }else{
            if(todo_info.length == 0){
                return res.redirect('/')
            }
            todo_info[0]['logged_userid'] = req.user_id
            con.query("SELECT users.name FROM users JOIN assigned_projects ON users.id = assigned_projects.user_id JOIN assigned_todos ON assigned_projects.id = assigned_todos.assigned_projects_id AND assigned_todos.assigned_todo = ?",
            [todo_id], (error, user_list, fields) => {
                if (error){
                    throw error
                }else{
                    con.query("SELECT todo_reply.comment, todo_reply.file, DATE_FORMAT(todo_reply.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM todo_reply JOIN users ON users.id = todo_reply.user_id AND projects_todo_id = ? ORDER BY todo_reply.id ASC", 
                    [todo_id], (error, comments, fields) => {
                        if (error){
                            throw error
                        }else{
                            con.query("SELECT projects_todo.owner_id, users.name FROM projects_todo, users WHERE projects_todo.owner_id = users.id AND projects_todo.id = ?",
                            [todo_id], (error, owner, fields) => {
                                if (error){
                                    throw error
                                }else{
                                    con.query("SELECT id, name FROM users", (error, users, fields) => {
                                        if(error){
                                            throw error
                                        }else{
                                            res.render('view_todo_details', {todo_info: todo_info[0], user_list: user_list, comments: comments, owner: owner[0], users: users})
                                        }
                                    })
                                    
                                }
                            })
                        }
                    })
                } 
            })
        }
        
    })
})

// search todo pages
router.get('/search_todos', verify_route, verify_role, (req, res) => {
    con.query("SELECT id, name FROM projects WHERE STATUS = 1", (error, projects, fields) => {
        if (error){
            throw error
        }
        res.render('search_todos', {projects: projects})
    })
})



router.post('/todo_reply', upload.single('issue_file'), verify_route, (req, res) => {
    let user_id = req.user_id
    let todo_id = req.body.todo_id
    let file = ''
    try {
        file = req.file.filename
    } catch (error) {
        file = ''
    }
    // let file = req.file.filename ? req.file.filename : ''
    var date = new Date()
    var formattedDate = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-" + date.getDate() +" "+ date.getHours() +":"+ date.getMinutes()+":"+date.getSeconds()
    con.beginTransaction(function(err){
        if (err) throw err
        con.query("INSERT INTO todo_reply (projects_todo_id, comment, file, user_id, date_time) VALUES (?, ?, ?, ?, ?)",
        [todo_id, req.body.comment, file, user_id, formattedDate], (error, results, fields) => {
            if (error) {
                return con.rollback(function(){
                    throw error
                })
            }
            if (req.body.status != ''){
                con.query("UPDATE projects_todo SET STATUS = ? WHERE id = ?",[req.body.status, todo_id],
                (error, results1, fields) => {
                    if (error){
                        return con.rollback(function(){
                            throw error
                        })
                    }
                    con.commit(function(err){
                        if (err){
                            return con.rollback(function(){
                                throw err
                            })
                        }
                        res.redirect('/admin/view_todos_details/'+todo_id)
                    })
                })
            }else{
                con.commit(function(err){
                    if (err){
                        return con.rollback(function(){
                            throw err
                        })
                    }
                    res.redirect('/admin/view_todos_details/'+todo_id)
                })
            }
            
        })
    })
    
})

// change owner of project todo
router.post('/change_owner', verify_route, verify_role, (req, res) => {
    let todo_id = req.body.todo_id
    let owner_id = req.body.owner

    con.query("UPDATE projects_todo SET owner_id = ? WHERE id = ?", [owner_id, todo_id], (error, results, fields) => {
        if (error){
            throw error
        }else{
            res.redirect('/admin/view_todos_details/'+todo_id)
        }
    })
})

module.exports = router