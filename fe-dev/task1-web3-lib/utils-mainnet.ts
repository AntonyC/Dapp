import { ethers } from "ethers";

const PUBLIC_MAINNET_URL = "https://eth.drpc.org";
export const provider = new ethers.JsonRpcProvider(PUBLIC_MAINNET_URL);

export const addrBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

export const abiERC721 = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function supportsInterface(bytes4) public view returns(bool)",
];
