export const COMPOUND_INTERVAL = parseInt(process.env.COMPOUND_INTERVAL || '60')

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
