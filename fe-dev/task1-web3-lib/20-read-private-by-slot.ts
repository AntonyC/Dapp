// All data on Ethereum is public, so private variables are not private
// Slot: A fixed-size storage space, the size is uint256 or 32 bytes
// For a private variable without a getter function, you can still read its value through the slot index.

import { ethers } from "ethers";
import { provider } from "./utils-mainnet";

// Arbitrum ERC20 bridge（mainnet）
const addressBridge = "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"; // DAI Contract
// slot
const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`;

const main = async () => {
  console.log("Start reading slot data");
  const privateData = await provider.getStorage(addressBridge, slot);
  console.log(
    "slot data: ",
    ethers.getAddress(ethers.dataSlice(privateData, 12))
  );
};

main();
