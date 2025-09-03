import { ethers } from "ethers";
import { provider, addrBAYC, abiERC721 } from "./utils-mainnet.ts";

// Create ERC721 contract instance
const conERC721 = new ethers.Contract(addrBAYC, abiERC721, provider);

// ERC165 identifier of ERC721
const selectorERC721 = "0x80ac58cd";

const main = async () => {
  try {
    // 1. Read ERC721 contract
    const nameERC721 = await conERC721.name();
    const symbolERC721 = await conERC721.symbol();
    console.group("\n1. 读取ERC721合约信息");
    console.log(`名称: ${nameERC721}`);
    console.log(`代号: ${symbolERC721}`);
    console.groupEnd();

    // 2. To determine whether a contract follows the ERC721 standard by ERC165’s supportsInterface
    const isERC721 = await conERC721.supportsInterface(selectorERC721);
    console.group("\n2. whether a contract follows the ERC721 standard");
    console.log(`Is ERC721: ${isERC721}`);
  } catch (e) {
    console.log("Is not ERC721", e);
  }
};

main();

// 1. 读取ERC721合约信息
//   名称: BoredApeYachtClub
//   代号: BAYC

// 2. whether a contract follows the ERC721 standard
//   Is ERC721: true
