import { IceteaWeb3 } from '@iceteachain/web3'
const defaultEndpoint = process.env.ICETEA_ENDPOINT || 'ws://localhost:26657/websocket'
const altEndpoint = process.env.ALT_ENDPOINT || 'wss://rpc.icetea.io/websocket'
export const endpoint = localStorage.endpoint || defaultEndpoint
export const tweb3 = new IceteaWeb3(endpoint)
export default tweb3
window.tweb3 = tweb3

window.addEventListener('DOMContentLoaded', () => {
  const noticeTag = document.querySelector('.notice')
  if (noticeTag) {
    const tag = document.createElement('SPAN')
    tag.classList.add('network')
    tag.setAttribute('title', 'Click to change')
    tag.textContent = endpoint

    tag.addEventListener('click', () => {
      const candidate = (endpoint === defaultEndpoint) ? altEndpoint : defaultEndpoint
      if (window.confirm('Switch to ' + candidate + '?')) {
        if (candidate === defaultEndpoint) {
          localStorage.removeItem('endpoint')
        } else {
          localStorage.setItem('endpoint', candidate)
        }

        window.location.reload()
      }
    })

    noticeTag.appendChild(tag)
  }
})
