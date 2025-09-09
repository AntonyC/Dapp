// 1. Get by abi
//     const interface = ethers.Interface(abi)
// 2. Get from contract
//     const interface2 = contract.interface

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
  // 1. Encode function
  const param1 = conAntonyC.interface.encodeFunctionData("balanceOf", [
    await wallet.getAddress(),
  ]);
  console.log("--Encode balanceOf: ", param1);
  // 2. Create transaction
  const tx1 = {
    to: addrAntonyC,
    data: param1,
  };
  // For view/pure we can use provider.call(tx)
  console.log(
    `--Balance before tf: ${ethers.formatEther(await provider.call(tx1))}`
  );

  const param2 = conAntonyC.interface.encodeFunctionData("transfer", [
    addrAccount4,
    ethers.parseEther("0.01"),
  ]);
  console.log("--Encode transfer: ", param2);
  const tx2 = {
    to: addrAntonyC,
    data: param2,
  };
  // For writing, we must use wallet.sendTransaction(tx)
  await (await wallet.sendTransaction(tx2)).wait();
  console.log(
    `--Balance after tf: ${ethers.formatEther(await provider.call(tx1))}`
  );
}
main();

// --Encode balanceOf:  0x70a08231000000000000000000000000f1c88c36fb612cf5d9c3f84f651bfe9049b1b927
// --Balance before tf: 7.88
// --Encode transfer:  0xa9059cbb0000000000000000000000001329f875b2af89dc6e1438bb8d232188f9474ba1000000000000000000000000000000000000000000000000002386f26fc10000
// --Balance after tf: 7.87
