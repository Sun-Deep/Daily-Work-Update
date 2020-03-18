const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.cookies.auth_token
    if(!token){
        res.status(401).redirect('/')
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user_name = verified.name
        req.user_id = verified.id
        req.user_role = verified.role
        next()
    }catch(err){
        res.status(401).redirect('/')
    }
}