#!/usr/bin/env node

const { version } = require('../package.json')
const path = require('path')
const { spawn } = require('child_process')
const debugFactory = require('debug')
debugFactory.enable('icetea*')
const debug = debugFactory('icetea:cli')

const program = require('commander')
program.version(version)

const runIceTea = (command) => {
  const child = spawn('icetea', [command])
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}

program
  .command('init')
  .description('initialize a blockchain node')
  .action(() => {
    runIceTea('init')
  })

program
  .command('start')
  .description('start a blockchain node')
  .action(() => {
    runIceTea('start')
  })

program
  .command('reset')
  .description('reset database')
  .action(() => {
    runIceTea('reset')
  })

program
  .command('app')
  .description('start a blockchain ui for development')
  .option('-h, --host <host>', 'icetea node http or ws', 'ws://localhost:26657/websocket')
  .action(async ({ host }, options) => {
    const daemon = path.resolve(__dirname, '../node_modules/webpack-dev-server/bin/webpack-dev-server.js')
    const child = spawn(daemon, ['--open', '--config', 'webpack.dev.js'], {
      env: { ...process.env, ICETEA_ENDPOINT: host },
      cwd: path.resolve(__dirname, '..')
    })
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)

    child.on('exit', code => {
      debug(`Web server exit code: ${code}`)
    })
  })

program.parse(process.argv)

// catches ctrl+c event
process.on('SIGINT', () => {
  // let tm clean-up, or it will lock the DB
  // node && node.kill()
})
