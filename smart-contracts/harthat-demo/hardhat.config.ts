import {type HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks:{
    sepolia: {
      url:`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts:[`${process.env.PK}`]
    }
  },
};

export default config;

task("accounts", "Get all account addresses")
  .addParam("name", "The name of the user")
  .setAction(async (taskArgs, env) => {
    console.log(`Hello, ${taskArgs.name}!`);
    const accounts = await env.viem.getWalletClients();
    for (const account of accounts) {
      console.log('- ', account.account.address);
    }
  });
