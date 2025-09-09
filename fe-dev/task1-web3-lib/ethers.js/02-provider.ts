// Without accessing users’ private keys, it can only read on-chain data but not write, which makes it safer than web3.js.

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// const provider = ethers.getDefaultProvider();
// We can get this URL from https://chainlist.org
const PUBLIC_MAINNET_URL = "https://eth.drpc.org";
const MY_SEPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;

const providerMain = new ethers.JsonRpcProvider(PUBLIC_MAINNET_URL);
const providerSepolia = new ethers.JsonRpcProvider(MY_SEPOLIA_URL);
const accountSepoliaAddr = "0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927";
const contractBeggerAddr = "0x975c45dd4355ba9379F4144619ecfC026e7cAa28";

const main = async () => {
  // ENS domains are not supported on the testnet yet
  const balance = await providerMain.getBalance("vitalik.eth");
  const balanceSepolia = await providerSepolia.getBalance(accountSepoliaAddr);

  console.log(
    `1. Balance: ${ethers.formatEther(balance)} ETH, ${ethers.formatEther(
      balanceSepolia
    )} ETH `
  );

  console.log(
    "2. Network: ",
    (await providerMain.getNetwork()).toJSON(),
    (await providerSepolia.getNetwork()).toJSON()
  );

  console.log(
    "3. Block number: ",
    await providerMain.getBlockNumber(),
    await providerSepolia.getBlockNumber()
  );

  console.log(
    "4. Transaction Count: ",
    await providerMain.getTransactionCount("vitalik.eth"),
    await providerSepolia.getTransactionCount(accountSepoliaAddr)
  );

  console.log(
    "5. Fee Data: ",
    await providerMain.getFeeData(),
    await providerSepolia.getFeeData()
  );

  console.log(
    "6. Block info: ",
    await providerMain.getBlock(0),
    await providerSepolia.getBlock(0)
  );

  console.log(
    "7. Byte code: ",
    await providerSepolia.getCode(contractBeggerAddr)
  );
};

main();
