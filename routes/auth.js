const router = require('express').Router()
const Joi = require('@hapi/joi')
const con = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify_route = require('./verify_route')
const verify_role = require('./verify_role')




router.get('/', verify_route, verify_role, (req, res) => {
    con.query("SELECT COUNT(id) AS total FROM users WHERE role = 1", (error, total_employee, fields) => {
        res.render('dashboard', {total_employee: total_employee[0]})
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


//login check
router.post('/logincheck', (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body, {abortEarly: false})

    if (error){
        res.redirect('/')
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


router.get('/view_users', verify_route, verify_role, (req, res) => {
    con.query("SELECT name, email, designation, role FROM users", (error, users, fields) => {
        res.render('view_users', {users: users})
    })
    
})

module.exports = router