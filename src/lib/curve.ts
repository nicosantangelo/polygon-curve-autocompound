import { ContractName, getContract } from './contracts'
import { getGasPrice, getWallet } from './eth'

export async function getClaimableRewards(
  contractName: ContractName.WMATIC | ContractName.CRV
) {
  const wallet = getWallet()
  const token = getContract(contractName)
  const rewards = getContract(ContractName.AAVE_REWARDS)
  return rewards.claimable_reward_write(wallet.address, token.address)
}

export async function claimRewards() {
  const rewards = getContract(ContractName.AAVE_REWARDS)
  const wallet = getWallet()
  // for some reason rewards.claim_rewards is not generated from the ABI, but it does exist in populateTransaction :shrug:
  const txData = await rewards.populateTransaction['claim_rewards()']({
    gasLimit: 280000,
    gasPrice: await getGasPrice(),
  })
  return wallet.sendTransaction(txData)
}
