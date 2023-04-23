const https = require('https');
const http = require('http');
const config = require('./config');
const fs = require('fs');
const HTTPS = false;
const io = require('socket.io');
const redisio= require('socket.io-redis');

/**
 * Create and start a HTTP Server
 */
var options = {
  key: fs.readFileSync('ca.key'),
  cert: fs.readFileSync('ca.crt'),
  // requestCert: true,
  // rejectUnauthorized: false
};

async function startServer(app) {
  if (HTTPS && process.env.NODE_ENV === 'production') {
    var server = https.createServer(options, app);
  } else {
    var server = http.createServer(app);
  }

  var port = normalizePort(config.server.port);
  var host = config.website;
  server.listen(port, function () {
    host = server.address().address;
    port = server.address().port;

    console.log('(Process 11/' + config.appBootUpSteps + ') Server started. Listening at host: ' + host + ' - port: ' + port);
  });


  var socketIo = io(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });



  /**
   * Event listener for HTTP server "error" event.
   */
  server.on('error', function onError(error) {
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
  });
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = startServer;