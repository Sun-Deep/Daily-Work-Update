const router = require('express').Router()
const Joi = require('@hapi/joi')


router.get('/', (req, res) => {
    res.render('login', {layout: false})
})

router.get('/main', (req, res) => {
    res.render('main', {layout: false})
})

module.exports = router