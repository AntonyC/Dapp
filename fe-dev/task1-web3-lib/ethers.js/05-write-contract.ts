// Convert a read-only contract to a writeable contract
//     const contract2 = contract.connect(signer)
// WETH (Wrapped ETH) is the wrapped version of ETH,
//     where Ethereum’s native token is wrapped into an ERC20-compliant token through a smart contract.

import { ethers } from "ethers";
import { provider, addrWETH, addrAccount4 } from "../utils-sepolia.ts";

const privateKey = process.env.PK || "";
const wallet = new ethers.Wallet(privateKey, provider);

const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
  "function transfer(address, uint) public returns (bool)",
  "function withdraw(uint) public",
];

const conWETH = new ethers.Contract(addrWETH, abiWETH, wallet);
// const conWETH1 = new ethers.Contract(addrWETH, abiWETH, provider)
// conWETH1.connect(wallet)

async function main() {
  // current state
  console.log("--wallet addr: ", wallet.address);
  console.log("ETH: ", ethers.formatEther(await provider.getBalance(wallet)));
  let balance = await conWETH.balanceOf(wallet.address);
  console.log("balance account1 WETH: ", ethers.formatEther(balance));
  // deposit
  let tx = await conWETH.deposit({
    value: ethers.parseEther("0.001"),
  });
  await tx.wait();
  console.log("--tx: ", tx);

  balance = await conWETH.balanceOf(wallet.address);
  console.log("balance account1 WETH after depositting:");
  console.log("--: ", ethers.formatEther(balance));
  console.log("ETH: ", ethers.formatEther(await provider.getBalance(wallet)));

  // transfer to account 4
  balance = await conWETH.balanceOf(addrAccount4);
  console.log("balance account4 WETH:");
  console.log("--: ", ethers.formatEther(balance));
  tx = await conWETH.transfer(addrAccount4, ethers.parseEther("0.001"));
  await tx.wait();
  // transfer to account 4 after
  balance = await conWETH.balanceOf(addrAccount4);
  console.log("balance account4 WETH after transfer:");
  console.log("--: ", ethers.formatEther(balance));
  console.log("ETH: ", ethers.formatEther(await provider.getBalance(wallet)));
}

main();

// ETH:  1.171374563222854487   init
// ETH:  1.170374416127310247   deposit 0.001 to WETH
// ETH:  1.170374234262750847   transfer WETH to account4

// balance account1 WETH:
// --:  0.004
// balance account1 WETH after depositting:
// --:  0.005
// balance account4 WETH:
// --:  0.001
// balance account4 WETH after transfer:
// --:  0.002

// --tx:  ContractTransactionResponse {
//   provider: JsonRpcProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x6d8e17133979c53a91ea60577d50b90082bee6ee295d2ccbe7fc5e19dbb6b5d3',
//   type: 2,
//   to: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
//   from: '0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927',
//   nonce: 42,
//   gasLimit: 28156n,
//   gasPrice: undefined,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 9821342n,
//   maxFeePerBlobGas: null,
//   data: '0xd0e30db0',
//   value: 1000000000000000n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x885aab3cd47a9ff9598c324447fffc3f9a2e0a8cb32a3ba0b7adf06e123d4c1a", s: "0x3718a89d8f8e81fbf89744d89c1a2af660ab5cde7e8d9a6514df71ea0cabb45f", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null,
//   authorizationList: null
// }
