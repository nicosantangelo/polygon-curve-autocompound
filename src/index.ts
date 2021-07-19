import { ethers } from 'ethers'
import { ContractName } from './lib/contracts'
import { claimRewards, getClaimableRewards } from './lib/curve'
import { getGasPrice, getWallet } from './lib/eth'
import { COMPOUND_INTERVAL, sleep } from './lib/sleep'

export async function main() {
  const wallet = getWallet()
  console.log('Account:', wallet.address)
  console.log('Interval:', COMPOUND_INTERVAL, 'minutes')
  const gas = ethers.utils.formatUnits(await getGasPrice(), 'gwei')
  console.log('Gas:', gas, 'gwei')
  // loopty-loop
  console.log('\n')
  try {
    while (1) {
      // get rewards
      console.log('Fetching rewards...')
      const wmaticRewards = await getClaimableRewards(ContractName.WMATIC)
      console.log('Claimable WMATIC:', ethers.utils.formatEther(wmaticRewards))
      const crvRewards = await getClaimableRewards(ContractName.CRV)
      console.log('Claimable CRV:', ethers.utils.formatEther(crvRewards))
      console.log('Claiming rewards...')
      const tx = await claimRewards()
      console.log(`Tx submitted: ${tx.hash}`)
      console.log(`Link: https://polygonscan.com/tx/${tx.hash}`)
      await tx.wait()
      console.log('Claim successful!')

      // TODO: swap for stablecoin on quickswap, deposit on curve again

      // wait for next loop
      await sleep(COMPOUND_INTERVAL * 60 * 1000)
    }
  } catch(error) {
    console.error(`An error occurred trying to autocompound:`, error)
  }
}
