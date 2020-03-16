const router = require('express').Router()
const Joi = require('@hapi/joi')


router.get('/signup', (req, res) => {
    res.render('signup')
})

module.exports = router