const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dev_dist'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    port: 3001,
    overlay: true
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './.env.dev') // Path to .env file (this is the default)
    }),
    new webpack.DefinePlugin({
      'process.env.ICETEA_ENDPOINT': JSON.stringify(process.env.ICETEA_ENDPOINT || 'ws://localhost:26657/websocket')
    })
  ]
})
