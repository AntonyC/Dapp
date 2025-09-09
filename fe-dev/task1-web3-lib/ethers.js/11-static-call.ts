// Ethereum nodes have an eth_call method
//     that allows users to simulate a transaction
//     and return the potential transaction result.
// bool tx = await contract.METHOD_NAME.staticCall( args, {override})

// override:
//     from
//     value
//     blockTag
//     gasPrice
//     gasLimit
//     nonce

import { ethers } from "ethers";
import {
  provider,
  addrAntonyC,
  abiAntonyC,
  addrAccount,
  addrAccount4,
} from "../utils-sepolia.ts";

const privateKey = process.env.PK || "";
const wallet = new ethers.Wallet(privateKey, provider);
const conAntonyC = new ethers.Contract(addrAntonyC, abiAntonyC, wallet);

async function main() {
  const balance = await conAntonyC.balanceOf(addrAccount);
  console.log("balance: ", ethers.formatEther(balance));
  try {
    // 1. success
    const success = await conAntonyC.transfer.staticCall(
      addrAccount4,
      balance - 1n,
      {
        from: addrAccount,
      }
    );
    console.log("balance - 1: ", success);
    // 2. fail
    const fail = await conAntonyC.transfer.staticCall(
      addrAccount4,
      balance + 1n,
      {
        from: addrAccount,
      }
    );
    console.log("balance - 1: ", fail);
  } catch (e) {
    console.log("balance + 1: ", e.shortMessage);
  }
}

main();

// balance:  7.9
// balance - 1:  true
// balance + 1:  execution reverted: "ERC20: transfer amount exceeds balance"
