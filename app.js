var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exhbs = require('express-handlebars')
require('dotenv').config()
const con = require('./config/db')

var app = express();

var hbs = exhbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  helpers: {
    if: function(arg1, arg2, options){
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
    },
    user_id: function(){
      return user_id
    }
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.engine('.hbs', hbs.engine)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//import routes

const authRoute = require('./routes/auth')
app.use('/admin/', authRoute)

const usersRoute = require('./routes/users')
app.use('/', usersRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

// #!/usr/bin/env node

/**
 * Module dependencies.
 */

var debug = require('debug')('dailywork:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || 4500
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// create socket instance with http
// var io = require('socket.io')(server)

// var users = {}

// // add listener for new connection
// io.on("connection", (socket) => {
 
//   // this is socket for each user
//   // console.log("user connected", socket.id)
//   // attach incomming listener for new user
//   socket.on("user_connected", (sender_id) => {
//     users[sender_id] = socket.id
//   })  

//   // listen from client
//   socket.on("message", (data) => {
//     console.log(users)
//     con.query("INSERT INTO message()")
//   })
// })

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log("Server Started Successfully")
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;
