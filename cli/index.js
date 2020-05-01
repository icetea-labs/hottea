#!/usr/bin/env node

const { version } = require('../package.json')
const path = require('path')
const { spawn } = require('child_process')
const debugFactory = require('debug')
debugFactory.enable('hottea*')
const debug = debugFactory('hottea')
const program = require('commander')
const handler = require('serve-handler');
const http = require('http');

const launchWeb = async (options) => {
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
    return handler(request, response, {
      public: "dev_dist"
    });
  })

  const port = (options && options.port) ? options.port : 3001
  server.listen(port, () => {
    console.log('Running at http://localhost:3001');
  });
}

if (process.argv.length < 3) {
  launchWeb()
} else {
  program.version(version)
  program
    .command('web')
    .description('start a blockchain web for development')
    .option('-p, --port <port>', 'web server port, default to 3001')
    .action(launchWeb)
    
  program.parse(process.argv)
}

