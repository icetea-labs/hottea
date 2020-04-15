// NOTE: this file is used by web folder as well, so don't use BigInt (error on Safari)

const config = {
  whitelistModules: [
    'lodash', 'moment', 'big.js', '@hapi/joi', 'validator', 'ajv', 'cheerio', '@iceteachain/utils', ';',
    'assert', 'buffer', 'crypto', 'querystring', 'stream', 'string_decoder', 'url', 'util', 'create-hash']
}

module.exports = config
