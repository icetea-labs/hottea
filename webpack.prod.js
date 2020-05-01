const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Dotenv = require('dotenv-webpack')
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new Dotenv({
      path: './.env.prod' // Path to .env file (this is the default)
    })
  ]
})
