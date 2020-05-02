const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi')
const verify_route = require('../middlewares/verify_route')
const con = require('../config/db')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
    res.render('login', {layout: false})
})


router.get('/', verify_route, (req, res) => {
    con.query("SELECT users.name, user_details.id, user_details.task_done, user_details.task_to_do, DATE_FORMAT(user_details.work_date, '%b %d, %Y %a %k:%i:%s') AS work_date FROM user_details, users WHERE user_details.user_id = users.id AND user_id = ? ORDER BY id DESC LIMIT 5",
     [req.user_id], (error, results, fields) => {
        if (error){
            throw error
        }else{
            con.query("SELECT projects_todo.id, projects_todo.todo, projects.name, projects_todo.status FROM projects_todo, projects WHERE projects.id = projects_todo.project_id AND projects_todo.id IN (SELECT assigned_todos.assigned_todo FROM assigned_projects, assigned_todos WHERE assigned_projects.id = assigned_todos.assigned_projects_id AND assigned_projects.user_id = ?) ORDER BY projects.name ASC",
            [req.user_id], (error, projects, fields) => {
                if (error){
                    throw error
                }else{
                    let projects_name = []
                    let p_name = ''
                    if (Object.keys(projects).length == 0){
                    }else{
                        p_name = projects[0].name
                    }
                    projects_name.push({project_name: p_name})
                    for(let i = 1; i < projects.length; i++){
                        if (p_name == projects[i].name){
                            continue
                        }else{
                            p_name = projects[i].name
                            projects_name.push({project_name: p_name})
                        }
                    }

                    res.render('main', {
                        message_notification: message_notification,
                        notification: notification, 
                        layout: "user",
                        todo: results[0], 
                        done: results,
                        project_details: projects,
                        projects_name: projects_name
                    })
                }
            })
           
        }
    })
    
})

router.post('/main', verify_route, (req, res) => {
    const schema = Joi.object({
        done: Joi.string().required(),
        todo: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})
    if (error){
        res.redirect('/')
    }else{
        var date = new Date()
        var formattedDate = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-" + date.getDate() +" "+ date.getHours() +":"+ date.getMinutes()+":"+date.getSeconds()
        // console.log(date)
        con.query("INSERT INTO user_details (task_done, task_to_do, work_date, user_id) VALUES (?, ?, ?, ?)",
        [value.done, value.todo, formattedDate, req.user_id], (error, results, fields) => {
            // console.log(results)
            if(error){
                throw error
            }else{
                res.redirect('/')
            }
        })
    }
})

//change password
router.post('/change_password/', verify_route, async(req, res) => {
    const schema = Joi.object({
        password: Joi.string().min(5).required()
    })
    const {error, value} = schema.validate(req.body, {abortEarly: false})
    if (error){
        throw error
    }else{
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(value.password, salt)
        con.query("UPDATE users SET password = ? WHERE id = ?",[hashPassword, req.user_id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                
                res.redirect('/login')
            }
        })
    } 
})


//change the status of project todos
router.get("/edit/project_todos/status/:id/:status", verify_route, (req, res) => {
    if (req.params.status == 0){
        con.query("UPDATE projects_todo SET STATUS = 1 WHERE id = ?", [req.params.id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.redirect('/admin/')
            }
        })
    }else{
        con.query("UPDATE projects_todo SET STATUS = 0 WHERE id = ?", [req.params.id], (error, results, fields) => {
            if (error){
                throw error
            }else{
                res.redirect('/admin/')
            }
        })
    }
})


// search project issue
router.get('/search_todos', verify_route, (req, res) => {
    con.query("SELECT id, name FROM projects WHERE STATUS = 1", (error, projects, fields) => {
        if (error){
            throw error
        }
        res.render('user_search_todos', {layout: "user", message_notification: message_notification, notification: notification, projects: projects})
    })
})

// get all project todos
router.get('/project_todos/:id', verify_route, (req, res) => {
    let project_id = req.params.id
    con.query("SELECT projects_todo.id, projects_todo.todo, projects_todo.status FROM projects_todo JOIN assigned_projects ON assigned_projects.user_id = ? AND assigned_projects.project_id = projects_todo.project_id AND projects_todo.project_id = ?",[req.user_id, project_id],
    (error, todos, fields) => {
        // console.log(todos)
        return res.json(todos)
    })
})

// load view_todos_details page
router.get('/view_todos_details/:id', verify_route, (req, res) => {
    let todo_id = req.params.id
    con.query("SELECT projects_todo.id, projects_todo.status, projects_todo.todo, projects_todo.description, projects_todo.file, projects_todo.user_id, DATE_FORMAT(projects_todo.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM projects_todo JOIN users ON users.id = projects_todo.user_id AND projects_todo.id = ? JOIN assigned_projects ON assigned_projects.user_id = ? AND projects_todo.project_id = assigned_projects.project_id",
    [todo_id, req.user_id], (error, todo_info, fields) => {
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
                                    res.render('user_view_todo', {layout: "user", message_notification: message_notification, notification: notification, todo_info: todo_info[0], user_list: user_list, comments: comments, owner: owner[0]})   
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
router.post('/view_todos_details/', verify_route, (req, res) => {
    let todo_id = req.body.id
    con.query("SELECT projects_todo.id, projects_todo.status, projects_todo.todo, projects_todo.description, projects_todo.file, projects_todo.user_id, DATE_FORMAT(projects_todo.date_time, '%b %d, %Y %a %k:%i:%s') AS date_time, users.name FROM projects_todo JOIN users ON users.id = projects_todo.user_id AND projects_todo.id = ? JOIN assigned_projects ON assigned_projects.user_id = ? AND projects_todo.project_id = assigned_projects.project_id",
    [todo_id, req.user_id], (error, todo_info, fields) => {
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
                                    res.render('user_view_todo', {layout: "user", message_notification: message_notification, notification: notification, todo_info: todo_info[0], user_list: user_list, comments: comments, owner: owner[0]})   
                                }
                            })
                            
                        }
                    })
                } 
            })
        }
        
    })
})

