const router = require('express').Router()
const Joi = require('@hapi/joi')
const verify_route = require('./verify_route')
const con = require('../config/db')



router.get('/', (req, res) => {
    res.render('login', {layout: false})
})

router.get('/main', verify_route, (req, res) => {
    con.query("SELECT * FROM user_details WHERE user_id = ? ORDER BY work_date DESC LIMIT 1", [req.user_id], (error, results, fields) => {
        if (error){
            throw error
        }else{
            console.log(results[0])
            res.render('main', {layout: false, results: results[0]})
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
        res.redirect('/main')
    }else{
        var date = new Date()
        var formattedDate = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-" + date.getDate() +" "+ date.getHours() +":"+ date.getMinutes()+":"+date.getSeconds()
        console.log(value)
        con.query("INSERT INTO user_details (task_done, task_to_do, work_date, user_id) VALUES (?, ?, ?, ?)",
        [value.done, value.todo, formattedDate, req.user_id], (error, results, fields) => {
            console.log(results)
            if(error){
                throw error
            }else{
                res.redirect('/main')
            }
        })
    }
})
module.exports = router