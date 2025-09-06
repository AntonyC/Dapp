// airdrop contract: perform batch transfers in a single transaction, saving gas fees.

import { ethers } from "ethers";
import { provider, addrAirdrop, addrWETH } from "./utils-sepolia.ts";

const wallet = new ethers.Wallet(process.env.PK || "", provider);

// 1. Create HD wallet
console.group("\n1. Create HD wallet");
const mnemonic =
  "embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor";
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
console.log(hdNode);
console.groupEnd();

// 2. Derive 20 wallets by an HD wallet
console.group("\n2. Derive 20 wallets by an HD wallet");
const numWallet = 20;
// Derive path：m / purpose' / coin_type' / account' / change / address_index
// Switch the last address_index to derive a new wallet
let basePath = "44'/60'/0'/0";
let wallets: string[] = [];
for (let i = 0; i < numWallet; i++) {
  let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
  let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
  //Address to transfer
  wallets.push(walletNew.address);
}
console.log(wallets);
// Amounts to transfer
const amounts = Array(20).fill(ethers.parseEther("0.0001"));
console.log("Sent amounts: ", amounts);
console.groupEnd();

// 3. Declear contracts
const abiAirdrop = [
  "function multiTransferToken(address,address[],uint256[]) external",
  "function multiTransferETH(address[],uint256[]) public payable",
];
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
  "function approve(address, uint256) public returns (bool)",
];
const conAirdrop = new ethers.Contract(addrAirdrop, abiAirdrop, wallet);
const conWETH = new ethers.Contract(addrWETH, abiWETH, wallet);

const main = async () => {
  // 4. Read balance of ETH and WETH
  console.group("\n3. Read balance of ETH and WETH from wallet 10");
  const balanceWETH = await conWETH.balanceOf(wallets[10]);
  console.log(`Balance of WETH before: ${ethers.formatEther(balanceWETH)}`);
  const balanceETH = await provider.getBalance(wallets[10]);
  console.log(`Balance of ETH before: ${ethers.formatEther(balanceETH)}`);
  console.groupEnd();
  printMyBalance();

  // 5. Call multiTransferETH() to send 0.0001 ETH to each wallet
  console.group(
    "\n4. Call multiTransferETH() to send 0.0001 ETH to each wallet"
  );
  const tx = await conAirdrop.multiTransferETH(wallets, amounts, {
    value: ethers.parseEther("0.002"),
  });
  await tx.wait();

  const balanceETH2 = await provider.getBalance(wallets[10]);
  console.log(`Balance ETH after: ${ethers.formatEther(balanceETH2)}`);
  console.groupEnd();
  // 6. Call multiTransferToken()to send 0.0001 WETH to each wallet
  console.group(
    "\n5. Call multiTransferToken()to send 0.0001 WETH to each wallets"
  );
  // Approve WETH to Airdrop contract
  const txApprove = await conWETH.approve(addrAirdrop, ethers.parseEther("1"));
  await txApprove.wait();

  const tx2 = await conAirdrop.multiTransferToken(addrWETH, wallets, amounts);
  await tx2.wait();

  const balanceWETH2 = await conWETH.balanceOf(wallets[10]);
  console.log(`Balance of WETH after: ${ethers.formatEther(balanceWETH2)}`);
  printMyBalance();
  console.groupEnd();
};

async function printMyBalance() {
  const myETH = await provider.getBalance(wallet);
  const myToken = await conWETH.balanceOf(wallet.getAddress());
  console.log(
    "MyETH: ",
    ethers.formatEther(myETH),
    "MyToken: ",
    ethers.formatEther(myToken)
  );
}

main();

// 1. Create HD wallet
//   HDNodeWallet {
//     provider: null,
//     address: '0xbc6f8Aca1771E77383A5fa827C359bE39Cd476ad',
//     publicKey: '0x03cd61b9242b5d7df54669cbb816052b9b549db41c36bae40f879f8196e9577704',
//     fingerprint: '0x7ba04d17',
//     parentFingerprint: '0x6ad4dd2a',
//     mnemonic: Mnemonic {
//       phrase: 'embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor',
//       password: '',
//       wordlist: LangEn { locale: 'en' },
//       entropy: '0x48749f841cafb5647baed4dd8d94be22b1d74c0401bfd141f388199f5acbd95b'
//     },
//     chainCode: '0x32204d7d46b95559a2b143426613cbff498b616bf1a8b01489378a27e749bc7a',
//     path: "m/44'/60'/0'/0/0",
//     index: 0,
//     depth: 5
//   }

// 2. Derive 20 wallets by an HD wallet
//   [
//     '0x0a963EddbDD870126F53d1DeBdD120817f36673d',
//     '0x37D683D0CbAc9f2Aea66aBAD8C8DA19DB22D0394',
//     '0xB102473f6d20EBac1Cc6211Df9Bb298F74348A24',
//     '0x44c1D15d03552109Eeae52061881ac1FB8f3559b',
//     '0xf379Ea41B526cE4859c4C14A8f1725F12202417D',
//     '0xcFf5E66CB377fA53bb23c30065ae3f4D96A50016',
//     '0x7e0f5Eca89402B6218E35496cF4DEc95c08a696f',
//     '0xfa24eFaFFee37BfA5Aec29c6528A194b036A4239',
//     '0xcdCa3144B8d0D48c60e11aCd609Fa3802735FF96',
//     '0xe3B0837D9aB13F1640B2a24F0B724D825d40db5D',
//     '0x34E8b16D3A3093e31c6D6Ec2161E8eD0c760691B',
//     '0xED0eBb7ecf4a2Bf87927E00B897e199C099f37D0',
//     '0xfC7e6Cd85a0751Cf9124d851f199A312DF4e8646',
//     '0x0245beD2e18DB58c92166a0ef92f302fd09425bE',
//     '0xb8a5ba90710De0f9760Da98d2E74C6cB90E760B2',
//     '0x24597bfAA70c22686130B8502d5D480B5AAE8F85',
//     '0x76175630BFB19Ba12721cf34E0AB5Bd8C791643c',
//     '0x8e953389a43bfB7002aD8Ceb8d6C36C97BE023Cc',
//     '0x21b0808646720ff39eDA0E6690aA18A8576368bA',
//     '0xe3A9230836b367267035eeC6A40aBaC55acB075E'
//   ]
//   Sent amounts:  [
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n,
//     100000000000000n, 100000000000000n
//   ]

// 3. Read balance of ETH and WETH from wallet 10
//   Balance of WETH before: 0.0
//   Balance of ETH before: 0.0

// 4. Call multiTransferETH() to send 0.0001 ETH to each wallet
//   MyETH:  1.219675718684976675 MyToken:  0.104
//   Balance ETH after: 0.0001

// 5. Call multiTransferToken()to send 0.0001 WETH to each wallets
//   Balance of WETH after: 0.0001

// MyETH:  1.219675718684976675 MyToken:  0.104
// MyETH:  1.217671869788365188 MyToken:  0.102
//         0.0020038488966114265