// change notification read status
router.get('/notification/read/:notify_id/:id', verify_route, (req, res) => {
    let id = parseInt(req.params.id)
    let notify_id = parseInt(req.params.notify_id)
    con.query("UPDATE notifications SET seen = 1 WHERE id = ?", [id], (error, results, fields) => {
        if (error) throw error
        res.redirect('/view_todos_details/'+notify_id)
    })
})


// chat
router.get('/chat', verify_route, (req, res) => {
    con.query("SELECT id, name FROM users WHERE NOT id = ?", [req.user_id],
    (error, users, fields) => {
        message_count = {
            message_count: 0
        }
        res.render('user_chat', {layout: "user", users: users, message_notification: message_notification, notification: notification, form: false, receiver_id: 0, sender_id: 0, message_count: message_count})
    })
})

router.get('/chat/:id', verify_route, (req, res) => {
    let receiver_id = req.params.id
    let sender_id = req.user_id
    con.query("UPDATE message_notification SET seen = 1 WHERE sender = ? AND receiver = ?", 
    [receiver_id, req.user_id], (error, results, fields) => {
        if (error){
            throw error
        }else{
            con.query("SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?)",
            [sender_id, receiver_id, sender_id, receiver_id], (error, messages, fields) => {
            if (error){
                throw error
            }else{
                con.query("SELECT COUNT(id) as message_count FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?)",
                [sender_id, receiver_id, sender_id, receiver_id], (error, message_count, fields) => {
                    if (error){
                        throw error
                    }else{
                        con.query("SELECT id, name FROM users WHERE NOT id = ?", [req.user_id],
                        (error, users, fields) => {
                            res.render('user_chat', {layout: "user", users: users, message_notification: message_notification, notification: notification, receiver_id: receiver_id, sender_id: sender_id, messages: messages, message_count: message_count[0], form: true})
                        })
                        
                    }
                })
            }
        
    })
        }
    })
    
    
})

router.post('/chat', verify_route, (req, res) => {
    let sender = req.body.sender
    let receiver = req.body.receiver
    let message =  req.body.message
    con.beginTransaction(function(err){
        if(err) throw err
        con.query("INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)",
        [sender, receiver, message], (error, results, filelds) => {
            if (error){
                return con.rollback(() => {
                    throw error
                })
            }else{
                con.query("INSERT INTO message_notification(title, sender, receiver) VALUES (?, ?, ?)",
                [message, sender, receiver], (error, results2, fields) => {
                    if (error){
                        return con.rollback(() => {
                            throw error
                        })
                    }else{
                        con.commit((err) => {
                            if (err){
                                return con.rollback(() => {
                                    throw error
                                })
                            }
                            con.query("SELECT * FROM messages WHERE sender = ? AND receiver = ? and id = ?",
                            [sender, receiver, results.insertId], (error, messages, fields) => {
                                return res.json(messages)
                            })
                        })
                        
                    }
                })
            }
        })
    })
    
})



// chat read

router.get('/chat/read/:sender', verify_route, (req, res) => {
    let sender = parseInt(req.params.sender)
    con.query("UPDATE message_notification SET seen = 1 WHERE sender = ? AND receiver = ?", 
    [sender, req.user_id], (error, results, fields) => {
        if (error){
            throw error
        }else{
            res.redirect('/chat/'+sender)
        }
    })
})



// router.post('/get_chat', verify_route, (req, res) => {
//     let sender = req.body.sender
//     let receiver = req.body.receiver
//     let message_count = req.body.message_count
//     con.query("SELECT COUNT(id) as message_count FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?)",
//         [sender, receiver, sender, receiver], (error, total_count, fields) => {
//             if (error){
//                 throw error
//             }else{
//                 console.log(message_count)
//                 console.log(total_count[0].message_count)
//                 if(total_count[0].message_count > message_count){
//                     console.log(total_count[0].message_count)
//                     con.query("SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?) ORDER BY id DESC LIMIT ?",
//                     [sender, receiver, sender, receiver,total_count[0].message_count -  message_count], (error, results, fields) => {
//                         if(results.length > 0){
//                             results.push({ message_count: total_count[0].message_count})
//                             console.log(results.reverse())
//                             return res.send(results)
//                         }else{
//                             return
//                         }
                        
//                     })
//                 }else{
//                     return
//                 }
                
//             }
//     })
// })


module.exports = router