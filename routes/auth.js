const router = require('express').Router()
const Joi = require('@hapi/joi')
const con = require('../config/db')
const bcrypt = require('bcryptjs')


router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        designation: Joi.string().required(),
        password: Joi.string().min(5).required(),
        role: Joi.number().required()
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

                con.query("INSERT INTO users (NAME, email, designation, password, role) VALUES (?, ?, ?, ?, ?)",
                [value.name, value.email, value.designation, hashPassword, value.role], (error, result, fields) => {
                    res.redirect('/admin/signup')
                })
            }
        })
    }
})


router.get('/view_users', (req, res) => {
    con.query("SELECT name, email, designation, role FROM users", (error, users, fields) => {
        res.render('view_users', {users: users})
    })
    
})

module.exports = router