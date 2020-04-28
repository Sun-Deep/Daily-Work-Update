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
            global.notification.user_role = verified.role
            global.notification.unread = unread
            con.query("SELECT mn.id, mn.title, mn.sender, mn.receiver, u.name FROM message_notification mn, users u WHERE u.id = mn.sender AND mn.receiver = ? AND mn.seen = 0 GROUP BY mn.sender",
            [req.user_id], (error, results2, fields) => {
                global.message_notification = results2
                global.message_notification.unread = results2.length
                next()
            })
            
        })
        
    }catch(err){
        res.status(401).redirect('/login')
    }
}