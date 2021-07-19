import fetch from 'node-fetch'
import * as ethers from 'ethers'

export const RPC_URL = process.env.RPC_URL
export const MNEMONIC = process.env.MNEMONIC
export const POLYGON_GAS_API = process.env.POLYGON_GAS_API

let provider: ethers.providers.Provider | null = null
let wallet: ethers.Wallet | null

export function getProvider() {
  if (!RPC_URL) {
    throw new Error('Missing env var RPC_URL')
  }

  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  }

  return provider
}

export function getWallet() {
  if (!wallet) {
    const provider = getProvider()

    if (!MNEMONIC) {
      throw new Error('Missing env var MNEMONIC')
    }

    wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider)
  }
  return wallet
}

let lastTimestamp = 0
let lastPrice = 0
export async function getGasPrice() {
  if (!POLYGON_GAS_API) {
    throw new Error('Missing env var POLYGON_GAS_API')
  }

  const timestamp = Date.now()
  if (timestamp - lastTimestamp > 60 * 1000) {
    const resp = await fetch(POLYGON_GAS_API)
    const json = await resp.json()
    lastPrice = json.fast
    lastTimestamp = timestamp
  }
  return ethers.utils.parseUnits(lastPrice.toString(), 'gwei')
}
