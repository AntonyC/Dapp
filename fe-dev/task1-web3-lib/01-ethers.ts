// 1. Run "pnpm install ethers --save" "pnpm install -D tsx"
// 2. Install plugin "Code Runner"
// 3. npx tsx 02-provider.ts

import { ethers } from "ethers";

const provider = ethers.getDefaultProvider();
const main = async () => {
  // ENS: Ethereum Name Service, address -> name
  // Ethers natively supports ENS domains

  // The built-in RPC in Ethers has speed limitations
  const balance = await provider.getBalance(`vitalik.eth`);
  console.log(`ETH balance of Vitalk: ${balance} wei`);
  console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
};

main();
