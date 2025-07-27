import {type HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks:{
    sepolia: {
      url:`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts:[`${process.env.PK}`]
    }
  },
};

export default config;

task("greett", "Greets a user")
  .addParam("name", "The name of the user")
  .setAction(async (taskArgs) => {
    console.log(`Hello, ${taskArgs.name}!`);
  });
