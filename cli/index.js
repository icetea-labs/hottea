#!/usr/bin/env node

const { version } = require('../package.json')
const path = require('path')
const { spawn } = require('child_process')
const debugFactory = require('debug')
debugFactory.enable('icetea*')
const debug = debugFactory('iceteadev')
const program = require('commander')

const launchWeb = async (params) => {
  const daemon = path.resolve(__dirname, '../node_modules/webpack-dev-server/bin/webpack-dev-server.js')
  const host = params ? params.host : undefined
  const env = { ...process.env }
  if (host) env.ICETEA_ENDPOINT = host
  const child = spawn(daemon, ['--open', '--config', 'webpack.dev.js'], {
    env,
    cwd: path.resolve(__dirname, '..')
  })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.on('exit', code => {
    debug(`Web server exit code: ${code}`)
  })
}

if (process.argv.length < 3) {
  launchWeb()
} else {
  program.version(version)
  program
    .command('web')
    .description('start a blockchain web for development')
    .option('-h, --host <host>', 'icetea node http or ws', 'ws://localhost:26657/websocket')
    .action(launchWeb)
    
  program.parse(process.argv)
}

