import {
  JsonRpcProvider,
  isAddress,
  formatEther,
  formatUnits,
  Contract,
} from "ethers";
import { TOKENS } from "../constants/tokens";

export const provider = new JsonRpcProvider("https://mainnet.base.org");

const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];

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

export async function getUsdcBalance(address) {
  const usdc = new Contract(TOKENS.USDC_BASE.address, ERC20_ABI, provider);
  const bal = await usdc.balanceOf(address);
  return formatUnits(bal, TOKENS.USDC_BASE.decimals);
}

// Blockscout (Base) — latest transactions for an address (read-only)
export async function getAddressTransactions(address, limit = 10) {
  const url = `https://base.blockscout.com/api/v2/addresses/${address}/transactions?items_count=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Blockscout API error");

  const data = await res.json();
  return data.items ?? [];
}