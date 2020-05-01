import { IceteaWeb3 } from '@iceteachain/web3'
export const endpoint = localStorage['endpoint'] || process.env.ICETEA_ENDPOINT || 'ws://localhost:3001/websocket'
export default window.tweb3 = new IceteaWeb3(endpoint)
