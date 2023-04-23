#!/usr/bin/env node

var app = require('./src/app');
var chalk = require( "chalk" );
var startServer = require('./server');
const cluster = require('cluster');
const numberOfChildProcess = require('./config').numberOfChildProcess;
let constant = require('./src/app/core/common/Constants');
//const numberOfChildProcess = require('os').cpus().length;

// Setup Cluster
if (cluster.isMaster) {
  // Fork workers.

  for (let i = 0; i < numberOfChildProcess; i++) {
    cluster.fork();
  }
  cluster.on(
      "exit",
      function handleExit( worker, code, signal ) {

        console.log( chalk.yellow( "[Cluster]" ), "Worker #"+worker.process.pid+" die:", worker.exitedAfterDisconnect );
        if ( ! worker.exitedAfterDisconnect ) {
          var worker = cluster.fork();
          console.log( chalk.yellow( "[Cluster]" ), "Worker  #"+worker.process.pid+" restart:", worker.exitedAfterDisconnect );
        }

      }
  );
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.init(constant.API_SERVICE)
    .then(function (appInstance) {

      startServer(appInstance);
    });
  console.log( chalk.red( "[Worker]" ), "Worker start. #", process.pid );
}