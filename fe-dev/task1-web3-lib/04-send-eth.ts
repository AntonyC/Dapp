// The Signer class is abstract and cannot be instantiated directly;
//     We need to use one of its subclasses, such as the Wallet class.
// The Wallet class inherits from the Signer class.

import { ethers } from "ethers";
import { provider } from "./utils-sepolia.ts";

// wallet1: created by random
const walletRandom = ethers.Wallet.createRandom();
const wallet1 = walletRandom.connect(provider);
const mnemonic = wallet1.mnemonic;

// wallet2: created by private key
const privateKey = process.env.PK || "";
const wallet2 = new ethers.Wallet(privateKey, provider);

// wallet3: created by mnemonic
const wallet3 = ethers.Wallet.fromPhrase(mnemonic?.phrase || "");

async function main() {
  console.log(`wallet1 address: ${await wallet1.getAddress()}`);
  console.log(`wallet2 address: ${await wallet2.getAddress()}`);
  console.log(`wallet3 address: ${await wallet3.getAddress()}`);
  console.log(`wallet1 mnmonic: ${wallet1.mnemonic?.phrase}`);
  console.log(`wallet2 private key: ${wallet2.privateKey}`);
  const txCount1 = await provider.getTransactionCount(wallet1);
  const txCount2 = await provider.getTransactionCount(wallet2);
  console.log(`wallet1 tx count: ${txCount1}`);
  console.log(`wallet2 tx count: ${txCount2}`);

  // 1. Before sending
  console.log(`\Before sending, check balance`);
  console.log(
    `wallet1: ${ethers.formatEther(await provider.getBalance(wallet1))} ETH`
  );
  console.log(
    `wallet2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
  // 2. Create transaction
  const tx = {
    to: await wallet1.getAddress(),
    value: ethers.parseEther("0.001"),
  };
  // 3. Send transaction
  console.log("Sending transaction...");
  const receipt = await wallet2.sendTransaction(tx);
  await receipt.wait();
  console.log(receipt); // 打印交易详情
  // 4. After sending, check balance
  console.log(`\nAfter sending, check balance`);
  console.log(
    `wallet1: ${ethers.formatEther(await provider.getBalance(wallet1))} ETH`
  );
  console.log(
    `wallet2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
}

main();
