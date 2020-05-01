import JSONFormatter from 'json-formatter-js'
import handlebars from 'handlebars/dist/handlebars.min.js'
import { utils } from '@iceteachain/web3'
import tweb3 from './tweb3'
import { fmtHex, fmtTime } from './helper'
import { toTEA } from './common'

const blockTemplate = handlebars.compile(document.getElementById('blockTemplate').innerHTML)
const txTemplate = handlebars.compile(document.getElementById('txTemplate').innerHTML)

function fmtBlocks (blocks) {
  return blocks.map(b => ({
    height: b.header.height,
    shash: fmtHex(b.block_id.hash, 10),
    timestamp: fmtTime(b.header.time),
    txCount: b.num_txs
  }))
}

function fmtTxs (txs) {
  txs.forEach(t => {
    const data = t.tx
    t.shash = fmtHex(t.hash)
    t.blockHeight = t.height
    const e = t.events.filter((el) => {
      return el.eventName === 'tx'
    })
    t.from = data.from || e[0].eventData.from
    t.fromText = fmtHex(t.from, 6)
    t.to = data.to || e[0].eventData.to
    t.toText = fmtHex(t.to, 6)
    t.value = toTEA(data.value).toLocaleString() + ' TEA'
    t.fee = data.fee

    t.status = t.tx_result.code ? 'Error' : 'Success'

    t.txType = 'transfer'
    data.data = data.data || {}
    if (data.data.op === 0) {
      t.txType = 'deploy'
    } else if (data.data.op === 1) {
      t.txType = 'call'
    }
  })
  return txs
}

function showMessage () {
  // parse message to show
  var parts = window.location.href.split('?')
  if (parts.length > 1) {
    document.getElementById('info').textContent = decodeURIComponent(parts[1])
    setTimeout(() => {
      document.getElementById('info').textContent = ''
    }, 4000)
  }
  // tweb3.subscribe('NewBlock',{}, message => {
  //   console.log("message: ", JSON.parse(message));
  // });
}

let blockCount = 0
async function loadData () {
  // load block info
  const blockchain = await tweb3.getBlocks()
  var myBlocks = blockchain.block_metas
  if (myBlocks && myBlocks.length && myBlocks.length > blockCount) {
    blockCount = myBlocks.length

    // by default, getBlocks return latest 30 blocks
    document.getElementById('blocks').innerHTML = blockTemplate(fmtBlocks(myBlocks))

    const myTxs = await tweb3.searchTransactions('tx.height>0', {order_by: 'desc'})
    if (myTxs.txs && myTxs.txs.length) {
      document.getElementById('transactions').innerHTML = txTemplate(fmtTxs(myTxs.txs))
    }

    // load debug info
    const myJSON = await tweb3.getDebugState()

    const formatter = new JSONFormatter(myJSON, 0)
    document.getElementById('debug').innerHTML = ''
    document.getElementById('debug').appendChild(formatter.render())
  }
}

(() => {
  showMessage()
  loadData()
  setInterval(loadData, 3500)
})()
