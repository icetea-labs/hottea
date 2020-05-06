import handlebars from 'handlebars/dist/handlebars.min.js'
import tweb3 from './tweb3'
import { toTEA } from './common'
import { fmtHex } from './helper'

const getAccountInfo = async address => {
  const info = await tweb3.getAccountInfo(address)
  info.address = address
  info.balanceText = toTEA(info.balance).toLocaleString() + ' TEA'
  info.isContract = info.hasSrc || info.system
  info.isContractText = info.isContract ? 'YES' : 'NO'
  info.category = tweb3.utils.isRegularAccount(address) ? 'Regular Account' : 'Bank Account'

  info.modeText = info.mode ? 'Wasm' : 'JavaScript'

  const source = document.getElementById('tableTemplate').innerHTML
  const template = handlebars.compile(source)
  const html = template(info)
  document.getElementById('tableContent').innerHTML = html
}

const getTxHistory = async address => {
  try {
    const txFrom = await tweb3.searchTransactions(`system.from='${address}' AND system._ev = 'tx'`, { per_page: 100 });
    const txTo = await tweb3.searchTransactions(`system.to='${address}' AND system._ev = 'tx'`, { per_page: 100 });
    const txPayer = await tweb3.searchTransactions(`system.payer='${address}' AND system._ev = 'tx'`, { per_page: 100 });
    const all = txFrom.txs.concat(txTo.txs).concat(txPayer.txs); //.map(tweb3.utils.decodeTxResult);

    if (all.length) {
      all.forEach(x => {
        const e = x.events.filter((el) => {
          return el.eventName === 'tx'
        })
        x.from = x.tx.from || e[0].eventData.from
        x.fromText = fmtHex(x.from)
        x.to = x.tx.to || e[0].eventData.to
        x.toText = fmtHex(x.to)
        x.payer = x.tx.payer || e[0].eventData.payer
        x.payerText = fmtHex(x.payer)
        x.tx.data = x.tx.data || {}

        x.status = x.tx_result.code ? 'Error' : 'Success'
        x.shash = fmtHex(x.hash)
        x.blockHeight = +x.height
        x.value = (x.tx.value || 0)
        x.valueText = toTEA(x.value).toLocaleString() + ' TEA'

        x.txType = 'transfer'
        const op = x.tx.data.op
        if (op === 0) {
          x.txType = 'deploy'
        } else if (op === 1) {
          x.txType = 'call'
        }
      })

      const sorted = all.sort((a, b) => {
        const delta = b.blockHeight - a.blockHeight
        if (delta) return delta
        return b.index - a.index
      })
      const source = document.getElementById('txTemplate').innerHTML
      const template = handlebars.compile(source)
      const html = template(sorted)
      document.getElementById('transactions').innerHTML = html
    }
  } catch (err) {
    console.log(err, err.error)
  }
}

(async () => {
  const address = new URLSearchParams(window.location.search).get('address')
  if (address) {
    getAccountInfo(address)
    getTxHistory(address)
  }
})()
