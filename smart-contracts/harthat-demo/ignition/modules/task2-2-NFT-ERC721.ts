// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleNFTModule = buildModule("SimpleNFTModule", (m) => {

  const simpleNFT = m.contract("SimpleNFT", []);

  return { simpleNFT };
});

export default SimpleNFTModule;
