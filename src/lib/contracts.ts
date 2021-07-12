import { ethers } from 'ethers'
import ERC20 from '../abis/ERC20.json'
import Rewards from '../abis/Rewards.json'
import { getWallet } from './eth'

export enum ContractName {
  WMATIC = 'WMATIC',
  CRV = 'CRV',
  AAVE_REWARDS = 'AAVE_REWARDS',
}

export const ContractAddresses: Record<ContractName, string> = {
  [ContractName.WMATIC]: process.env.WMATIC_TOKEN_CONTRACT_ADDRESS!,
  [ContractName.CRV]: process.env.CRV_TOKEN_CONTRACT_ADDRESS!,
  [ContractName.AAVE_REWARDS]: process.env.REWARDS_CONTRACT_ADDRESS!,
}

export const ContractABIs: Record<ContractName, ethers.ContractInterface> = {
  [ContractName.WMATIC]: ERC20,
  [ContractName.CRV]: ERC20,
  [ContractName.AAVE_REWARDS]: Rewards,
}

const instances: Record<string, ethers.Contract> = {}

export function getContract(name: ContractName) {
  const wallet = getWallet()

  const address = ContractAddresses[name]
  if (!address) {
    throw new Error(`Missing env var for ${name}_TOKEN_CONTRACT_ADDRESS`)
  }

  const abi = ContractABIs[name]
  if (!abi) {
    throw new Error(`Missing ABI for contract "${name}"`)
  }

  const isInstantiated = name in instances

  if (!isInstantiated) {
    instances[name] = new ethers.Contract(address, abi, wallet)
  }

  return instances[name]
}
