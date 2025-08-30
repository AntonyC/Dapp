// Run "pnpm install ethers --save"
// Install plugin "Code Runner"

import { ethers } from "ethers";

const provider = ethers.getDefaultProvider();
const main = async () => {
  // ENS 域名, Ethereum Name Service (以太坊域名服务) 的域名
  // 把复杂的以太坊地址 -> 变成容易记的名字
  // ethers 原生支持 ENS 域名
  const balance = await provider.getBalance(`vitalik.eth`);
  console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
};
main();
