import { ethers } from "ethers";
import { provider, addrAirdrop, addrWETH } from "./utils-sepolia.ts";

const wallet = new ethers.Wallet(process.env.PK || "", provider);
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];
const conWETH = new ethers.Contract(addrWETH, abiWETH, wallet);

// 1. Create HD wallet
console.log("\n1. Create HD wallet");
const mnemonic =
  "embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor";
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

// 2. Derive 20 wallets by an HD wallet
console.log("\n2. Derive 20 wallets by an HD wallet");
const numWallet = 20;
// Derive path：m / purpose' / coin_type' / account' / change / address_index
// Switch the last address_index to derive a new wallet
let basePath = "44'/60'/0'/0";
let wallets: ethers.Wallet[] = [];
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  //Address to transfer
  wallets.push(walletNew);
}
// 3. Amounts to transfer
const amount = ethers.parseEther("0.0001");
console.log(`Sent amount: ${amount}`);
console.groupEnd();
const main = async () => {
  // Read balance of ETH and WETH
  console.group("\n3. Read balance of ETH and WETH");
  await printBalance("wallet", wallet.address);
  const balance = await printBalance("before", wallets[19].address);
  console.groupEnd();

  if (
    ethers.formatEther(balance.balanceETH) > ethers.formatEther(amount) &&
    ethers.formatEther(balance.balanceWETH) >= ethers.formatEther(amount)
  ) {
    // 4. Batch collect ETH
    console.log("\n4. Batch collect ETH of 20 wallets");
    const txSendETH = {
      to: wallet.address,
      value: amount,
    };
    let txs: Promise<ethers.TransactionReceipt | null>[] = [];
    for (let i = 0; i < numWallet; i++) {
      // connect wallet to provider
      let walletiWithProvider = wallets[i].connect(provider);
      let tx = await walletiWithProvider.sendTransaction(txSendETH);
      console.log(
        `Start ETH collection: ${i + 1}th ${walletiWithProvider.address}`
      );
      txs.push(tx.wait());
    }
    await Promise.all(txs);
    console.log("Finished ETH collection");

    // 5. Batch collect WETH
    console.log("\n5. Batch collect WETH of 20 wallets");
    txs = [];
    for (let i = 0; i < numWallet; i++) {
      // connect wallet to provider
      let walletiWithProvider = wallets[i].connect(provider);
      // connect contract to new wallet
      let contractConnected = conWETH.connect(walletiWithProvider) as any;
      let tx = await contractConnected.transfer(wallet.address, amount);
      console.log(
        `Start WETH collection: ${i + 1}th ${walletiWithProvider.address}`
      );
      txs.push(tx.wait());
    }
    await Promise.all(txs);
    console.log("Finished WETH collection");

    // 6. 读取一个地址在归集后的ETH和WETH余额
    console.group("\n6. Read a wallet's balance after collection");
    await printBalance("after", wallets[19].address);
    await printBalance("wallet", wallet.address);
    console.groupEnd();
  }
};

async function printBalance(prefix: string, address: string) {
  const balanceETH = await provider.getBalance(address);
  const balanceWETH = (await conWETH.balanceOf(address)) as bigint;
  console.log(
    prefix,
    " ETH: ",
    ethers.formatEther(balanceETH),
    " Token: ",
    ethers.formatEther(balanceWETH),
    address
  );
  return { balanceETH, balanceWETH };
}

main();

// 1. Create HD wallet

// 2. Derive 20 wallets by an HD wallet
// Sent amount: 100000000000000

// 3. Read balance of ETH and WETH
//   wallet  ETH:  1.265670352359999855  Token:  0.1 0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927
//   before  ETH:  0.0002  Token:  0.0002 0xe3A9230836b367267035eeC6A40aBaC55acB075E

