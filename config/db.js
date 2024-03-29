var mysql = require('mysql')

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })

  con.connect(err => {
    if(err){
      console.log(err.stack)
      return
    }
    console.log("Database connected successfully")
  })
  

  module.exports = con