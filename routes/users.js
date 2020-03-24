const router = require('express').Router()
const Joi = require('@hapi/joi')
const verify_route = require('./verify_route')
const con = require('../config/db')
const bcrypt = require('bcryptjs')



router.get('/login', (req, res) => {
    res.render('login', {layout: false})
})


router.get('/', verify_route, (req, res) => {
    con.query("SELECT users.name, user_details.id, user_details.task_done, user_details.task_to_do, DATE_FORMAT(user_details.work_date, '%b %d, %Y %a %k:%i:%s') AS work_date FROM user_details, users WHERE user_details.user_id = users.id AND user_id = ? ORDER BY work_date DESC LIMIT 5",
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
                        layout: false, 
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
        console.log(formattedDate)
        con.query("INSERT INTO user_details (task_done, task_to_do, work_date, user_id) VALUES (?, ?, ?, ?)",
        [value.done, value.todo, formattedDate, req.user_id], (error, results, fields) => {
            console.log(results)
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
module.exports = router