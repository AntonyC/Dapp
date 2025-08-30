// 不接触用户私钥，只能读取链上信息，不能写入，这一点比 web3.js 要安全

// 以在 Chainlist 网站找到各个链的公开节点 https://chainlist.org

import { ethers } from "ethers";

const provider = ethers.getDefaultProvider();
const provider1 = new ethers.JsonRpcProvider("https://eth.drpc.org");
// 利用公共rpc节点连接以太坊网络
// 可以在 https://chainlist.org 上找到
const ALCHEMY_MAINNET_URL = "https://rpc.ankr.com/eth";
const ALCHEMY_SEPOLIA_URL = "https://rpc.sepolia.org";
// 连接以太坊主网
const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// 连接Sepolia测试网
const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const main = async () => {
  const balance = await provider1.getBalance("vitalik.eth");
  console.log(`ETH balance of Vitalk: ${balance} wei`);
  console.log(`ETH balance of Vitalk: ${ethers.formatEther(balance)} ETH`);
};

main();