// 4. Batch collect ETH of 20 wallets
// Start ETH collection: 1th 0x0a963EddbDD870126F53d1DeBdD120817f36673d
// Start ETH collection: 2th 0x37D683D0CbAc9f2Aea66aBAD8C8DA19DB22D0394
// Start ETH collection: 3th 0xB102473f6d20EBac1Cc6211Df9Bb298F74348A24
// Start ETH collection: 4th 0x44c1D15d03552109Eeae52061881ac1FB8f3559b
// Start ETH collection: 5th 0xf379Ea41B526cE4859c4C14A8f1725F12202417D
// Start ETH collection: 6th 0xcFf5E66CB377fA53bb23c30065ae3f4D96A50016
// Start ETH collection: 7th 0x7e0f5Eca89402B6218E35496cF4DEc95c08a696f
// Start ETH collection: 8th 0xfa24eFaFFee37BfA5Aec29c6528A194b036A4239
// Start ETH collection: 9th 0xcdCa3144B8d0D48c60e11aCd609Fa3802735FF96
// Start ETH collection: 10th 0xe3B0837D9aB13F1640B2a24F0B724D825d40db5D
// Start ETH collection: 11th 0x34E8b16D3A3093e31c6D6Ec2161E8eD0c760691B
// Start ETH collection: 12th 0xED0eBb7ecf4a2Bf87927E00B897e199C099f37D0
// Start ETH collection: 13th 0xfC7e6Cd85a0751Cf9124d851f199A312DF4e8646
// Start ETH collection: 14th 0x0245beD2e18DB58c92166a0ef92f302fd09425bE
// Start ETH collection: 15th 0xb8a5ba90710De0f9760Da98d2E74C6cB90E760B2
// Start ETH collection: 16th 0x24597bfAA70c22686130B8502d5D480B5AAE8F85
// Start ETH collection: 17th 0x76175630BFB19Ba12721cf34E0AB5Bd8C791643c
// Start ETH collection: 18th 0x8e953389a43bfB7002aD8Ceb8d6C36C97BE023Cc
// Start ETH collection: 19th 0x21b0808646720ff39eDA0E6690aA18A8576368bA
// Start ETH collection: 20th 0xe3A9230836b367267035eeC6A40aBaC55acB075E
// Finished ETH collection

// 5. Batch collect WETH of 20 wallets
// Start WETH collection: 1th 0x0a963EddbDD870126F53d1DeBdD120817f36673d
// Start WETH collection: 2th 0x37D683D0CbAc9f2Aea66aBAD8C8DA19DB22D0394
// Start WETH collection: 3th 0xB102473f6d20EBac1Cc6211Df9Bb298F74348A24
// Start WETH collection: 4th 0x44c1D15d03552109Eeae52061881ac1FB8f3559b
// Start WETH collection: 5th 0xf379Ea41B526cE4859c4C14A8f1725F12202417D
// Start WETH collection: 6th 0xcFf5E66CB377fA53bb23c30065ae3f4D96A50016
// Start WETH collection: 7th 0x7e0f5Eca89402B6218E35496cF4DEc95c08a696f
// Start WETH collection: 8th 0xfa24eFaFFee37BfA5Aec29c6528A194b036A4239
// Start WETH collection: 9th 0xcdCa3144B8d0D48c60e11aCd609Fa3802735FF96
// Start WETH collection: 10th 0xe3B0837D9aB13F1640B2a24F0B724D825d40db5D
// Start WETH collection: 11th 0x34E8b16D3A3093e31c6D6Ec2161E8eD0c760691B
// Start WETH collection: 12th 0xED0eBb7ecf4a2Bf87927E00B897e199C099f37D0
// Start WETH collection: 13th 0xfC7e6Cd85a0751Cf9124d851f199A312DF4e8646
// Start WETH collection: 14th 0x0245beD2e18DB58c92166a0ef92f302fd09425bE
// Start WETH collection: 15th 0xb8a5ba90710De0f9760Da98d2E74C6cB90E760B2
// Start WETH collection: 16th 0x24597bfAA70c22686130B8502d5D480B5AAE8F85
// Start WETH collection: 17th 0x76175630BFB19Ba12721cf34E0AB5Bd8C791643c
// Start WETH collection: 18th 0x8e953389a43bfB7002aD8Ceb8d6C36C97BE023Cc
// Start WETH collection: 19th 0x21b0808646720ff39eDA0E6690aA18A8576368bA
// Start WETH collection: 20th 0xe3A9230836b367267035eeC6A40aBaC55acB075E
// Finished WETH collection

// 6. Read a wallet's balance after collection
//   after  ETH:  0.000099771331517992  Token:  0.0001 0xe3A9230836b367267035eeC6A40aBaC55acB075E
//   wallet  ETH:  1.267670352359999855  Token:  0.102 0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927

// wallet  ETH:  1.265670352359999855  Token:  0.1   0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927
// wallet  ETH:  1.267670352359999855  Token:  0.102 0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927
