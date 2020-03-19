module.exports = (req, res, next) => {
    
    if (req.user_role == 0){
        next()
    }else{
        res.redirect('/')
    }
    
}