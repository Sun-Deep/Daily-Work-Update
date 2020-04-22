const jwt = require('jsonwebtoken')
const con = require('../config/db')


module.exports = function(req, res, next) {
    const token = req.cookies.auth_token
    if(!token){
        res.status(401).redirect('/login')
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user_name = verified.name
        req.user_id = verified.id
        req.user_role = verified.role
        con.query("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC",
        [req.user_id], (error, results, fields) => {
            global.notification = results
            let unread = 0
            for(let i = 0; i < results.length; i++){
                if(results[i].seen == 0){
                    unread += 1
                } 
            }
            global.notification.unread = unread
            next()
        })
        
    }catch(err){
        res.status(401).redirect('/login')
    }
}