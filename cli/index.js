#!/usr/bin/env node

const { version } = require('../package.json')
const program = require('commander')
const handler = require('serve-handler');
const http = require('http');

const launchWeb = async (cmd) => {
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/zeit/serve-handler#options
    return handler(request, response, {
      public: "dev_dist"
    });
  })

  const port = (cmd && cmd.port) ? cmd.port : 3001
  server.listen(port, () => {
    console.log('Running at http://localhost:' + port);
  });
}

program.version(version)
program
  .option('-p, --port <port>', 'web server port')
  .action(launchWeb)
  
program.parse(process.argv)
