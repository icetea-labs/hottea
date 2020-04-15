// This webpack config is for sample client in 'web' folder

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
    transfer: path.resolve(__dirname, './src/transfer.js'),
    deploy: path.resolve(__dirname, './src/deploy.js'),
    contract: path.resolve(__dirname, './src/contract.js'),
    wallet: path.resolve(__dirname, './src/wallet.js'),
    tx: path.resolve(__dirname, './src/tx.js'),
    bot: path.resolve(__dirname, './src/bot.js'),
    botstore: path.resolve(__dirname, './src/botstore.js'),
    profile: path.resolve(__dirname, './src/profile.js'),
    address: path.resolve(__dirname, './src/address.js'),
    block: path.resolve(__dirname, './src/block.js'),
    election: path.resolve(__dirname, './src/election.js')
  },
  output: {
    path: path.resolve(__dirname, 'web_dist'),
    filename: '[name].js'
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },

  plugins: [
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'src'), ignore: ['*.js'] }])
  ],

  node: {
    fs: 'empty'
  }
}
