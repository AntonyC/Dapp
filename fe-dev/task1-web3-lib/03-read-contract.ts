// read-only  provider：const contract = new ethers.Contract(`address`, `abi`, `provider`);
// read-write provider：const contract = new ethers.Contract(`address`, `abi`, `signer`);

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const PUBLIC_EPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

const provider = new ethers.JsonRpcProvider(PUBLIC_EPOLIA_URL);
const addrAccount = "0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927";
const addrAntonyC = "0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F";

// https://sepolia.etherscan.io/address/0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F#code
const abiAntonyC =
  '[{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';

const abiReadable = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];
const conAntonyC = new ethers.Contract(addrAntonyC, abiAntonyC, provider);
const conAntonyC1 = new ethers.Contract(addrAntonyC, abiReadable, provider);

const main = async () => {
  const abiJson = JSON.parse(abiAntonyC);
  console.log("readable abi: ", new ethers.Interface(abiJson).format(false));

  console.log("name: ", await conAntonyC1.name());
  console.log("symbol: ", await conAntonyC1.symbol());
  console.log("owner: ", await conAntonyC.owner());
  console.log("decimals: ", await conAntonyC.decimals());
  console.log("balanceOf: ", await conAntonyC1.balanceOf(addrAccount));
  console.log(
    "totalSupply: ",
    `${ethers.formatEther(await conAntonyC1.totalSupply())} ETH`
  );
};

main();
