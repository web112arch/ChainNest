import { JsonRpcProvider, isAddress, formatEther } from "ethers";

export const provider = new JsonRpcProvider("https://mainnet.base.org");

export function validateAddress(address) {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

export async function getEthBalance(address) {
  const balanceWei = await provider.getBalance(address);
  return formatEther(balanceWei);
}

export async function getBlockNumber() {
  return provider.getBlockNumber();
}