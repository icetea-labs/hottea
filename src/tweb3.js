import { IceteaWeb3 } from '@iceteachain/web3'
export const endpoint = localStorage['endpoint'] || process.env.ICETEA_ENDPOINT || 'ws://localhost:3001/websocket'
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
            let newRpc = window.prompt('Enter new RPC endpoint or clear to use defaults. Example:\nws://localhost:3001/websocket\nwss://rpc.icetea.io/websocket', endpoint)
            if (newRpc == null) return // Cancel hit
            newRpc = newRpc.trim()

            if (!newRpc.length) {
                localStorage.removeItem('endpoint')
            } else {
                localStorage.setItem('endpoint', newRpc)
            }

            window.location.reload()
        })

        noticeTag.appendChild(tag)
    }
})

